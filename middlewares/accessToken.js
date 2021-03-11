const fs = require('fs')
const path = require('path')
const proxy = require('../proxy')

let accessToken = null

const cachePath = path.join(__dirname, '../cache')
const accessTokenFilePath = path.join(cachePath, 'access_token.txt')
const expirationFilePath = path.join(cachePath, 'expiration.txt')

const OFFSET = 100;

const getAccessTokenFromCache = () => {
  try {
    const cacheAccessToken = fs.readFileSync(accessTokenFilePath, 'utf8')
    const expirationText = fs.readFileSync(expirationFilePath, 'utf8')

    const expiration = new Date(expirationText)

    return Date.now() - expiration.getTime() <= 0 ? null : cacheAccessToken
  } catch (e) {
    console.error(e)
    return null
  }
}

const fetchAccessToken = async () => {
  const response = await proxy.get('/gettoken', {
    params: {
      corpid: process.env.CORP_ID,
      corpsecret: process.env.CORP_SECRET,
    },
  })

  accessToken = response.data.access_token
  const expireTime = Date.now() + response.data.expires_in - OFFSET

  // TODO: 可以使用 Redis 做缓存
  // 更新缓存
  if (!fs.existsSync(cachePath)) fs.mkdirSync(cachePath)

  fs.writeFileSync(accessTokenFilePath, accessToken)
  fs.writeFileSync(expirationFilePath, expireTime)

  console.log('当前 access_token 为' + accessToken)

  return accessToken
}

module.exports = () => {
  return async (ctx, next) => {
    accessToken = getAccessTokenFromCache()

    ctx.accessToken = accessToken || (await fetchAccessToken())

    await next()
  }
}
