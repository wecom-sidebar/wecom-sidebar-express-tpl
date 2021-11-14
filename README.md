# wecom-sidebar-express-tpl

企业微信服务端API的服务器。

## 功能

- [x] [企业微信服务端](https://open.work.weixin.qq.com/api/doc/90001/90143/91201) 的转发服务
- [x] Redis 缓存 `access_token`, `app_jsapi_ticket`, `corp_jsapi_ticket`
- [x] Docker 启动 Redis

## 配置

其中需要用到 `corpId`，`agentId`，`corpSecret`，需要在项目根目录创建 `.env`（目前已隐藏），示例

```dotenv
# .env

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# 在 https://work.weixin.qq.com/wework_admin/frame#profile 这里可以找到
CORP_ID=企业ID

# 在 https://work.weixin.qq.com/wework_admin/frame#apps 里的自建应用里可以找到（注意这里是自建应用里的 secret，不是客户联系里的回调 secret）
CORP_SECRET=自建应用的CORP_SECRET

# 在 https://work.weixin.qq.com/wework_admin/frame#apps 里的自建应用里可以找到
AGENT_ID=自建应用的AGENT_ID
```

## 启动

先使用 docker 来启动 redis：

```shell
docker-compose -f docker-compose.yml up -d
```

然后使用 npm 启动项目：

```bash
npm run dev
```

## 更多

* 侧边栏的前端开发模板（React）可以看 [wecom-sidebar-react-tpl](https://github.com/wecom-sidebar/wecom-sidebar-react-tpl)
* 侧边栏的微前端开发模式（Qiankun）可以看 [weccom-sidebar-qiankun-tpl](https://github.com/wecom-sidebar/wecom-sidebar-qiankun-tpl)
