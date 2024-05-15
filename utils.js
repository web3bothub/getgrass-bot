const { HttpsProxyAgent } = require('https-proxy-agent')
const { ProxyAgent } = require('undici')

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength))
  }
  return result
}

const sleep = (ms) => {
  console.log('[SLEEP] sleeping for', ms, '...')
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

async function getIpAddress(proxy) {
  let options = {}

  if (proxy) {
    options.dispatcher = new ProxyAgent(proxy)
  }

  return await fetch('https://api.ipify.org?format=json', options)
    .then(response => response.json())
    .then(data => data.ip)
}

module.exports = { generateRandomString, getRandomInt, sleep, getIpAddress }
