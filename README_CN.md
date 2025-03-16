# Getgrass Bot

getgrass-bot 是一个用于自动获取 [https://app.getgrass.io](https://app.getgrass.io/register/?referralCode=qY96g1DYyIxe3B4) 网站奖励的机器人（两倍积分）。

> [!WARNING]
> 我不对该机器人造成的任何损失或损害负责。使用风险自负。

## 使用方法

`getgrass-bot` 可以通过 Docker 或手动运行。

## 获取您的用户 ID

您可以从 Getgrass 网站获取您的用户 ID：

- 访问 [https://app.getgrass.io/dashboard](https://app.getgrass.io/register/?referralCode=qY96g1DYyIxe3B4)。
- 打开浏览器的开发者工具（通常按 F12 或右键单击并选择“检查”）。
- 转到“控制台”选项卡。
- 粘贴以下命令并按回车：

```javascript
const appUserIdKey = Object.keys(localStorage).find(key => key.endsWith('.appUserId'));
if (appUserIdKey) {
  const appUserId = localStorage.getItem(appUserIdKey);
  console.log("appUserId:", appUserId);
}
```

- 此动作将复制返回的值，这就是您的用户 ID（你可以粘贴到文本文件中以备将来使用）。

## 准备代理

您可以从 [ProxyCheap](https://app.proxy-cheap.com/r/ksvW8Z) 或任何其他代理提供商购买代理（不为任何代理提供商背书, 请自行选择）。

## 使用 Docker 运行机器人

1. 创建一个名为 `proxies.txt` 的文本文件，包含所需的代理 URL。你可以使用以下格式，混用也可以：

```plaintext
http://username:password@hostname1:port
http://username:password@hostname2:port
// 或者
socks5://username:password@hostname1:port
socks5://username:password@hostname2:port
```

> 注意：您可以使用 HTTP 或 SOCKS5 代理，并且可以在 `proxies.txt` 文件中配置多个代理（每行一个代理）。

1. 使用 Docker 运行 `getgrass-bot`：

```bash
docker run -d -v $(pwd)/proxies.txt:/app/proxies.txt -e USER_ID="your-user-id" overtrue/getgrass-bot
```

## 手动安装

> 您需要在机器上安装 Node.js 才能手动运行机器人。

1. 将此仓库克隆到您的本地机器。

```bash
git clone git@github.com:web3bothub/getgrass-bot.git
```

1. 切换到项目根目录。

```bash
cd getgrass-bot
```

1. 创建 `proxies.txt` 文件，包含所需的代理 URL。确保每个 URL 的格式为：

```plaintext
http://username:password@hostname1:port
http://username:password@hostname2:port
// 或者
socks5://username:password@hostname1:port
socks5://username:password@hostname2:port
```

> 注意：您可以使用 HTTP 或 SOCKS5 代理，并且可以在 `proxies.txt` 文件中配置多个代理（每行一个代理）。

1. 通过执行以下命令运行 `getgrass-bot`：

```bash
USER_ID="your-user-id" node start.js
```

1. 如果您想在后台运行机器人，可以使用 `pm2` 包：

```bash
npm install -g pm2
USER_ID="your-user-id" pm2 start start.js
```

## 注意

- 运行此机器人，我不保证您会获得奖励，这取决于 Getgrass 网站。
- 您可以自行承担风险运行此机器人，我不对该机器人造成的任何损失或损害负责。此机器人仅用于教育目的。
- 不要在账号间共享代理，否则您的账号可能会被封禁。
- 如果你有问题，请在 GitHub 上提出问题，不保证回复效率，我要上班，我会尽力回答。

## 贡献

欢迎通过创建拉取请求为此项目做出贡献。

## 支持我

如果您想支持我，创建更多优质的脚本，您可以通过以下方式打赏我：

- TRC20: `TMwJhT5iCsQAfmRRKmAfasAXRaUhPWTSCE`
- ERC20: `0xa2f5b8d9689d20d452c5340745a9a2c0104c40de`
- SOLANA: `HCbbrqD9Xvfqx7nWjNPaejYDtXFp4iY8PT7F4i8PpE5K`
- TON: `UQBD-ms1jA9cmoo8O39BXI6jqh8zwRSoBMUAl4yjEPKD6ata`
