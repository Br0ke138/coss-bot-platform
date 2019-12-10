import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KeysService {

  constructor(private http: HttpClient) {
  }

  addKey(key: Key) {
    return this.http.post('http://localhost:3000/db/keys', key);
  }

  getKey(id: number) {
    return this.http.get<Key>('http://localhost:3000/db/keys/' + id);
  }

  getKeys() {
    return this.http.get<Array<Key>>('http://localhost:3000/db/keys');
  }

  removeKey(id: number) {
    return this.http.delete('http://localhost:3000/db/keys/' + id);
  }

}

export interface Key {
  id?: number;
  name: string;
  public: string;
  secret: string;
}
