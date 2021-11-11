const proxy = require('../proxy')
const redis = require("../redis");
const keys = require("../constants/keys");

const OFFSET = 100;

const fetchAccessToken = async () => {
  const response = await proxy.get('/gettoken', {
    params: {
      corpid: process.env.CORP_ID,
      corpsecret: process.env.CORP_SECRET,
    },
  })

  console.log('fetchAccessToken response', response.data);

  const { access_token, expires_in } = response.data;

  // 存入 redis
  await redis.set(keys.ACCESS_TOKEN, access_token, 'ex', expires_in - OFFSET);

  console.log('远程获取 access_token: ', access_token)

  return access_token
}

module.exports = () => {
  return async (ctx, next) => {
    const cacheAccessToken = await redis.get(keys.ACCESS_TOKEN);

    console.log('redis access_token', cacheAccessToken);

    if (cacheAccessToken) {
      console.log('获取缓存 access_token', cacheAccessToken)
    }

    ctx.accessToken = cacheAccessToken || (await fetchAccessToken())

    await next()
  }
}
