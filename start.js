import consoleStamp from 'console-stamp'
import fs from 'fs'
import { run } from './app.js'
import { getRandomInt, randomUserAgent, sleep } from './utils.js'

consoleStamp(console, {
  format: ':date(yyyy/mm/dd HH:MM:ss.l)'
})

const USER_ID = process.env.USER_ID

if (!USER_ID) {
  console.error('USER_ID not set')
  process.exit(1)
}

const USER = {
  id: USER_ID,
  userAgent: randomUserAgent()
}

const PROXIES = fs.readFileSync('proxies.txt').toString().split('\n').map(proxy => proxy.trim()).filter(proxy => proxy)

console.info(`[${USER_ID}] Starting with user with ${PROXIES.length} proxies...`)

async function main() {
  const promises = PROXIES.map(async proxy => {
    await sleep(getRandomInt(10, 6000))
    console.info(`[${USER.id}] Starting with proxy ${proxy}...`)
    await run(USER, proxy)
  })

  await Promise.all(promises)
}

main().catch(console.error)
