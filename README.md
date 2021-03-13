# wecom-sidebar-sls

企业微信服务端API的服务器。

其中需要用到 `corpId`，`agentId`，`corpSecret`，需要创建 `server/src/.env`（目前已隐藏），示例

```dotenv
# 在 https://work.weixin.qq.com/wework_admin/frame#profile 这里可以找到
CORP_ID=企业ID

# 在 https://work.weixin.qq.com/wework_admin/frame#apps 里的自建应用里可以找到（注意这里是自建应用里的 secret，不是客户联系里的回调 secret）
CORP_SECRET=自建应用的secret

# 在 https://work.weixin.qq.com/wework_admin/frame#apps 里的自建应用里可以找到 
AGENT_ID=自建应用的AgentId
```

启动项目

```bash
npm run dev
```
