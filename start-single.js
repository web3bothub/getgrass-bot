// const { exec } = require("child_process")
const { program } = require('commander')
const { run } = require("./app")

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

console.log(`[${userId}] Starting with user without proxies...`)

async function main() {
  run(USER)
}

main().catch(console.error)
