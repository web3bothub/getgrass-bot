import { program } from 'commander'
import dotenv from 'dotenv'
import fs from 'fs'
import { run } from './app.js'
import { getRandomInt, sleep } from './utils.js'
dotenv.config()

program
  .option('-u, --user <string>', '<userId>')

program.parse()

const options = program.opts()
const userId = options.user

if (!userId) {
  program.help()
}

const USER = {
  id: userId,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
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
