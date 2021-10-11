const router = require('koa-router')()

const {sign} = require('../controllers/QywxUtilsController');
const QywxBaseController = require('../controllers/QywxProxyController');

const prefix = '/api/qywx-utils/';

router.prefix(prefix)

const nonceStr = Buffer.from(new Date().toISOString()).toString('base64')
const timestamp = Date.now();

// 获取应用签名，agentConfig 需要的 sign 字段
router.get('/signatures', async (ctx) => {
  const {url} = ctx.request.query;

  const parsedUrl = decodeURIComponent(url);

  // 获取企业 jsapi_ticket 和应用 jsapi_ticket
  const [corpTicketRes, appTicketRes] = await Promise.all([
    QywxBaseController.getRequest('/get_jsapi_ticket', {}, ctx.accessToken),
    QywxBaseController.getRequest('/ticket/get', { type: 'agent_config'}, ctx.accessToken)
  ])

  // 生成签名
  const corpSignature = sign(corpTicketRes.ticket, nonceStr, timestamp, parsedUrl)
  const appSignature = sign(appTicketRes.ticket, nonceStr, timestamp, parsedUrl)

  ctx.body = {
    meta: {
      nonceStr,
      timestamp,
      url: parsedUrl,
    },
    app: {
      ticket: appTicketRes.ticket,
      expires: appTicketRes.expires,
      signature: appSignature,
    },
    corp: {
      ticket: corpTicketRes.ticket,
      expires: corpTicketRes.expires,
      signature: corpSignature,
    },
  }
})

module.exports = router
