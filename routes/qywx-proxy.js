const router = require('koa-router')()
const QywxBaseController = require("../controllers/QywxProxyController");

const prefix = '/api/qywx-proxy/';

router.prefix(prefix)

const getUrl = (fullUrl) => {
  const [rawUrl] = fullUrl.split('?');
  return rawUrl.replace(prefix, '');
}

router.get('*', async (ctx) => {
  const url = getUrl(ctx.request.url);

  ctx.body = await QywxBaseController.getRequest(url, ctx.request.query, ctx.accessToken)
})

router.post('*', async (ctx) => {
  const url = getUrl(ctx.request.url);

  ctx.body = await QywxBaseController.postRequest(url, ctx.request.body, ctx.accessToken)
})

module.exports = router
