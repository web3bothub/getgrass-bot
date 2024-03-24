const { run } = require('./app')

async function main() {
  const { proxies, user } = require('./config')
  const promises = proxies.map(async (proxy) => run(user, proxy))
  Promise.all(promises)
}

main().catch(console.error)
