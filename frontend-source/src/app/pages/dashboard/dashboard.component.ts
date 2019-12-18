import {Component, OnDestroy, OnInit} from '@angular/core';
import {History, HistorysService} from '../../services/historys.service';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  history: Array<History> = [];
  interval;

  constructor(private historyService: HistorysService) {
  }

  ngOnInit() {
    this.historyService.getHistorys().pipe(take(1)).subscribe(histories => {
      this.history = histories;
    });
    const self = this;
    this.interval = setInterval(() => {
      self.historyService.getHistorys().pipe(take(1)).subscribe(histories => {
        self.history = histories;
      });
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}


