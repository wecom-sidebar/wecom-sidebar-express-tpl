const path = require('path')
const router = require('koa-router')()
const sendFile = require('koa-sendfile')

router.prefix('/')

router.get('/', async (ctx) => {
  await sendFile(ctx, path.join(__dirname, '../WW_verify_2wEM12p4a3OwQnLE.txt'))
})

module.exports = router
