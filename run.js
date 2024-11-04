import { input } from '@inquirer/prompts'
import { exec } from 'child_process'

async function main() {
  const userId = await input({ message: 'User ID: ' })
  const appName = await input({ message: 'pm2 app name: ', default: `grass-${userId}` })

  if (!userId || !area) {
    console.log('User ID required')
    process.exit(1)
  }

  const command = `pm2 start start.js --name ${appName} --restart-delay=30000 -- --user ${userId}`

  exec(command, (error, stdout) => {
    if (error) {
      console.error(`exec error: ${error}`)
      return
    }

    console.log(`stdout: ${stdout}`)
    console.error(`command: ${command}`)
  })
}

main().catch(console.error)
