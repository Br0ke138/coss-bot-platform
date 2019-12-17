import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TelegramService} from './telegram.service';

@Injectable({
  providedIn: 'root'
})
export class KeysService {

  constructor(private http: HttpClient, private telegramService: TelegramService) {
  }

  addKey(key: Key) {

    this.telegramService.sendMessage('Added a key with name: ' + key.name, 'keyAdd');
    return this.http.post('http://localhost:3000/db/keys', key);
  }

  getKey(id: number) {
    return this.http.get<Key>('http://localhost:3000/db/keys/' + id);
  }

  getKeys() {
    return this.http.get<Array<Key>>('http://localhost:3000/db/keys');
  }

  removeKey(id: number) {
    this.telegramService.sendMessage('Removed a key with id: ' + id, 'keyRemove');
    return this.http.delete('http://localhost:3000/db/keys/' + id);
  }

}

export interface Key {
  id?: number;
  name: string;
  public: string;
  secret: string;
}
