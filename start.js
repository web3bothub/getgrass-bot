// const { exec } = require("child_process")
const { program } = require('commander')
const { sleep, getRandomInt } = require('./utils')
const { run } = require("./app")

program
  .option('-u, --user <string>', '<userId>')

program.parse()

const options = program.opts()

const userId = options.user

if (!userId) {
  program.help()
}

console.log(`Starting with user ${userId}`)

async function main() {
  const { proxies, user } = require(`./config/${userId}`)
  // proxies.forEach(async proxy => {
  //   console.log(`Starting with proxy ${proxy} and user ${user.id}`)
  //   exec(`node run.js -u ${userId} -p ${proxy} -u ${user.id} > ./logs/${userId}-${proxy.substring(7, 57)}.log 2>&1 &`)
  //   await sleep(getRandomInt(1000, 20000))
  // })
  const promises = proxies.map(async proxy => {
    await sleep(getRandomInt(1000, 20000))
    console.log(`Starting with proxy ${proxy} and user ${user.id}`)
    await run(user, proxy)
  })

  await Promise.all(promises)
}

main().catch(console.error)
