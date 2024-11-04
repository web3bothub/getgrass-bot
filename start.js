import { program } from 'commander'
import dotenv from 'dotenv'
import fs from 'fs'
import { run } from './app.js'
import { getRandomInt, randomUserAgent, sleep } from './utils.js'
dotenv.config()

const USER_ID = process.env.USER_ID

program
  .option('-u, --user <string>', '<userId>')

program.parse()

const options = program.opts()
const userId = options.user

if (!userId || !USER_ID) {
  program.help()
}

const USER = {
  id: userId || USER_ID,
  userAgent: randomUserAgent()
}

const PROXIES = fs.readFileSync('proxies.txt').toString().split('\n').map(proxy => proxy.trim())

console.info(`[${userId}] Starting with user with ${PROXIES.length} proxies...`)

async function main() {
  const promises = PROXIES.map(async proxy => {
    await sleep(getRandomInt(100, 6000))
    console.info(`[${USER.id}] Starting with proxy ${proxy}...`)
    await run(USER, proxy)
  })

  await Promise.all(promises)
}

main().catch(console.error)
