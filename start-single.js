import { run } from './app.js'

import { randomUserAgent } from './utils.js'

const USER_ID = process.env.USER_ID

if (!USER_ID) {
  console.error('USER_ID not set')
  process.exit(1)
}

const USER = {
  id: USER_ID,
  userAgent: randomUserAgent()
}

spinner.clear()
spinner.info(`[${userId}] Starting with user without proxies...`).clear().start()

async function main() {
  run(USER)
}

main().catch(console.error)
