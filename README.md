# getgrass-bot

A bot for [https://app.getgrass.io/dashboard](https://app.getgrass.io/register/?referralCode=qY96g1DYyIxe3B4)， which can automatically claim rewards for you.

> [!WARNING]
> I am not responsible for any loss or damage caused by this bot. Use it at your own risk.

## Usage

The `getgrass-bot` can be run using Docker or manually.

## Get your user ID

you can obtain your user ID from the Getgrass website:

- Visit [https://app.getgrass.io/dashboard](https://app.getgrass.io/register/?referralCode=qY96g1DYyIxe3B4).
- Open the browser's developer tools (usually by pressing F12 or right-clicking and selecting "Inspect").
- Go to the "Console" tab.
- Paste the following command and press Enter:

```javascript
copy(localStorage.getItem('userId'));
```

- Copy the value returned, which is your user ID.

## Prepare proxies

You can buy proxies from [ProxyCheap](https://app.proxy-cheap.com/r/ksvW8Z) or any other proxy provider.

## Running the Bot with Docker

1. Create a text file named `proxies.txt` with the desired proxy URLs. Ensure each URL is in the format:

```plaintext
http://username:password@hostname1:port
http://username:password@hostname2:port
// or
socks5://username:password@hostname1:port
socks5://username:password@hostname2:port
```

> Note: You can use HTTP or SOCKS5 proxies, and you can config with multiple proxies in the `proxies.txt` file (one proxy per line).

1. Run the `getgrass-bot` using Docker:

```bash
docker run $(pwd)/proxies.txt:/app/proxies.txt -e USER_ID="your-user-id" overtrue/getgrass-bot
```

## Manual Installation

> You need to have Node.js installed on your machine to run the bot manually.

1. Git clone this repository to your local machine.

```bash
git clone git@github.com:web3bothub/getgrass-bot.git
```

1. Navigate to the project directory.

```bash
cd getgrass-bot
```

1. Create the `proxies.txt` file with the desired proxy URLs. Ensure each URL is in the format:

```plaintext
http://username:password@hostname1:port
http://username:password@hostname2:port
// or
socks5://username:password@hostname1:port
socks5://username:password@hostname2:port
```

> Note: You can use HTTP or SOCKS5 proxies, You can config with multiple proxies in the `proxies.txt` file (one proxy per line).

1. Run the `getgrass-bot` by executing the following command:

```bash
node start.js -u "your-user-id"
```

1. If you want to run the bot in the background, you can use the `pm2` package:

```bash
npm install -g pm2
pm2 start start.js --name getgrass-bot -- -u "your-user-id"
```

## Note

- Run this bot, I don't guarantee you will get the reward, it depends on the Getgrass website.
- You can just run this bot at your own risk, I'm not responsible for any loss or damage caused by this bot. This bot is for educational purposes only.

## Contribution

Feel free to contribute to this project by creating a pull request.

## Support Me

if you want to support me, you can donate to my address:

- TRC20: `TMwJhT5iCsQAfmRRKmAfasAXRaUhPWTSCE`
- ERC20: `0xa2f5b8d9689d20d452c5340745a9a2c0104c40de`
- SOLANA: `HCbbrqD9Xvfqx7nWjNPaejYDtXFp4iY8PT7F4i8PpE5K`
- TON: `UQBD-ms1jA9cmoo8O39BXI6jqh8zwRSoBMUAl4yjEPKD6ata`
