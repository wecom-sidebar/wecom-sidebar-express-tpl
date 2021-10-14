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

  const { access_token, expires_in } = response.data;

  // 存入 redis
  await redis.set(keys.ACCESS_TOKEN, access_token, 'ex', expires_in - OFFSET);

  console.log('获取 access_token: ' + access_token)

  return access_token
}

module.exports = () => {
  return async (ctx, next) => {
    const cacheAccessToken = await redis.get(keys.ACCESS_TOKEN);

    ctx.accessToken = cacheAccessToken || (await fetchAccessToken())

    await next()
  }
}
