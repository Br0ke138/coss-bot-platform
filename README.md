# coss-bot-platform

Telegram User: @Br0ke138

## How-To:
- Download newest version here https://github.com/Br0ke138/coss-bot-platform/releases
  (Please use the file according to your operating system)
- Create a folder and insert the downloaded file
- Run the file 
  - Windows: Double Click
  - Windows Advanced: Open cmd and navigate into the folder and then ./coss-bot-platform-win.exe
  - Linux: Open Terminal and navigate into the folder and run via ./coss-bot-platform-linux
  - Mac: Open Terminal and navigate into the folder and run via ./coss-bot-platform-macos
- Open http://localhost:3000

## Features:
- Grid trading
- Multi bot support
- Multi key support
- Telegram notifications
- Visualisation of the bot config
- Easter egg

## Build manually
- Install Node.js
- Download https://github.com/Br0ke138/coss-bot-platform/archive/master.zip
- unzip file
- Open Terminal/Cmd
- Navigate into <path-to-the-bot-folder>/coss-bot-platform-master/bot-platform
- npm install
- Build application
  - Windows: npm run build-win
  - Linux: npm run build-linux
  - MacOS: npm run build-macos

## STEP BY STEP EXPLANATION OF GRID TRADING 

In this section, let's find out how the bot actually work. In this example, we use BTC/USDT pair the following parameters:
* Highest price: **$4000**
* Lowest price: **$3000**
* Number of grid: **6**
* Amount per grid: **1 BTC**

1. The bot will distribute the grid according to your setting.
![](https://i.imgur.com/2Hx78IY.png)
2. Detect the current price and remove the nearest order from it.
![](https://i.imgur.com/pkUcxk8.png)
3. Turn all the orders into sell orders and buy orders
![](https://i.imgur.com/GdSYoF1.png)
4. When the price rise and hit the sell order, it'll place a buy order one grid down from that grid, which is $3400 in this case.
![](https://i.imgur.com/4OZr1Ox.png)
![](https://i.imgur.com/7Bn5Dk5.png)
5. When the price drop and hit the buy order, it'll place a sell order one grid up from that grid, which is $3600 in this case.
![](https://i.imgur.com/DL3qpb5.png)
![](https://i.imgur.com/1Y4wPnQ.png)
6. With continuously buy and sell, the bot makes profit from each trade and that's how the profit per grid is defined.
![](https://i.imgur.com/chvsPkL.png)
