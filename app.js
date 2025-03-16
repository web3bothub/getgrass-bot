import axios from 'axios'
import chalk from 'chalk'
import consoleStamp from 'console-stamp'
import fs from 'fs/promises'
import ora from 'ora'
import { v4 as uuidV4 } from 'uuid'
import WebSocket from 'ws'
import { getIpAddress, getProxyAgent, getRandomInt } from './utils.js'

consoleStamp(console, {
  format: ':date(yyyy/mm/dd HH:MM:ss.l)'
})
process.setMaxListeners(0)

const getUnixTimestamp = () => Math.floor(Date.now() / 1000)

const PING_INTERVAL = 5 * 1000
const CHECKIN_INTERVAL = 2 * 60 * 1000 // 2 minutes
const DIRECTOR_SERVER = "https://director.getgrass.io"
const DEVICE_FILE = "devices.json"

// 错误模式，用于识别需要禁用代理的情况
const ERROR_PATTERNS = [
  "Host unreachable",
  "[SSL: WRONG_VERSION_NUMBER]",
  "invalid length of packed IP address string",
  "Empty connect reply",
  "Device creation limit exceeded",
  "sent 1011 (internal error) keepalive ping timeout"
]

class App {
  constructor(user, proxy, deviceId = null, version = '5.2.0') {
    this.proxy = proxy
    this.userId = user.id
    this.version = version
    this.browserId = deviceId || uuidV4()
    this.websocket = null
    this.userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    this.pingInterval = null
    this.checkinInterval = null
    this.spinner = null
  }

  /**
   * 从director服务器获取WebSocket端点和token
   */
  async getWsEndpoints() {
    console.info(`[checkin] Getting WebSocket endpoints from director...`)
    try {
      const response = await axios.post(`${DIRECTOR_SERVER}/checkin`, {
        browserId: this.browserId,
        userId: this.userId,
        version: this.version,
        // extensionId: "lkbnfiajjmbhnfledhphioinpickokdi",
        userAgent: this.userAgent,
        deviceType: "desktop"
      })

      if (response.status === 201) {
        const destinations = response.data.destinations || []
        const token = response.data.token || ""
        const websocketUrls = destinations.map(dest => `wss://${dest}?token=${token}`)
        console.info(`[checkin] Received WebSocket endpoints: ${chalk.blue(websocketUrls)}`)
        return { websocketUrls, token }
      } else {
        console.error(`[checkin] Failed with status: ${response.status}`)
        return { websocketUrls: [], token: "" }
      }
    } catch (error) {
      console.error(`[checkin] Error: ${chalk.red(error.message)}`)
      return { websocketUrls: [], token: "" }
    }
  }

