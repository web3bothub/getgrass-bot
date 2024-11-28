import chalk from 'chalk'
import consoleStamp from 'console-stamp'
import ora from 'ora'
import { v4 as uuidV4 } from 'uuid'
import WebSocket from 'ws'
import { getIpAddress, getProxyAgent, getRandomInt } from './utils.js'
consoleStamp(console, {
  format: ':date(yyyy/mm/dd HH:MM:ss.l)'
})
process.setMaxListeners(0)

const getUnixTimestamp = () => Math.floor(Date.now() / 1000)

const PING_INTERVAL = 20 * 1000

const WEBSOCKET_URLS = [
  'wss://proxy2.wynd.network:4444',
  'wss://proxy2.wynd.network:4650',
]

class App {
  constructor(user, proxy, version = '4.28.2') {
    this.proxy = proxy
    this.userId = user.id
    this.version = version
    this.browserId = null
    this.websocket = null
    this.userAgent = user.userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  }

  async start() {
    this.browserId ??= uuidV4()

    if (this.proxy) {
      console.info(`request with proxy: ${chalk.blue(this.proxy)}...`)
    }

    // Get the IP address of the proxy
    console.info(`Getting IP address...`, this.proxy)
    try {
      const ipAddress = await getIpAddress(this.proxy)
      console.info(`IP address: ${chalk.blue(ipAddress)}`)

      if (this.proxy && !ipAddress.includes(new URL(this.proxy).hostname)) {
        console.error(`[ERROR] Proxy IP address does not match! maybe the proxy is not working...`)
        // return
      }
    } catch (e) {
      console.error(`[ERROR] Could not get IP address! ${chalk.red(e)}`)
      return
    }

    // Loop through each websocketUrl in case the other does not work
    const websocketUrl = WEBSOCKET_URLS[getRandomInt(0, WEBSOCKET_URLS.length - 1)]

    const isWindows = this.userAgent.includes('Windows') || this.userAgent.includes('Win64') || this.userAgent.includes('Win32')

    let options = {
      headers: {
        "Pragma": "no-cache",
        "User-Agent": this.userAgent,
        OS: isWindows ? 'Windows' : 'Mac',
        Browser: 'Chrome',
        Platform: 'Desktop',
        // "Origin": "chrome-extension://lkbnfiajjmbhnfledhphioinpickokdi",
        "Sec-WebSocket-Version": "13",
        'Accept-Language': 'uk-UA,uk;q=0.9,en-US;q=0.8,en;q=0.7',
        "Cache-Control": "no-cache",
        "priority": "u=1, i",
      },
      handshakeTimeout: 30000,
      rejectUnauthorized: false,
      // ca: fs.readFileSync(path.join(__dirname, '/ssl/websocket.pem')),
    }

    if (this.proxy) {
      console.log(`configuring websocket proxy agent...(${this.proxy})`)
      options.agent = await getProxyAgent(this.proxy)
      console.log('websocket proxy agent configured.')
    }

    this.websocket = new WebSocket(websocketUrl, options)

    this.websocket.on('open', async function (e) {
      console.log("[wss] Websocket connected!")
      this.sendPing()
    }.bind(this))

    this.websocket.on('message', async function (data) {
      console.log(`[wss] received message: ${chalk.blue(data)}`)

      let parsedMessage
      try {
        parsedMessage = JSON.parse(data)
      } catch (e) {
        console.error(`[wss] Could not parse WebSocket message! ${chalk.red(data)}`)
        console.error(`[wss] ${chalk.red(e)}`)
        return
      }

      switch (parsedMessage.action) {
        case 'AUTH':
          const message = JSON.stringify({
            id: parsedMessage.id,
            origin_action: parsedMessage.action,
            result: {
              browser_id: this.browserId,
              user_id: this.userId,
              user_agent: this.userAgent,
              timestamp: getUnixTimestamp(),
              device_type: "desktop",
              version: this.version,
              // product: "Grass",
              // copyright: "© Grass Foundation, 2024. All rights reserved.",
            }
          })
          this.sendMessage(message)
          console.log(`[wss] (AUTH) message sent: ${chalk.green(message)}`)
          break
        case 'PONG':
          console.log(`[wss] received pong: ${chalk.green(data)}`)
          break
        default:
          console.error(`[wss] No RPC action ${chalk.red(parsedMessage.action)}!`)
          break
      }
    }.bind(this))

    this.websocket.on('close', async function (code) {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.log(`[wss] Connection died: ${chalk.red(code)}`)
      setTimeout(() => {
        this.start()
      }, PING_INTERVAL)
    }.bind(this))

    this.websocket.on('error', function (error) {
      console.error(`[wss] ${error}`)
      this.websocket.terminate()

      setTimeout(() => {
        this.start()
      }, PING_INTERVAL)
    }.bind(this))
  }

  async sendPing() {
    setInterval(() => {
      const message = JSON.stringify({
        id: uuidV4(),
        version: '1.0.0',
        action: 'PING',
        data: {},
      })
      this.sendMessage(message)
      console.log(`[wss] send ping: ${chalk.green(message)}`)
    }, PING_INTERVAL)
  }

  async sendMessage(message) {
    if (this.websocket.readyState !== WebSocket.OPEN) {
      console.error(`[wss] WebSocket is not open!`)
      return
    }

    this.websocket.send(message)
    console.log(`[wss] message sent: ${chalk.green(message)}`)
  }
}

export async function run(user, proxy) {
  const app = new App(user, proxy)

  const spinner = ora({ text: 'Loading…' }).start()
  let prefixText = `[user:${chalk.green(user.id.substring(-12))}]`

  if (proxy) {
    const [ip, port] = new URL(proxy).host.split(':')
    prefixText += `[proxy:${chalk.green(ip)}:${chalk.green(port)}]`
  }

  spinner.prefixText = prefixText

  spinner.succeed(`Started!`)

  try {
    await app.start()
  } catch (e) {
    console.error(e)
    await app.start()
  }

  process.on('SIGINT', function () {
    console.log('Caught interrupt signal')
    spinner.stop()
    process.exit()
  })
}
