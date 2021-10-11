const sha1 = require('sha1');

// 生成签名，具体可参考：https://work.weixin.qq.com/api/doc/90001/90144/90539
// 参与签名的参数有四个: noncestr（随机字符串）, jsapi_ticket, timestamp（时间戳）, url（当前网页的URL， 不包含#及其后面部分）
// 这里的 URL 需要前端传过来
const sign = (ticket, nonceStr, timestamp, fullUrl) => {
  const [url] = fullUrl.split('#'); // 最好不用 history 模式，不然每次都要 config

  const rawStr = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;

  return sha1(rawStr)
}

module.exports = {
  sign,
}
