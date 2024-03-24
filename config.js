const user = {
  id: '3085df59-29d7-40b4-be44-7da67a7305e1',
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
}

const count = 1000
const proxies = [
  // 'http://storm-overtrue_area-SG_life-120_session-TYfcGdheFJ:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-IesQO6ulIC:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-iQc0IY87hS:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-U8U9u2VLBH:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-c4tlfEaiEM:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-ds5CZKHOBZ:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-Ik0BSiMPcb:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-Sh8NFo4vvk:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-ijOB47ZXHp:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-iCW4MQG4Yw:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-XtOmBeA7FA:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-rPCuiBFH7g:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-Pgql5aeui8:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-KsrsYVkCim:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-B5WIHiKWDp:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-1wv8YifFrV:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-WgyYNDMGez:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-xek7iMrTDc:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-LwezOjZbiO:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-qYODbgva1k:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-XIzbmPOadS:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-Cp6acgoWyb:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-d6r9XrXsyW:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-cRSJhTQmWB:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-yoy7bn7iL6:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-uKszQWRoxk:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-bNZnqtdnnJ:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-vFOsCEgfzM:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-Yi9XhWeNyV:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-QEmY2kE7s8:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-WzXexj6Ddx:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-2kwQQqgwwD:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-Kpyvmyi8Sc:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-SZv1NY9ijs:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-Cy34g160so:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-IC7LZbW8o5:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-ObKvXwRAU1:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-cM4PhEAA3y:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-OzKmiEaqBy:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-bBc8aIB7zG:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-3ho3nL8jvo:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-bpakuegI0L:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-biSjzwaYPf:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-JLNzNMrSX6:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-B7gY1jTKnl:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-dB3DpSUR29:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-WaP3GPridm:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-0RWGbpupfe:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-cnSP90DJ2N:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-fouLjtd7FE:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-wwmmR6h7xD:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-9CC8m5rtJr:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-OUSbgThdsw:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-295lcpSOXf:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-ApOjIzMWE2:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-JzDhocPX2l:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-G324gXvLHN:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-XaHNHdsPER:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-NtF9iRl3wP:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-1wLKCsON9Y:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-vFqzHxjoie:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-D8BayWNoUw:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-9hHQbsBEY7:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-LH18P9IbYj:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-UKInivQQAs:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-q5dXxV6j99:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-rsaGNqfRqc:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-shvmTzzmcx:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-MjYUy7qK5W:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-GwNyojjyOQ:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-kwPiJ2qA6T:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-wHKgBFUuc0:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-A5HO860DSy:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-EY2TuCYSKl:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-QkSgfheYGk:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-vfEKeRm5vM:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-YupuNWVjFX:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-6SM1adBDv1:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-PmVeQoi19L:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-TvFePh551i:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-eipNyneZ9y:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-11uddCDzWK:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-ZfFU4bPBau:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-9FbWporVPi:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-S8nibIk4b1:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-tnxf8snOsI:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-5EXSGHY3u6:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-Y2LHzdqf9p:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-9KUQA5kx9U:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-jrkqhLeOAC:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-cnzXJIbfaE:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-18bZqQtusW:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-umi31pj379:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-7D89dqq5Bi:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-kAbitC7kJQ:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-qE9KOPf1I0:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-CRIM1WONT9:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-RAGIVyrcyp:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue_area-SG_life-120_session-Rr7msfv1zT:1234578@us.stormip.cn:1000',
  // 'http://storm-overtrue2_ip-103.38.254.180:1234578@us.stormip.cn:2000',
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
