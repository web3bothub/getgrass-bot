const { exec } = require('child_process')
const { input } = require('@inquirer/prompts')

async function main() {
  const userId = await input({ message: 'User ID: ' })
  const area = await input({ message: 'Contry code: ' })
  const proxyCount = await input({ message: 'Proxy count: ', default: 50 })
  const appName = await input({ message: 'pm2 app name: ', default: `grass-${userId}` })

  if (!userId || !area) {
    console.log('User ID and area are required')
    process.exit(1)
  }

  const command = `pm2 start start.js --name ${appName} --restart-delay=30000 -- --user ${userId} --area ${area} --count ${proxyCount}`

  exec(command, (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }

    console.log(`stdout: ${stdout}`)
    console.error(`command: ${command}`)
  })

  exec(`pm2 logs ${appName}`)
}

main().catch(console.error)
