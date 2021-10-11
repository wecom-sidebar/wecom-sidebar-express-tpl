const sha1 = require('sha1');

// 生成签名，具体可参考：https://work.weixin.qq.com/api/doc/90001/90144/90539
// 这里的 URL 需要前端传过来
const getAppSignature = (ticket, url) => {
  const nonceStr = Buffer.from(new Date().toISOString()).toString('base64')
  const timestamp = Date.now();
  const rawStr = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;

  return {
    signature: sha1(rawStr),
    nonceStr,
    timestamp
  };
}

module.exports = {
  getAppSignature,
}
