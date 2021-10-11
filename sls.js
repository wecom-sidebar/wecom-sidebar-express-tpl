require('dotenv').config()

const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa2-cors')

const accessToken = require('./middlewares/accessToken')

const qywxProxy = require('./routes/qywx-proxy')
const qywxUtils = require('./routes/qywx-utils')

// 错误处理
onerror(app)

// 中间件
app.use(cors())
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// 日志
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 使用绑定 accessToken 的中间件
app.use(accessToken())

// 路由
app.use(qywxProxy.routes(), qywxProxy.allowedMethods())
app.use(qywxUtils.routes(), qywxUtils.allowedMethods())

// 错误处理
app.on('error', (err) => {
  console.error('server error', err)
});

module.exports = app
