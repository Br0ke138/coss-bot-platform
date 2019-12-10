import {Component, OnInit} from '@angular/core';
import {Key, KeysService} from '../../services/keys.service';
import {NewBotComponent} from '../bots/new-bot/new-bot.component';
import {MatDialog} from '@angular/material';
import * as CryptoJS from 'crypto-js';
import {NewKeyComponent} from './new-key/new-key.component';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-keys',
  templateUrl: './keys.component.html',
  styleUrls: ['./keys.component.scss']
})
export class KeysComponent implements OnInit {

  keys: Array<Key> = [];

  constructor(public keysService: KeysService, private dialog: MatDialog) {
  }

  ngOnInit() {
    this.keysService.getKeys().pipe(take(1)).subscribe(keys => {
      this.keys = keys;
    }, err => {
      console.log(err);
    });
  }

  createKey() {
    this.dialog.open(NewKeyComponent, {disableClose: true}).afterClosed().subscribe(data => {
      if (data) {
        const key: Key = {
          name: data.name,
          public: data.public,
          secret: data.secret,
        };
        this.keysService.addKey(key).pipe(take(1)).subscribe(result => {
          console.log(result);
          this.keysService.getKeys().pipe(take(1)).subscribe(keys => {
            this.keys = keys;
          }, err => {
            console.log(err);
          });
        }, error => {
          alert(error);
        });
      }
    });
  }

  encryptData(str: string, password: string) {
    try {
      return CryptoJS.AES.encrypt(str, password).toString();
    } catch (e) {
      console.log(e);
    }
  }

  decryptData(str: string, password: string) {
    try {
      return CryptoJS.AES.decrypt(str, password);
    } catch (e) {
      console.log(e);
    }
  }
}
