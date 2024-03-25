const { generateRandomString } = require("../utils")

const user = {
  id: '500b73b4-2988-4e48-9830-567a689a4566',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
}

const PROXY_COUNT = 60
const PROXY_TEMPLATE = `http://storm-overtrue_area-AE_life-120_session-[SID]:1234578@hk.stormip.cn:1000`

const proxies = []

for (let index = 0; index < PROXY_COUNT; index++) {
  proxies.push(PROXY_TEMPLATE.replace('[SID]', generateRandomString(10)))
}

module.exports = { user, proxies }
