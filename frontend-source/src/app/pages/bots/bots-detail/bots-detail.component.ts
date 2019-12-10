import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Bot, BotsService} from '../../../services/bots.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexGrid,
  ApexLegend,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis
} from 'ng-apexcharts';
import {take} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-bots-detail',
  templateUrl: './bots-detail.component.html',
  styleUrls: ['./bots-detail.component.scss']
})
export class BotsDetailComponent implements OnInit {

  bot: Bot;
  private routeSub: Subscription;
  form: FormGroup;
  currentPair: string;
  pairSeries: ApexAxisChartSeries;

  tooltip: ApexTooltip = {
    enabled: false,
  };
  series: ApexAxisChartSeries;
  seriesCopy: ApexAxisChartSeries;
  chart: ApexChart = {
    height: 400,
    type: 'line',
    animations: {
      enabled: false
    },
    events: {
      zoomed: (chartContext, {xaxis, yaxis}) => {
        // TODO: Remove not visible grids so zoom can adjust y-axis
        // const seriesCopy = this.seriesCopy;
        // const newSeries: ApexAxisChartSeries = [];
        //
        // let min;
        // let max;

        // seriesCopy.forEach((serie, index) => {
        //   if (index === 0) {
        //     newSeries.push(serie);
        //   } else {
        //     // @ts-ignore
        //     console.log((new Date(serie.data[0].x)).getTime());
        //     // @ts-ignore
        //     if (xaxis.min <= (new Date(serie.data[0].x)).getTime() <= xaxis.max) {
        //       newSeries.push(serie);
        //     }
        //   }
        // });

        // this.series = newSeries;
      }
    }
  };
  xAxis: ApexXAxis = {
    type: 'datetime',
    labels: {
      style: {
        // @ts-ignore
        colors: 'white'
      }
    },
    tooltip: {
      enabled: false
    }
  };

  yAxis: ApexYAxis = {
    labels: {
      style: {
        color: 'white'
      }
    },
    tooltip: {
      enabled: false
    }
  };
  stroke: ApexStroke = {
    width: 1
  };

  colors: string[];
  grid: ApexGrid = {
    yaxis: {
      lines: {
        show: false
      }
    },
  };

  legend: ApexLegend = {
    show: false,
  };

  title: ApexTitleSubtitle = {
    text: 'CandleStick Chart',
    align: 'left',
    style: {
      color: 'white'
    }
  };
  showChart = false;

  symbols: Array<string> = [];
  current: number;
  dateTimes: Array<number>;
  grids: any[] = [];

  exchangeInfo: {
    symbols: [{
      symbol: string;
      amount_limit_decimal: string;
      price_limit_decimal: string;
      allow_trading: boolean;
    }]
  };

  constructor(
    private route: ActivatedRoute,
    public botsService: BotsService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private http: HttpClient
  ) {
  }

  ngOnInit() {
    this.http.get('http://localhost:3000/api/trade/exchange-info')
      .pipe(take(1))
      .subscribe((exchangeInfo: any) => {
        this.exchangeInfo = exchangeInfo;
        this.exchangeInfo.symbols.forEach(symbol => {
          this.symbols.push(symbol.symbol);
        });

        this.symbols.sort((a: string, b: string) => {
          return a.split('_')[0] < b.split('_')[0] ? -1 : 1;
        });

        this.symbols.sort((a: string, b: string) => {
          return a.split('_')[1] < b.split('_')[1] ? -1 : 1;
        });
      });

    this.routeSub = this.route.params.subscribe(params => {
      this.botsService.getBot(params['id']).pipe(take(1)).subscribe(bot => {
        this.bot = bot;
        if (this.bot) {
          if (this.bot.status === 'Running') {
            this.form.disable();
          }
          if (this.bot.config) {
            this.form = new FormGroup({
              pair: new FormControl(this.bot.config.pair),
              upperWall: new FormControl(this.bot.config.upperWall),
              lowerWall: new FormControl(this.bot.config.lowerWall),
              numberOfGrids: new FormControl(this.bot.config.numberOfGrids),
              amountPerGrid: new FormControl(this.bot.config.amountPerGrid),
            });
            this.initChart(this.form.value);
          } else {
            this.form = new FormGroup({
              pair: new FormControl(),
              upperWall: new FormControl(),
              lowerWall: new FormControl(),
              numberOfGrids: new FormControl(),
              amountPerGrid: new FormControl(),
            });
          }
          this.form.valueChanges.subscribe(form => {
            this.initChart(form);
          });
        }
      });
    });


  }

