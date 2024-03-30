/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable no-param-reassign */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-use-before-define */
/* eslint-disable camelcase */
/*
    You'll also need to modify the "websocket" variable in the
    initialize() function in this script with the appropriate
    connection URI for your host. For simple testing, the default
    connection string of "ws://127.0.0.1:4343" should be fine.
*/

const WebSocket = require('ws')
const { v3: uuidv3 } = require('uuid')
const uuid = require('uuid')
const fs = require('fs')
const path = require('path')
const { HttpsProxyAgent } = require('https-proxy-agent')
const { sleep, getRandomInt, generateRandomString, getIpAddress } = require('./utils')
const getUnixTimestamp = () => Math.floor(Date.now() / 1000)
const recorder = require('./recorder')

function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  )
}

const PING_INTERVAL = 20 * 1000

const WEBSOCKET_URLS = [
  "wss://proxy.wynd.network:4650",
  "wss://proxy.wynd.network:4444",
]
// const WEBSOCKET_URLS = ["ws://proxy.dev.getgrass.io:4343"];
// const WEBSOCKET_URLS = ["ws://127.0.0.1:4343"];

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
  const credentials_mode = params.authenticated ? "include" : "omit"

  const requestOptions = {
    headers: params.headers,
    method: params.method,
    credentials: credentials_mode,
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
  constructor(user, proxy, version = '3.3.2') {
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
    const namespace = uuid.NIL
    this.browserId ??= uuidv3(this.proxy, namespace)

    if (this.proxy) {
      console.info(`[INITIALIZE] request with proxy: ${this.proxy}...`)
    }

    // Get the IP address of the proxy
    const ipAddress = await getIpAddress(this.proxy)

    recorder.setUserIpStatus(this.userId, ipAddress, 'active')
    recorder.increaseUserIpRetries(this.userId, ipAddress)

    if (this.retries > 2) {
      console.error(`[ERROR] too many retries(${this.retries}), sleeping...`)
      recorder.markAsSleeping(this.userId, ipAddress)
      await sleep(getRandomInt(10000, 60000))
    }

    // Loop through each websocketUrl in case the other does not work
    const websocketUrl = WEBSOCKET_URLS[this.retries % WEBSOCKET_URLS.length]

    this.websocket = new WebSocket(websocketUrl, {
      agent: new HttpsProxyAgent(this.proxy),
      headers: { 'user-agent': this.userAgent },
      rejectUnauthorized: false,
      ca: fs.readFileSync(path.join(__dirname, '/ssl/websocket.pem')),
    })

    this.websocket.on('open', async function (e) {
      console.log("[OPENED] Websocket Open")
      this.lastLiveConnectionTimestamp = getUnixTimestamp()
      this.websocketStatus = STATUSES.CONNECTED
      recorder.setUserIpStatus(this.userId, ipAddress, 'open')
    }.bind(this))

    this.websocket.on('message', async function (message) {
      recorder.setUserIpStatus(this.userId, ipAddress, 'active')
      console.log(`[REVEIVED] received message: ${message}`)

      await sleep(getRandomInt(2, 500))

      // Update last live connection timestamp
      this.lastLiveConnectionTimestamp = getUnixTimestamp()

      let parsed_message
      try {
        parsed_message = JSON.parse(message)
      } catch (e) {
        console.error("[ERROR] Could not parse WebSocket message!", message)
        console.error(e)
        return
      }

      let result = {}
      switch (parsed_message.action) {
        case 'HTTP_REQUEST':
          result = await performHttpRequest(parsed_message.data)
          break
        case 'AUTH':
          result = {
            browser_id: this.browserId,
            user_id: this.userId,
            user_agent: this.userAgent,
            timestamp: getUnixTimestamp(),
            device_type: "extension",
            version: this.version,
          }
          break
        case 'PONG':
          result = {}
          break
        default:
          console.error(`[ERROR] No RPC action ${parsed_message.action}!`)
          break
      }

      try {
        const message = JSON.stringify({
          // Use same ID so it can be correlated with the response
          id: parsed_message.id,
          origin_action: parsed_message.action,
          result: result,
        })

        this.websocket.send(message)
        console.log(`[SENT] message sent: ${message}`)
      } catch (e) {
        console.error(
          `[ERROR] RPC encountered error for message ${JSON.stringify(parsed_message)}: ${e}, ${e.stack}`
        )
        this.websocket.send(
          JSON.stringify({
            action: "LOGS",
            data: `RPC encountered error for message ${JSON.stringify(parsed_message)}: ${e}, ${e.stack}`,
          })
        )
        console.error(`[ERROR] RPC action ${parsed_message.action} encountered error: `, e)

        recorder.setUserIpStatus(this.userId, ipAddress, 'error')
        recorder.updateUser(this.userId, 'lastError', e)
      }
    }.bind(this))

    this.websocket.on('close', async function (code) {
      // e.g. server process killed or network down
      // event.code is usually 1006 in this case
      console.log(`[CLOSE] Connection died: ${code}`)
      this.websocketStatus = STATUSES.DEAD
      this.retries++
      recorder.setUserIpStatus(this.userId, ipAddress, 'closed')
      recorder.updateUser(this.userId, 'lastError', 'Connection died')
      recorder.increaseUserIpRetries(this.userId, ipAddress)
    }.bind(this))

    this.websocket.on('error', function (error) {
      this.retries++
      recorder.setUserIpStatus(this.userId, ipAddress, 'error')
      recorder.updateUser(this.userId, 'lastError', error)
      recorder.increaseUserIpRetries(this.userId, ipAddress)
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
      console.log("[WARNING] WebSocket not in appropriate state for liveness check...")
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
        console.log(`[CLOSE] tring to close websocket...`)
        this.websocket.close()
      } catch (e) {
        // Do nothing.
      }
      await sleep(getRandomInt(120, 20500))
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
      id: generateRandomString('45pKVhplO0QnwNl'.length),
      version: "1.0.0",
      action: "PING",
      data: {},
    })

    console.log(`[PING] send ping: ${message}`)

    this.websocket.send(message)
  }
}

module.exports = {
  run: async function run(user, proxy) {
    const app = new App(user, proxy)

    console.log(`[START] [${user.id}] starting...`)

    await app.initialize()

    // Checks the websocket connection to ensure it's still live
    // If it's not, then we attempt a reconnect
    timer = setInterval(() => app.ping(timer), PING_INTERVAL)
  }
}