  async start() {
    if (this.proxy) {
      console.info(`Request with proxy: ${chalk.blue(this.proxy)}...`)
    }

    // 获取代理的IP地址
    console.info(`Getting IP address...`, this.proxy)
    try {
      const ipAddress = await getIpAddress(this.proxy)
      console.info(`IP address: ${chalk.blue(ipAddress)}`)

      if (this.proxy && !ipAddress.includes(new URL(this.proxy).hostname)) {
        console.error(`[Warning] Proxy IP address does not match! maybe the proxy is not working...`)
        // return false
      }
    } catch (e) {
      console.error(`[ERROR] Could not get IP address! ${chalk.red(e)}`)
      if (this.isErrorCritical(e.message)) {
        console.error(`[ERROR] Critical proxy error.`)
        return false
      }
    }

    // 从director获取WebSocket端点
    const { websocketUrls, token } = await this.getWsEndpoints()
    if (websocketUrls.length === 0) {
      console.error(`[ERROR] No WebSocket endpoints available`)
      return false
    }

    // 随机选择一个WebSocket端点
    const websocketUrl = websocketUrls[getRandomInt(0, websocketUrls.length - 1)]

    const isWindows = this.userAgent.includes('Windows') || this.userAgent.includes('Win64') || this.userAgent.includes('Win32')

    let options = {
      headers: {
        "Pragma": "no-cache",
        "User-Agent": this.userAgent,
        OS: 'Mac',
        Browser: 'Mozilla',
        Platform: 'Desktop',
        "Origin": "chrome-extension://lkbnfiajjmbhnfledhphioinpickokdi",
        "Sec-WebSocket-Version": "13",
        'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
        "Cache-Control": "no-cache",
        "priority": "u=1, i",
      },
      handshakeTimeout: 30000,
      rejectUnauthorized: false,
    }

    if (this.proxy) {
      console.log(`Configuring websocket proxy agent...(${this.proxy})`)
      options.agent = await getProxyAgent(this.proxy)
      console.log('Websocket proxy agent configured.')
    }

    this.websocket = new WebSocket(websocketUrl, options)

    this.websocket.on('open', async function () {
      console.log(`[wss] Websocket connected to ${chalk.green(websocketUrl)}!`)
      this.startPing()
      this.startCheckinInterval()
    }.bind(this))

    this.websocket.on('message', async function (data) {
      let message = data.toString()

      let parsedMessage
      try {
        parsedMessage = JSON.parse(message)
      } catch (e) {
        console.error(`[wss] Could not parse WebSocket message! ${chalk.red(message)}`)
        console.error(`[wss] ${chalk.red(e)}`)
        return
      }

      switch (parsedMessage.action) {
        case 'AUTH':
          const authResponse = JSON.stringify({
            id: parsedMessage.id,
            origin_action: parsedMessage.action,
            result: {
              browser_id: this.browserId,
              user_id: this.userId,
              user_agent: this.userAgent,
              timestamp: getUnixTimestamp(),
              device_type: "desktop",
              version: this.version,
            }
          })
          this.sendMessage(authResponse)
          console.log(`[wss] (AUTH) -->: ${chalk.green(authResponse)}`)
          break

        case 'PONG':
          console.log(`[wss] <--: ${chalk.green(message)}`)
          break

        case 'HTTP_REQUEST':
          await this.handleHttpRequest(parsedMessage)
          break

        default:
          console.error(`[wss] No handler for message: ${chalk.blue(message)}`)
          console.error(`[wss] No handler for action ${chalk.red(parsedMessage.action)}!`)
          break
      }
    }.bind(this))

    this.websocket.on('close', async function (code) {
      console.log(`[wss] Connection closed: ${chalk.red(code)}`)
      this.clearIntervals()

      setTimeout(() => {
        this.start()
      }, PING_INTERVAL)
    }.bind(this))

    this.websocket.on('error', function (error) {
      console.error(`[wss] ${chalk.red(error.message)}`)

      this.websocket.terminate()
      this.clearIntervals()

      setTimeout(() => {
        this.start()
      }, PING_INTERVAL)
    }.bind(this))

    return true
  }

  isErrorCritical(errorMessage) {
    return ERROR_PATTERNS.some(pattern => errorMessage.includes(pattern)) ||
      errorMessage.includes('Rate limited')
  }

