import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TelegramService} from './telegram.service';
import {OrderResponse} from "../../../../bots-grid-source/swaggerSchema";

@Injectable({
  providedIn: 'root'
})
export class BotsService {
  constructor(private http: HttpClient, private telegramService: TelegramService) {
  }

  addBot(bot: Bot) {
    this.telegramService.sendMessage('Added a bot with name: ' + bot.name, 'botAdd');
    bot.status = BotStatus.Init;
    return this.http.post('http://localhost:3000/db/bots', bot);
  }

  getBot(id: string) {
    return this.http.get<Bot>('http://localhost:3000/db/bots/' + id);
  }

  getBots() {
    return this.http.get<Array<Bot>>('http://localhost:3000/db/bots');
  }

  updateBot(id: string, newBot: Bot) {
    this.telegramService.sendMessage('Updated bot with name: ' + newBot.name, 'botUpdate');
    return this.http.put('http://localhost:3000/db/bots/' + id, newBot);
  }

  removeBot(id: string) {
    this.telegramService.sendMessage('Removed a bot with id: ' + id, 'botRemove');
    return this.http.delete('http://localhost:3000/db/bots/' + id);
  }

  startBot(id: string) {
    return this.http.get('http://localhost:3000/botApi/start/' + id);
  }

  stopBot(id: string) {
    return this.http.get('http://localhost:3000/botApi/stop/' + id);
  }

}

export interface Bot {
  id?: string;
  name: string;
  type: BotTypes;
  status?: BotStatus;
  config?: Config;
  keys: {id: string, name: string};
}

export enum BotTypes {
  'GRID' = 'GRID',
}

export enum BotStatus {
  'Init' = 'Init',
  'Running' = 'Running',
  'Stopped' = 'Stopped',
  'Crashed' = 'Crashed',
}

export interface Config {
  pair: string;
  upperWall: string;
  lowerWall: string;
  numberOfGrids: string;
  amountPerGrid: string;
  grids?: Array<number>;
  orders?: Array<OrderResponse>;
  precisionPrice?: number;
  precisionAmount?: number;
}