  // startBot() {
  //   this.botsService.startBot(this.bot.id);
  //   this.bot = this.botsService.getBot(this.bot.id);
  //   this.form.disable();
  // }
  //
  // stopBot() {
  //   this.botsService.stopBot(this.bot.id);
  //   this.bot = this.botsService.getBot(this.bot.id);
  //   this.form.enable();
  // }
  //

  removeBot() {
    this.botsService.removeBot(this.bot.id).pipe(take(1)).subscribe(() => {
      this.router.navigate(['/bots']);
    });
  }


  saveConfig() {
    const bot = this.bot;
    bot.config = this.form.value;

    this.botsService.updateBot(this.bot.id, bot).pipe(take(1)).subscribe( update => {
      this.botsService.getBot(this.bot.id).pipe(take(1)).subscribe(bot => {
        this.bot = bot;
        this.fillForm(this.bot.config);
      });
    });

  }

  fillForm(config: any) {
    this.form.setValue({
      pair: config.pair,
      upperWall: config.upperWall,
      lowerWall: config.lowerWall,
      numberOfGrids: config.numberOfGrids,
      amountPerGrid: config.amountPerGrid,
    });
    this.cdr.detectChanges();
  }

  initChart(form: { pair, upperWall, lowerWall, numberOfGrids }) {
    if (form.pair) {
      if (this.currentPair !== form.pair) {
        this.currentPair = form.pair;
        this.showChart = false;
        this.http.get('http://localhost:3000/api/engine/cs?symbol=' + form.pair + '&tt=12h')
          .pipe(take(1))
          .subscribe((cs: { series: Array<any> }) => {
            const data = [];
            this.dateTimes = [];

            cs.series.forEach(entry => {
              const dataEntry = {
                x: new Date(entry[0]),
                y: [
                  parseFloat(entry[1]),
                  parseFloat(entry[2]),
                  parseFloat(entry[3]),
                  parseFloat(entry[4]),
                ]
              };
              data.push(dataEntry);
              this.dateTimes.push(entry[0]);
            });

            this.series = [{
              name: '2h',
              // @ts-ignore
              type: 'candlestick',
              data
            }];
            this.pairSeries = this.series;
            this.seriesCopy = this.series;

            this.current = parseFloat(cs.series[cs.series.length - 1][4]);
            this.buildGrids(form, this.current, this.dateTimes);
          });
      } else {
        this.buildGrids(form, this.current, this.dateTimes);
      }

    } else {
      this.showChart = false;
    }
  }

  buildGrids(form: { pair, upperWall, lowerWall, numberOfGrids }, current: number, dateTimes: Array<number>) {
    if (form.upperWall && form.lowerWall && form.numberOfGrids) {

      const series = this.pairSeries;
      // Grids
      this.grids = [];

      const upper = form.upperWall;
      const lower = form.lowerWall;
      const gridAmount = form.numberOfGrids;
      const margin = (upper - lower) / gridAmount;

      for (let i = 0; i < gridAmount; i++) {
        this.grids.push(upper - (i * margin));
      }
      this.colors = ['black'];

      this.grids.forEach((grid, index) => {
        const array = [];
        dateTimes.forEach(dateTime => {
          array.push({
            x: new Date(dateTime),
            y: grid
          });
        });
        series.push({
          name: 'grid #' + (index + 1),
          // @ts-ignore
          type: 'line',
          data: array
        });
        if (grid > current) {
          this.colors.push('white');
        } else {
          this.colors.push('white');
        }
      });

      this.series = this.series.concat(series);
    }
    this.showChart = true;
  }

  getBuyOrders(): Array<number> {
    return this.grids.filter(grid => {
      return grid < this.current;
    });
  }

  getSellOrders(): Array<number> {
    return this.grids.filter(grid => {
      return grid > this.current;
    });
  }

}
