const sha1 = require('sha1');
const keys = require("../constants/keys");
const redis = require("../redis");
const QywxBaseController = require("../controllers/QywxProxyController");

const OFFSET = 100;

// 生成签名，具体可参考：https://work.weixin.qq.com/api/doc/90001/90144/90539
// 参与签名的参数有四个: noncestr（随机字符串）, jsapi_ticket, timestamp（时间戳）, url（当前网页的URL， 不包含#及其后面部分）
// 这里的 URL 需要前端传过来
const sign = (ticket, nonceStr, timestamp, fullUrl) => {
  const [url] = fullUrl.split('#'); // 最好不用 history 模式，不然每次都要 config

  const rawStr = `jsapi_ticket=${ticket}&noncestr=${nonceStr}&timestamp=${timestamp}&url=${url}`;

  return sha1(rawStr)
}

const getJsApiTickets = async (url, accessToken) => {
  const [urlKey] = url.split('#')

  // 使用前缀和 url 生成当前的 key
  const corpJsApiTicketsKey = `${keys.CORP_JSAPI_TICKET}_${urlKey}`;
  const appJsApiTicketsKey = `${keys.APP_JSAPI_TICKET}_${urlKey}`;

  // 缓存 ticket
  const cacheCorpJsApiTickets = await redis.get(corpJsApiTicketsKey);
  const cacheAppJsApiTicket = await redis.get(appJsApiTicketsKey);

  // 是否有缓存的 tickets
  if (cacheAppJsApiTicket || cacheCorpJsApiTickets) {
    console.log('使用 redis 的 ticket', cacheCorpJsApiTickets, cacheAppJsApiTicket)
    return {
      corpTicket: cacheCorpJsApiTickets,
      appTicket: cacheAppJsApiTicket
    }
  }

  // 获取企业 jsapi_ticket 和应用 jsapi_ticket
  console.log('远程获取 ticket', cacheCorpJsApiTickets, cacheAppJsApiTicket)
  const [corpTicketRes, appTicketRes] = await Promise.all([
    QywxBaseController.getRequest('/get_jsapi_ticket', {}, accessToken),
    QywxBaseController.getRequest('/ticket/get', { type: 'agent_config'}, accessToken)
  ]);

  // 写入缓存
  await redis.set(corpJsApiTicketsKey, corpTicketRes.ticket, 'EX', corpTicketRes.expires_in - OFFSET)
  await redis.set(appJsApiTicketsKey, appTicketRes.ticket, 'EX', appTicketRes.expires_in - OFFSET)

  return {
    corpTicket: corpTicketRes.ticket,
    appTicket: appTicketRes.ticket,
  }
}

const QywxUtilsController = {
  sign,
  getJsApiTickets,
}

module.exports = QywxUtilsController;
