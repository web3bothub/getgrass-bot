import chalk from 'chalk'
import fs from 'fs'
import ora from 'ora'
import path from 'path'
import { fileURLToPath } from 'url'
import { NIL, v4 as uuidV4, v5 as uuidV5 } from 'uuid'
import WebSocket from 'ws'
import { getIpAddress, getProxyAgent, getRandomInt, sleep } from './utils.js'
const __filename = fileURLToPath(import.meta.url) // get the resolved path to the file
const __dirname = path.dirname(__filename) // get the name of the directory

const getUnixTimestamp = () => Math.floor(Date.now() / 1000)

const PING_INTERVAL = 20 * 1000

const WEBSOCKET_URLS = [
  "wss://proxy.wynd.network:4650",
  "wss://proxy.wynd.network:4444",
]

const STATUSES = {
  CONNECTED: "CONNECTED",
  DISCONNECTED: "DISCONNECTED",
  DEAD: "DEAD",
  CONNECTING: "CONNECTING",
}

let cookieJars = {}

const performHttpRequest = async (params) => {
  console.log(`performHttpRequest`)
  const sessionHasCookieJar = !!cookieJars[params.session_id]

  if (!sessionHasCookieJar) {
    cookieJars[params.session_id] = new CookieJar()

    // Delete the new cookie jar instance for this session after 24hrs
    const cookieJarTimeout = setTimeout(() => {
      delete cookieJars[params.session_id]
      console.log(`[COOKIE] Cookie Jar for ${params.session_id} is deleted`)
      clearTimeout(cookieJarTimeout)
    }, COOKIE_JAR_LIFESPAN)
  }

  const extendedGot = got.extend({
    localAddress: params.device_ip,
    encoding: "base64",
    cookieJar: cookieJars[params.session_id],
    maxHeaderSize: 49152,
    hooks: {
      beforeRequest: [
        (options) => {
          let headers = {}

          for (const [key, value] of Object.entries(options.headers)) {
            const prettifiedHeader = prettifyHeaderKey(key)
            headers[prettifiedHeader] = value
          }

          options.headers = headers
        },
      ],
    },
  })

  const gotFetch = createFetch(extendedGot)

  // Whether to include cookies when sending request
  const credentialsMode = params.authenticated ? "include" : "omit"

  const requestOptions = {
    headers: params.headers,
    method: params.method,
    credentials: credentialsMode,
    mode: "cors",
    cache: "no-cache",
    redirect: "follow",
  }

  // If there is a request body, we decode it
  // and set it for the request.
  if (params.body) {
    const bufferBody = Buffer.from(params.body, "base64")
    requestOptions.body = bufferBody
  }

  let response = null
  try {
    response = await gotFetch(params.url, requestOptions)
  } catch (err) {
    console.error(
      "[FETCH ERROR]",
      params.device_ip,
      params.method,
      params.url,
      err
    )
    return
  }

  // response.headers is and iterable object Headers (not a json)
  // so we must manually copy before returning
  const headers = {}
  for (const [key, value] of response.headers.entries()) {
    headers[key] = value
  }
  // Delete the :status header
  delete headers[":status"]

  return {
    url: response.url,
    status: response.status,
    status_text: response.statusText,
    headers,
    body: response.body,
  }
}

class App {
  constructor(user, proxy, version = '4.26.2') {
    this.proxy = proxy
    this.userId = user.id
    this.version = version
    this.retries = 0
    this.browserId = null
    this.websocket = false
    this.userAgent = user.userAgent || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
    this.websocketStatus = STATUSES.DISCONNECTED
    this.lastLiveConnectionTimestamp = getUnixTimestamp()
  }

