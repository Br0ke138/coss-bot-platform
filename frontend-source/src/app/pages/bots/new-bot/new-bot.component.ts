import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';
import {FormControl, FormGroup} from '@angular/forms';
import {Key, KeysService} from '../../../services/keys.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-new-bot',
  templateUrl: './new-bot.component.html',
  styleUrls: ['./new-bot.component.scss']
})
export class NewBotComponent implements OnInit {

  form: FormGroup;
  keys: Array<Key> = [];

  constructor(private keysService: KeysService, public dialogRef: MatDialogRef<NewBotComponent>) {
  }

  ngOnInit() {
    this.keysService.getKeys().pipe(take(1)).subscribe(keys => {
      this.keys = keys;
    });

    this.form = new FormGroup({
      name: new FormControl(),
      type: new FormControl(),
      keys: new FormControl(),
    });
  }

}
