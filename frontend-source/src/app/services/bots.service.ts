import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BotsService {
  constructor(private http: HttpClient) {
  }

  addBot(bot: Bot) {
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
    return this.http.put('http://localhost:3000/db/bots/' + id, newBot);
  }

  removeBot(id: string) {
    return this.http.delete('http://localhost:3000/db/bots/' + id);
  }

  // startBot(id: string): boolean {
  //   const botToStart = this.bots.find(bot => bot.id === id);
  //   if (botToStart) {
  //     botToStart.status = BotStatus.Running;
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  //
  // stopBot(id: string): boolean {
  //   const botToStop = this.bots.find(bot => bot.id === id);
  //   if (botToStop) {
  //     botToStop.status = BotStatus.Stopped;
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }
  //

}

export interface Bot {
  id?: string;
  name: string;
  type: BotTypes;
  status?: BotStatus;
  orders?: Array<string>;
  config?: any;
  key?: {public: string, secret: string};
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
