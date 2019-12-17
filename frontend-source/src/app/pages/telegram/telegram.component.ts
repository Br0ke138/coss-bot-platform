import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-telegram',
  templateUrl: './telegram.component.html',
  styleUrls: ['./telegram.component.scss']
})
export class TelegramComponent implements OnInit {

  form: FormGroup;
  telegram: any;

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.http.get('http://localhost:3000/db/telegrams').pipe(take(1)).subscribe((telegrams: Array<{ id: string, botId: string, chatId: string }>) => {
      if (telegrams.length > 0) {
        this.telegram = telegrams[0];
        this.form = new FormGroup({
          botId: new FormControl(telegrams[0].botId),
          chatId: new FormControl(telegrams[0].chatId),
        });
      } else {
        this.form = new FormGroup({
          botId: new FormControl(''),
          chatId: new FormControl(''),
        });
        console.log(this.form.value);
      }
    });
  }

  save() {
    if (this.telegram) {
      this.http.put('http://localhost:3000/db/telegrams/' + this.telegram.id, Object.assign(this.telegram, this.form.value)).pipe(take(1)).subscribe(result => {
        this.telegram = result['content'];

        this.http.get('http://localhost:3000/telegramApi/initTelegram/').pipe(take(1)).subscribe(result => {
          console.log(result);
        })
      })
    } else {
      this.http.post('http://localhost:3000/db/telegrams/', this.form.value).pipe(take(1)).subscribe(result => {
        this.telegram = result['content'];

        this.http.get('http://localhost:3000/telegramApi/initTelegram/').pipe(take(1)).subscribe(result => {
          console.log(result);
        })
      })
    }
  }

}
