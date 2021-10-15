const router = require('koa-router')()

const {sign} = require('../controllers/QywxUtilsController');
const QywxUtilsController = require("../controllers/QywxUtilsController");

const prefix = '/api/qywx-utils/';

router.prefix(prefix)

const nonceStr = Buffer.from(new Date().toISOString()).toString('base64')
const timestamp = Date.now();

// 获取应用签名，agentConfig 需要的 sign 字段
router.get('/signatures', async (ctx) => {
  const {url} = ctx.request.query;

  const [parsedUrl] = decodeURIComponent(url).split('#');

  // 获取 js api ticket（包含 corp 和 app）
  const {corpTicket, appTicket} = await QywxUtilsController.getJsApiTickets(parsedUrl, ctx.accessToken);

  console.log('获取 ticket', corpTicket, appTicket);

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
      signature: appSignature,
    },
    corp: {
      ticket: corpTicket,
      signature: corpSignature,
    },
  }
})

module.exports = router
