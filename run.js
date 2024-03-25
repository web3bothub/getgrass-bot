const { run } = require('./app')
const { program } = require('commander')

program
  .option('-u, --user <string>', '<userId>')
  .option('-p, --proxy <string>', '<proxy>')

program.parse()

const options = program.opts()

const userId = options.user
const proxy = options.proxy

if (!userId || !proxy) {
  program.help()
}

console.log(`Starting with user ${userId}`)

async function main() {
  const { user } = require(`./config/${userId}`)
  await run(user, proxy)
}

main().catch(console.error)
