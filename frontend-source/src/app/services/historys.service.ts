import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {OrderResponse} from '../../../../bots-grid-source/swaggerSchema';

@Injectable({
  providedIn: 'root'
})
export class HistorysService {
  constructor(private http: HttpClient) {
  }

  getHistorys() {
    return this.http.get<Array<OrderResponse>>('http://localhost:3000/db/historys');
  }

}

