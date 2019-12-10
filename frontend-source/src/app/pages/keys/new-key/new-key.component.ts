import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-new-key',
  templateUrl: './new-key.component.html',
  styleUrls: ['./new-key.component.scss']
})
export class NewKeyComponent implements OnInit {

  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<NewKeyComponent>) { }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(),
      public: new FormControl(),
      secret: new FormControl(),
      password: new FormControl(),
    });
  }

}
