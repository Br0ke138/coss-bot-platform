import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {take} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TelegramService {

  constructor(private http: HttpClient) {
  }

  sendMessage(text: string, type: string) {
    if (text && text !== '') {
      this.http.post('http://localhost:3000/telegramApi/telegram', {msg: text, type: type}).pipe(take(1)).subscribe(success => {
        console.log(text, 'was send to the telegram bot');
      });
    }
  }
}
