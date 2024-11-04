import axios from "axios"
import { HttpProxyAgent } from "http-proxy-agent"
import { HttpsProxyAgent } from "https-proxy-agent"
import { SocksProxyAgent } from "socks-proxy-agent"

export const randomUserAgent = () => {
  const userAgents = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.3",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.6613.18 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Windows; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
  ]

  return userAgents[Math.floor(Math.random() * userAgents.length)]
}

export const sleep = (ms) => {
  console.log('[SLEEP] sleeping for', ms, '...')
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const getProxyAgent = async (proxy) => {
  if (proxy.startsWith('http://')) {
    return new HttpProxyAgent(proxy)
  } else if (proxy.startsWith('https://')) {
    return new HttpsProxyAgent(proxy)
  } else if (proxy.startsWith('socks://') || proxy.startsWith('socks5://')) {
    return new SocksProxyAgent(proxy)
  }

  return null
}

export function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min)
  const maxFloored = Math.floor(max)
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled) // The maximum is exclusive and the minimum is inclusive
}

export async function getIpAddress(proxy) {
  let options = {}
  console.log(`[GET IP] Getting IP address...${proxy ? ` with proxy ${proxy}` : ''}`)

  if (proxy) {
    const agent = await getProxyAgent(proxy)
    console.log(`[GET IP] Using proxy agent...`)
    if (proxy.startsWith('socks://') || proxy.startsWith('socks5://')) {
      options.httpAgent = agent
      options.httpsAgent = agent
    } else {
      options.httpAgent = agent.httpAgent
      options.httpsAgent = agent.httpsAgent
    }
  }

  return await axios.get('https://myip.ipip.net', options)
    .then(response => response.data)
}
