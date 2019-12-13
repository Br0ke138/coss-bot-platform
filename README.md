# coss-bot-platform

Telegram User: @Br0ke138

How-To:
- Download newest version here https://github.com/Br0ke138/coss-bot-platform/releases
  (Please use the file according to your operating system)
- Put the file into a dedicated folder
- Run the file
- Open localhost:3000

- Following steps are repeatable for multiple bots
- Click onto Keys in the menu on the left
- Create a Api key on Coss.io and input the public and private key
- Click onto Bots in the menu on the left
- Create a new bot
- Configure the bot (Click Visualize to see where orders would be placed and get a table of orders)
- Click on Save
- Click on Start (The Console that opened when you ran the file will show the bot working) (WIP: Adjust GUI for better user Feedback)

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