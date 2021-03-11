const axios = require('axios')

const baseURL = 'https://qyapi.weixin.qq.com/cgi-bin';

const proxy = axios.create({
  baseURL,
  proxy: false // 不指定会报错 SSL routines:ssl3_get_record:wrong version number，参考：https://github.com/guzzle/guzzle/issues/2593
})

module.exports = proxy
