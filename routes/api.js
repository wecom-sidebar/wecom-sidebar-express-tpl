const router = require('koa-router')()
const proxy = require('../proxy')

router.prefix('/api')

router.get('/', async (ctx) => {
  const { url, ...restParams } = ctx.request.query

  const parsedUrl = decodeURIComponent(url)

  const response = await proxy.get(parsedUrl, {
    params: {
      ...restParams,
      access_token: ctx.accessToken,
    },
  })

  console.log(`get ${parsedUrl}`, response.data)

  ctx.body = response.data
})

router.post('/', async (ctx) => {
  const { url, data } = ctx.request.body

  const parsedUrl = decodeURIComponent(url)
  const parsedData = data || {}

  const response = await proxy.post(parsedUrl, parsedData, {
    params: {
      access_token: ctx.accessToken
    }
  })

  console.log(`post ${parsedUrl}`, response.data)

  ctx.body = response.data
})

module.exports = router
