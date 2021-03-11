const proxy = require('../proxy')

let accessToken = null
let expiration = null

const OFFSET = 100;

const getAccessTokenFromCache = () => {
  try {
    // 是否已经存在
    if (!accessToken || !expiration) {
      return null
    }

    const expireDate = new Date(expiration)

    // 判读是否过期
    return Date.now() - expireDate.getTime() <= 0 ? null : accessToken
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

  expiration = Date.now() + response.data.expires_in - OFFSET

  console.log('获取 access_token: ' + accessToken)

  return accessToken
}

module.exports = () => {
  return async (ctx, next) => {
    accessToken = getAccessTokenFromCache() || (await fetchAccessToken())

    ctx.accessToken = accessToken

    await next()
  }
}
