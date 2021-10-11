const proxy = require('../proxy')

const getRequest = async (url, query, accessToken) => {
  const response = await proxy.get(url, {
    params: {
      ...query,
      access_token: accessToken,
    },
  })

  console.log(`get ${url}`, response.data)

  return response.data;
}

const postRequest = async (url, body, accessToken) => {
  const response = await proxy.post(url, body, {
    params: {
      access_token: accessToken
    }
  })

  console.log(`post ${url}`, response.data)

  return response.data;
}

const QywxProxyController = {
  getRequest,
  postRequest,
}

module.exports = QywxProxyController;
