const fs = require('fs')
const path = require('path')
const root = __dirname

const initUser = (userId, name, ipsCount) => {
  const userPath = `${root}/web/users/${userId}.json`

  let user = {
    id: userId,
    name: name || 'unknown',
    ipsCount: ipsCount || 50,
    createdAt: Date.now(),
  }

  if (fs.existsSync(userPath)) {
    const existsedUser = JSON.parse(fs.readFileSync(userPath, 'utf-8'))
    user = { ...user, ...existsedUser }
  }

  fs.writeFileSync(userPath, JSON.stringify(user, null, 2))
}

const getUser = (userId) => {
  const userPath = `${root}/web/users/${userId}.json`

  if (!fs.existsSync(userPath)) {
    return initUser(userId)
  }

  return JSON.parse(fs.readFileSync(userPath, 'utf-8'))
}

const updateUser = (userId, key, value) => {
  const userPath = `${root}/web/users/${userId}.json`
  const user = getUser(userId) || {}

  user[key] = value

  fs.writeFileSync(userPath, JSON.stringify(user, null, 2))
}

const getUserKey = (userId, key) => {
  const user = getUser(userId)

  if (!user) {
    return
  }

  return user[key] || undefined
}

const updateUserIp = (userId, ipAddress, data) => {
  let ips = getUserKey(userId, 'ips') || {}

  ips[ipAddress] = { ...(ips[ipAddress] || {}), ...data }

  updateUser(userId, 'ips', ips)
}

const getUserIp = (userId, ipAddress) => {
  const ips = getUserKey(userId, 'ips')

  if (!ips || !ips[ipAddress]) {
    return {
      retries: 0,
      sleeping: false,
      updatedAt: Date.now(),
    }
  }

  return ips[ipAddress]
}

const increaseUserIpRetries = (userId, ipAddress) => {
  let ip = getUserIp(userId, ipAddress)

  ip.retries = (ip.retries || 0) + 1
  ip.updatedAt = Date.now()

  updateUserIp(userId, ipAddress, ip)
}

const markAsSleeping = (userId, ipAddress) => {
  let ip = getUserIp(userId, ipAddress)
  ip.sleeping = true
  ip.updatedAt = Date.now()

  updateUserIp(userId, ipAddress, ip)
}

const setUserIpStatus = (userId, ipAddress, status) => {
  let ip = getUserIp(userId, ipAddress)
  ip.sleeping = false
  ip.status = status
  ip.updatedAt = Date.now()

  updateUserIp(userId, ipAddress, ip)
}

module.exports = { initUser, getUser, updateUser, getUserKey, increaseUserIpRetries, setUserIpStatus, markAsSleeping }
