const user = {
  id: '3085df59-29d7-40b4-be44-7da67a7305e1',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
}

const proxies = [
  'http://storm-overtrue_area-KR_life-120_session-Wd7RsJ5Ppc:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-HCDrdfnWU8:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-Yq2KxVbOIn:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-SbLjuKhuAS:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-C6sMzemMeD:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-pKclMpXCUQ:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-rGIx6WljA7:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-q875mRDGvK:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-BPGIPP31xF:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-mDgzOKuHTh:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-IFZewtj9lI:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-hU9u5F1NmB:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-2dciirEjaY:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-LpSqt7onQm:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-556WUpPXlB:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-C6Rm19ImfN:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-8owTHOuH48:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-c99F4xxTeW:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-E4WID2l2SV:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-18c9lbut9g:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-kf6Ld86wR6:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-cR7ZLXnkP1:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-nkQkjPENpa:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-FUJ7vhHrA9:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-u9eCTQc1gJ:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-11yL9tuVfj:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-yqW8NnZJoS:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-8BwIYbSPPx:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-QFEpPhm1fm:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-SMJ24Ph8vN:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-OLvcru3u4e:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-zCpX8oPCO3:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-XYA8CEmhmq:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-OEEdAxRni4:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-7l9vWLDtVn:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-wYWe4q3GM8:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-zoEiepuhFn:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-llsdOh4Jku:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-IE4QA4OU21:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-G4SQ6FwKXX:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-12wiAEETpe:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-1jf4JY5SMR:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-y0VHCjVk7f:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-eo7WYfjOxB:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-mAyA4lpt4I:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-zwJ4gvwama:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-yNOuDesBLw:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-XFgKjwOjMv:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-k8h1NM4Yb2:1234578@hk.stormip.cn:1000',
  'http://storm-overtrue_area-KR_life-120_session-zcPiw9IDqX:1234578@hk.stormip.cn:1000',
]

// const sidStart = parseInt(Date.now() / 1000).toString().substring(3)
// for (let index = 0; index < count; index++) {
//   // const sid = sidStart + index
//   const sid = generateRandomString(10)
//   proxies.push(`http://storm-overtrue_life-120_session-${sid}:1234578@proxy.stormip.cn:1000`)
// }

// function generateRandomString(length) {
//   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
//   let result = ''
//   const charactersLength = characters.length
//   for (let i = 0; i < length; i++) {
//     result += characters.charAt(Math.floor(Math.random() * charactersLength))
//   }
//   return result
// }

module.exports = { user, proxies }
