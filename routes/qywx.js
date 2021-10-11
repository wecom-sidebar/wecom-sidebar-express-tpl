const router = require('koa-router')()
const proxy = require('../proxy')

const prefix = '/api/qywx/';

router.prefix(prefix)

const getUrl = (fullUrl) => {
  const [rawUrl] = fullUrl.split('?');
  return rawUrl.replace(prefix, '');
}

router.get('*', async (ctx) => {
  const url = getUrl(ctx.request.url);

  const response = await proxy.get(url, {
    params: {
      ...ctx.request.query,
      access_token: ctx.accessToken,
    },
  })

  console.log(`get ${url}`, response.data)

  ctx.body = response.data
})

router.post('*', async (ctx) => {
  const url = getUrl(ctx.request.url);

  const response = await proxy.post(url, ctx.request.body, {
    params: {
      access_token: ctx.accessToken
    }
  })

  console.log(`post ${url}`, response.data)

  ctx.body = response.data
})

module.exports = router
