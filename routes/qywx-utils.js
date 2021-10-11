const router = require('koa-router')()

const {getAppSignature} = require('../controllers/QywxUtilsController');
const QywxBaseController = require('../controllers/QywxProxyController');

const prefix = '/qywx-utils/';

router.prefix(prefix)

router.get('/app-signature', async (ctx) => {
  console.log('search', ctx.request.search)
  console.log('query', ctx.request.query)
  const {url} = ctx.request.query;

  const parsedUrl = decodeURIComponent(url);

  const ticketRes = await QywxBaseController.getRequest(
    '/ticket/get',
    { type: 'agent_config'},
    ctx.accessToken
  )

  const {signature, timestamp, nonceStr} = getAppSignature(ticketRes.ticket, parsedUrl)

  ctx.body = {
    signature: {
      signature,
      timestamp,
      nonceStr,
      url: parsedUrl,
    },
    ticket: {
      ticket: ticketRes.ticket,
      expires: ticketRes.expires,
    }
  }
})

module.exports = router