  clearIntervals() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
      this.pingInterval = null
    }

    if (this.checkinInterval) {
      clearInterval(this.checkinInterval)
      this.checkinInterval = null
    }
  }

  startPing() {
    // 清除之前的interval
    if (this.pingInterval) {
      clearInterval(this.pingInterval)
    }

    this.pingInterval = setInterval(() => {
      const message = JSON.stringify({
        id: uuidV4(),
        version: '1.0.0',
        action: 'PING',
        data: {},
      })
      this.sendMessage(message)
    }, PING_INTERVAL)
  }

  startCheckinInterval() {
    // 清除之前的interval
    if (this.checkinInterval) {
      clearInterval(this.checkinInterval)
    }

    this.checkinInterval = setInterval(async () => {
      console.log(`[checkin] Performing periodic checkin...`)
      await this.getWsEndpoints()
    }, CHECKIN_INTERVAL)
  }

  async handleHttpRequest(message) {
    try {
      const data = message.data || {}
      const method = (data.method || 'GET').toUpperCase()
      const url = data.url
      const headers = data.headers || {}
      const body = data.body

      console.log(`[http] Handling HTTP request: ${method} ${url}`)

      const response = await axios({
        method,
        url,
        headers,
        data: body,
        responseType: 'arraybuffer',
        validateStatus: () => true, // 接受所有状态码
      })

      // 将响应体转换为base64
      const bodyBase64 = Buffer.from(response.data).toString('base64')

      const result = {
        url,
        status: response.status,
        status_text: '',
        headers: response.headers,
        body: bodyBase64
      }

      const reply = {
        id: message.id,
        origin_action: 'HTTP_REQUEST',
        result
      }

      this.sendMessage(JSON.stringify(reply))
      console.log(`[http] HTTP response sent for ${method} ${url}, status: ${response.status}`)

      if (response.status === 429) {
        console.error(`[http] Rate limited! Status 429 returned.`)
        throw new Error('Rate limited')
      }

    } catch (error) {
      console.error(`[http] Error handling HTTP request: ${chalk.red(error.message)}`)
      throw error
    }
  }

  async sendMessage(message) {
    if (this.websocket.readyState !== WebSocket.OPEN) {
      console.error(`[wss] WebSocket is not open!`)
      return
    }

    this.websocket.send(message)
    console.log(`[wss] -->: ${chalk.green(typeof message === 'string' ? message : JSON.stringify(message))}`)
  }
}

/**
 * 加载设备ID映射，每个代理对应一个设备ID
 */
async function loadDeviceMapping() {
  try {
    const data = await fs.readFile(DEVICE_FILE, 'utf8')
    const mappings = JSON.parse(data)
    return mappings || {}
  } catch (error) {
    console.log(`No device mappings found, will create a new one.`)
    return {}
  }
}

/**
 * 保存设备ID映射
 */
async function saveDeviceMapping(deviceMapping) {
  try {
    await fs.writeFile(DEVICE_FILE, JSON.stringify(deviceMapping, null, 2))
    console.log(`Device mappings saved successfully.`)
  } catch (error) {
    console.error(`Error saving device mappings: ${error.message}`)
  }
}

/**
 * 为代理获取或创建设备ID
 */
async function getDeviceIdForProxy(proxy) {
  const deviceMapping = await loadDeviceMapping()

  if (deviceMapping[proxy]) {
    console.log(`Using existing device ID for proxy ${proxy}: ${deviceMapping[proxy]}`)
    return deviceMapping[proxy]
  }

  // 如果该代理没有对应的设备ID，创建一个新的
  const newDeviceId = uuidV4()
  deviceMapping[proxy] = newDeviceId
  await saveDeviceMapping(deviceMapping)

  console.log(`Created new device ID for proxy ${proxy}: ${newDeviceId}`)
  return newDeviceId
}

export async function run(user, proxy = null) {
  let deviceId = null

  // 如果提供了代理，为该代理获取或创建专用设备ID
  if (proxy) {
    deviceId = await getDeviceIdForProxy(proxy)
  } else {
    // 没有代理的情况下，创建一个通用设备ID
    deviceId = uuidV4()
  }

  const app = new App(user, proxy, deviceId)

  const spinner = ora({ text: 'Loading…' }).start()
  let prefixText = `[user:${chalk.green(user.id.substring(0, 12))}][device:${chalk.green(deviceId.substring(0, 8))}]`

  if (proxy) {
    try {
      const [ip, port] = new URL(proxy).host.split(':')
      prefixText += `[proxy:${chalk.green(ip)}:${chalk.green(port)}]`
    } catch (e) {
      prefixText += `[proxy:${chalk.green(proxy)}]`
    }
  }

  spinner.prefixText = prefixText
  spinner.succeed(`Started!`)
  app.spinner = spinner

  try {
    const success = await app.start()
    if (!success) {
      console.error(`Failed to start.`)
      return false
    }
  } catch (e) {
    console.error(e)
    return false
  }

  return true
}

// 为了确保程序能够干净地退出
process.on('SIGINT', function () {
  console.log('Caught interrupt signal')
  process.exit()
})
