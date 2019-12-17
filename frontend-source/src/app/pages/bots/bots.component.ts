import {Component, OnInit} from '@angular/core';
import {Bot, BotsService} from '../../services/bots.service';
import {MatDialog} from '@angular/material';
import {NewBotComponent} from './new-bot/new-bot.component';
import {take} from 'rxjs/operators';
import {TelegramService} from '../../services/telegram.service';

@Component({
  selector: 'app-bots',
  templateUrl: './bots.component.html',
  styleUrls: ['./bots.component.scss']
})
export class BotsComponent implements OnInit {

  bots: Array<Bot> = [];

  constructor(public botsService: BotsService, private dialog: MatDialog, private telegramService: TelegramService) {
  }

  ngOnInit() {
    this.botsService.getBots().pipe(take(1)).subscribe(bots => {
      this.bots = bots;
    }, err => {
      console.log(err);
    });
  }

  createBot() {
    this.dialog.open(NewBotComponent, {disableClose: true}).afterClosed().subscribe((bot: Bot) => {
      if (bot) {
        this.botsService.addBot(bot).pipe(take(1)).subscribe(result => {
          console.log(result);

          this.botsService.getBots().pipe(take(1)).subscribe(bots => {
            this.bots = bots;
          }, err => {
            console.log(err);
          });
        });
      }
    });
  }

}