  async initialize() {
    this.browserId ??= uuidV5(this.proxy ?? '', NIL)

    if (this.proxy) {
      console.info(`[INITIALIZE] request with proxy: ${chalk.blue(this.proxy)}...`)
    }

    // Get the IP address of the proxy
    console.info(`[INITIALIZE] Getting IP address...`, this.proxy)
    const ipAddress = await getIpAddress(this.proxy)
    console.info(`[INITIALIZE] IP address: ${chalk.blue(ipAddress)}`)

    if (this.proxy && !ipAddress.includes(new URL(this.proxy).hostname)) {
      console.error(`[ERROR] Proxy IP address does not match! maybe the proxy is not working...`)
      return
    }

    if (this.retries > 2) {
      console.error(`[ERROR] too many retries(${this.retries}), sleeping...`)
      await sleep(getRandomInt(100, 6000))
    }

    // Loop through each websocketUrl in case the other does not work
    const websocketUrl = WEBSOCKET_URLS[this.retries % WEBSOCKET_URLS.length]

    let options = {
      headers: {
        'Host': 'proxy2.wynd.network:4650',
        'Connection': 'Upgrade',
        "Pragma": "no-cache",
        "Cache-Control": "no-cache",
        "User-Agent": this.userAgent,
        "Upgrade": "websocket",
        "Origin": "chrome-extension://lkbnfiajjmbhnfledhphioinpickokdi",
        "Sec-WebSocket-Version": "13",
        "Accept-Language": "en-US,en;q=0.9,id;q=0.8",
      },
      rejectUnauthorized: false,
      ca: fs.readFileSync(path.join(__dirname, '/ssl/websocket.pem')),
    }

    if (this.proxy) {
      options.agent = await getProxyAgent(this.proxy)
      console.log('websocket proxy agent configured.')
    }

    this.websocket = new WebSocket(websocketUrl, options)

    this.websocket.on('open', async function (e) {
      console.log("[OPENED] Websocket Open")
      this.lastLiveConnectionTimestamp = getUnixTimestamp()
      this.websocketStatus = STATUSES.CONNECTED
    }.bind(this))

    this.websocket.on('message', async function (message) {
      console.log(`[REVEIVED] received message: ${chalk.blue(message)}`)

      await sleep(getRandomInt(2, 80))

      // Update last live connection timestamp
      this.lastLiveConnectionTimestamp = getUnixTimestamp()

      let parsedMessage
      try {
        parsedMessage = JSON.parse(message)
      } catch (e) {
        console.error(`[ERROR] Could not parse WebSocket message! ${chalk.red(message)}`)
        console.error(`[ERROR] ${chalk.red(e)}`)
        return
      }

      let result = {}
      switch (parsedMessage.action) {
        case 'HTTP_REQUEST':
          result = await performHttpRequest(parsedMessage.data)
          break
        case 'AUTH':
          result = {
            browser_id: this.browserId,
            user_id: this.userId,
            user_agent: this.userAgent,
            timestamp: getUnixTimestamp(),
            device_type: "extension",
            version: this.version,
            extension_id: "lkbnfiajjmbhnfledhphioinpickokdi",
          }
          break
        case 'PONG':
          result = {}
          await sleep(getRandomInt(20, 120))
          break
        default:
          console.error(`[ERROR] No RPC action ${chalk.red(parsedMessage.action)}!`)
          break
      }

      try {
        const message = JSON.stringify({
          // Use same ID so it can be correlated with the response
          id: parsedMessage.id,
          origin_action: parsedMessage.action,
          result: result,
        })

        this.websocket.send(message)
        console.log(`[SENT] message sent: ${chalk.green(message)}`)
      } catch (e) {
        console.error(
          `[ERROR] RPC encountered error for message ${chalk.red(JSON.stringify(parsedMessage))}: ${e}, ${e.stack}`
        )
        this.websocket.send(
          JSON.stringify({
            action: "LOGS",
            data: `RPC encountered error for message ${chalk.red(JSON.stringify(parsedMessage))}: ${e}, ${e.stack}`,
          })
        )
        console.error(`[ERROR] RPC action ${chalk.red(parsedMessage.action)} encountered error: `, e)
      }
    }.bind(this))

    this.websocket.on('close', async function (code) {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.log(`[CLOSE] Connection died: ${chalk.red(code)}`)
      this.websocketStatus = STATUSES.DEAD
      this.retries++
    }.bind(this))

    this.websocket.on('error', function (error) {
      this.retries++
      console.error(`[ERROR] ${error}`)
    }.bind(this))
  }

  async ping(timer) {
    const PENDING_STATES = [
      0, // CONNECTING
      2, // CLOSING
    ]

    if (this.websocket) {
      if (this.websocket.readyState === 1) {
        this.websocketStatus = STATUSES.CONNECTED
      } else if (this.websocket.readyState === 3) {
        this.websocketStatus = STATUSES.DISCONNECTED
      }
    }

    // Check WebSocket state and make sure it's appropriate
    if (PENDING_STATES.includes(this.websocket?.readyState)) {
      console.warn("[WARNING] WebSocket not in appropriate state for liveness check...")
      return
    }

    // Check if timestamp is older than ~15 seconds. If it
    // is the connection is probably dead and we should restart it.
    const current_timestamp = getUnixTimestamp()
    const seconds_since_last_live_message = current_timestamp - this.lastLiveConnectionTimestamp

    if (!this.websocket || seconds_since_last_live_message > 29 || this.websocket.readyState === 3) {
      console.error(
        "[ERROR] WebSocket does not appear to be live! Restarting the WebSocket connection..."
      )

      try {
        console.info(`[CLOSE] tring to close websocket...`)
        this.websocket.close()
      } catch (e) {
        // Do nothing.
      }
      await sleep(getRandomInt(120, 2000))
      this.initialize()
      clearInterval(timer)
      return
    }

    // Send PING message down websocket, this will be
    // replied to with a PONG message form the server
    // which will trigger a function to update the
    // lastLiveConnectionTimestamp variable.

    // If this timestamp gets too old, the WebSocket
    // will be severed and started again.
    const message = JSON.stringify({
      id: uuidV4(),
      version: "1.0.0",
      action: "PING",
      data: {},
    })

    console.log(`[PING] send ping: ${chalk.green(message)}`)

    this.websocket.send(message)
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
  await app.initialize()

  process.on('SIGINT', function () {
    console.log('Caught interrupt signal')
    spinner.stop()
    process.exit()
  })

  // Checks the websocket connection to ensure it's still live
  // If it's not, then we attempt a reconnect
  let timer = setInterval(() => app.ping(timer), PING_INTERVAL)
}
