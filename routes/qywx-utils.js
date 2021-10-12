const router = require('koa-router')()

const {sign} = require('../controllers/QywxUtilsController');
const QywxBaseController = require('../controllers/QywxProxyController');

const prefix = '/api/qywx-utils/';

// 缓存的 jsapi ticket
let tickets = {}
const OFFSET = 100;

router.prefix(prefix)

const nonceStr = Buffer.from(new Date().toISOString()).toString('base64')
const timestamp = Date.now();

// 获取应用签名，agentConfig 需要的 sign 字段
router.get('/signatures', async (ctx) => {
  const {url} = ctx.request.query;

  const parsedUrl = decodeURIComponent(url);
  const cache = tickets[parsedUrl];
  let corpTicket, appTicket;

  // 是否有缓存且是否有过期
  if (cache && Date.now() - cache.appExpiration < 0) {
    [corpTicket, appTicket] = [cache.corpTicket, cache.appTicket];
  } else {
    // 获取企业 jsapi_ticket 和应用 jsapi_ticket
    const [corpTicketRes, appTicketRes] = await Promise.all([
      QywxBaseController.getRequest('/get_jsapi_ticket', {}, ctx.accessToken),
      QywxBaseController.getRequest('/ticket/get', { type: 'agent_config'}, ctx.accessToken)
    ]);

    [corpTicket, appTicket] = [corpTicketRes.ticket, appTicketRes.ticket];

    // 写入缓存
    tickets[parsedUrl] = {
      appTicket: appTicketRes.ticket,
      appExpiration: Date.now() + appTicketRes.expires_in - OFFSET,
      corpTicket: corpTicketRes.ticket,
      corpExpiration: Date.now() + corpTicketRes.expires_in - OFFSET,
    }
  }

  // 生成签名
  const corpSignature = sign(corpTicket, nonceStr, timestamp, parsedUrl)
  const appSignature = sign(appTicket, nonceStr, timestamp, parsedUrl)

  ctx.body = {
    meta: {
      nonceStr,
      timestamp,
      url: parsedUrl,
    },
    app: {
      ticket: appTicket,
      expires: tickets[parsedUrl].appExpiration,
      signature: appSignature,
    },
    corp: {
      ticket: corpTicket,
      expires: tickets[parsedUrl].corpExpiration,
      signature: corpSignature,
    },
  }
})

module.exports = router
