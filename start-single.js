// const { exec } = require("child_process")
import { program } from 'commander'
import { run } from './app.js'
import spinner from './spinner.js'

program
  .option('-u, --user <string>', '<userId>')
  .parse()

const options = program.opts()
const userId = options.user

if (!userId) {
  program.help()
}

const USER = {
  id: userId,
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

spinner.clear()
spinner.info(`[${userId}] Starting with user without proxies...`).clear().start()

async function main() {
  run(USER)
}

main().catch(console.error)
