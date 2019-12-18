import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Bot, BotsService} from '../../../services/bots.service';
import {Observable, Subscription} from 'rxjs';
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
import {map, startWith, take} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Decimal} from 'decimal.js';
import {OrderResponse} from '../../../../../../bots-grid-source/swaggerSchema';

@Component({
  selector: 'app-bots-detail',
  templateUrl: './bots-detail.component.html',
  styleUrls: ['./bots-detail.component.scss']
})
export class BotsDetailComponent implements OnInit, OnDestroy {

  bot: Bot;
  private routeSub: Subscription;
  form: FormGroup;
  currentPair: string;

  totalBuy = 0;
  totalSell = 0;

  pairSeries: ApexAxisChartSeries;

  tooltip: ApexTooltip = {
    enabled: false,
  };
  series: ApexAxisChartSeries;
  seriesRunning: ApexAxisChartSeries;
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
  colorsRunning: string[];
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
    }],
    base_currencies: [{
      currency_code: string;
      minimum_total_order: string;
    }]
  };
  precisionPrice = 0;
  precisionAmount = 0;

  minOrderSize = 0;
  margin = 0;
  gridsAll = [];

  editedForm = false;

  interval;

  pairSearch = new FormControl();
  filteredOptions: Observable<any>;

  buyOrders: Array<{
    price: number;
    asset: string;
    quote: number;
    profit: string;
  }> = [];

  sellOrders: Array<{
    price: number;
    asset: string;
    quote: number;
    profit: string;
  }> = [];

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
        this.filteredOptions = this.pairSearch.valueChanges
          .pipe(
            startWith(''),
            map(value => this._filter(value))
          );

        this.getInfos();

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
          if (this.bot.config) {
            this.precisionPrice = this.bot.config.precisionPrice;
            this.precisionAmount = this.bot.config.precisionAmount;
            this.form = new FormGroup({
              pair: new FormControl(this.bot.config.pair),
              upperWall: new FormControl(this.bot.config.upperWall),
              lowerWall: new FormControl(this.bot.config.lowerWall),
              numberOfGrids: new FormControl(this.bot.config.numberOfGrids),
              amountPerGrid: new FormControl(this.bot.config.amountPerGrid),
            });

          } else {
            this.form = new FormGroup({
              pair: new FormControl(),
              upperWall: new FormControl(),
              lowerWall: new FormControl(),
              numberOfGrids: new FormControl(),
              amountPerGrid: new FormControl(),
            });
          }

          if (this.bot.orders && this.bot.orders.length > 0 && this.bot.status === 'Running') {
            this.fillOrders(this.bot.orders);
          }
          this.form.valueChanges.subscribe((value) => {
            this.editedForm = true;

            if (this.currentPair !== value.pair) {
              this.getInfos();
            }
          });
          if (this.bot.status === 'Running' || this.bot.status === 'Crashed') {
            this.form.disable();
          }
          const self = this;
          this.interval = setInterval(() => {
            self.botsService.getBot(params['id']).pipe(take(1)).subscribe(bot => {
              self.bot = bot;
              if (self.bot.status === 'Running') {
                this.form.disable();
              } else {
                this.form.enable();
              }

              if (self.bot.orders && self.bot.orders.length > 0 && self.bot.status === 'Running') {
                self.fillOrders(self.bot.orders);
              }
            });
          }, 10000);
        }
      });
    });
  }

  private fillOrders(orders: Array<OrderResponse>) {
    const buyOrders: Array<{
      price: number;
      asset: string;
      quote: number;
      profit: string;
    }> = [];

    const sellOrders: Array<{
      price: number;
      asset: string;
      quote: number;
      profit: string;
    }> = [];

    orders.forEach(order => {
      if (order.order_side === 'BUY') {
        buyOrders.push({
          price: parseFloat(order.order_price),
          asset: Decimal.div(this.form.value.amountPerGrid, parseFloat(order.order_price)).toNumber().toFixed(this.precisionAmount),
          quote: this.form.value.amountPerGrid,
          profit: ((((parseFloat(order.order_price) + this.margin) / parseFloat(order.order_price)) - 1) * 100).toFixed(2),
        });
      } else {
        sellOrders.push({
          price: parseFloat(order.order_price),
          asset: Decimal.div(this.form.value.amountPerGrid, parseFloat(order.order_price)).toNumber().toFixed(this.precisionAmount),
          quote: this.form.value.amountPerGrid,
          profit: ((((parseFloat(order.order_price) + this.margin) / parseFloat(order.order_price)) - 1) * 100).toFixed(2),
        });
      }
    });
    this.buyOrders = buyOrders;
    this.sellOrders = sellOrders;

    this.http.get('http://localhost:3000/api/engine/cs?symbol=' + this.bot.config.pair + '&tt=12h')
      .pipe(take(1))
      .subscribe((cs: { series: Array<any> }) => {
        const data = [];
        const dateTimes = [];

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
          dateTimes.push(entry[0]);
        });

        const seriesRunning = [{
          name: '2h',
          // @ts-ignore
          type: 'candlestick',
          data
        }];
        this.colorsRunning = ['black'];

        orders.forEach((order, index) => {
          const array = [];
          dateTimes.forEach(dateTime => {
            array.push({
              x: new Date(dateTime),
              y: parseFloat(order.order_price)
            });
          });
          seriesRunning.push({
            name: 'grid #' + (index + 1),
            // @ts-ignore
            type: 'line',
            data: array
          });
          this.colorsRunning.push('white');
        });

        this.seriesRunning = seriesRunning;
      });
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.symbols.filter(symbol => symbol.toLowerCase().includes(filterValue));
  }

  getInfos() {
    if (this.exchangeInfo && this.form.value.pair) {
      this.precisionPrice = 0;
      this.exchangeInfo.symbols.forEach(symbol => {
        if (symbol.symbol === this.form.value.pair) {
          this.precisionPrice = parseInt(symbol.price_limit_decimal, 10);
          this.precisionAmount = parseInt(symbol.amount_limit_decimal, 10);
        }
      });

      this.exchangeInfo.base_currencies.forEach(currency => {
        if (currency.currency_code === this.form.value.pair.split('_')[1]) {
          this.minOrderSize = parseFloat(currency.minimum_total_order);
        }
      });
    }
  }

  startBot() {
    this.botsService.startBot(this.bot.id).pipe(take(1)).subscribe(() => {
      this.botsService.getBot(this.bot.id).pipe(take(1)).subscribe(bot => {
        this.bot = bot;
        this.form.disable();

        if (this.bot.orders && this.bot.orders.length > 0 && this.bot.status === 'Running') {
          this.fillOrders(this.bot.orders);
        }
      });
    });
  }

  stopBot() {
    this.botsService.stopBot(this.bot.id).pipe(take(1)).subscribe(() => {
      this.botsService.getBot(this.bot.id).pipe(take(1)).subscribe(bot => {
        this.bot = bot;
        this.form.disable();
      });
    });
  }

  removeBot() {
    this.botsService.removeBot(this.bot.id).pipe(take(1)).subscribe(() => {
      this.router.navigate(['/bots']);
    });
  }


  saveConfig() {
    const bot: Bot = this.bot;
    bot.config = this.form.value;
    bot.config.grids = this.gridsAll;
    bot.config.precisionPrice = this.precisionPrice;
    bot.config.precisionAmount = this.precisionAmount;

    this.botsService.updateBot(this.bot.id, bot).pipe(take(1)).subscribe(update => {
      this.botsService.getBot(this.bot.id).pipe(take(1)).subscribe(bot => {
        this.bot = bot;
        this.fillForm(this.bot.config);
        this.editedForm = false;
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
        this.getInfos();
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
            this.pairSeries = [].concat(this.series);
            this.seriesCopy = [].concat(this.series);

            this.current = parseFloat(cs.series[cs.series.length - 1][4]);
            this.buildGrids(form, this.current, this.dateTimes);
            this.showChart = true;
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

      const series = [].concat(this.pairSeries);
      // Grids
      this.grids = [];

      const upper = parseFloat(form.upperWall);
      const lower = parseFloat(form.lowerWall);
      const gridAmount = parseFloat(form.numberOfGrids);

      this.margin = this.getGridDistance();

      for (let i = 0; i < gridAmount; i++) {
        const price = Decimal.sub(upper, (Decimal.mul(this.margin, i).toNumber())).toNumber();
        if (upper >= price && price >= lower) {
          this.grids.push(price);
        }
      }
      this.gridsAll = [].concat(this.grids);
      // tslint:disable-next-line:max-line-length
      const closest = this.grids.reduce((prev, curr) => (Math.abs(parseFloat(curr) - this.current) < Math.abs(parseFloat(prev) - this.current) ? curr : prev));
      this.grids.splice(this.grids.indexOf(closest), 1);

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

      this.series = series;
      this.showChart = true;
    }

  }

  getMaxGrids() {
    if (this.form.value.upperWall && this.form.value.lowerWall && this.precisionPrice) {
      return Decimal.mul(
        Decimal.sub(
          this.form.value.upperWall,
          this.form.value.lowerWall
        ).toNumber(),
        Math.pow(10, this.precisionPrice)
      ).toNumber() + 1;
    } else {
      return 0;
    }
  }

  getGridDistance() {
    // tslint:disable-next-line:max-line-length
    return Decimal.div(
      Math.floor(
        Decimal.mul(
          Math.pow(10, this.precisionPrice),
          Decimal.div(
            Decimal.sub(
              this.form.value.upperWall,
              this.form.value.lowerWall
            ).toNumber(),
            this.form.value.numberOfGrids - 1
          ).toNumber()
        ).toNumber()
      ),
      Math.pow(10, this.precisionPrice)
    ).toNumber();

  }

  getBuyOrders(): Array<{
    price: number;
    asset: string;
    quote: number;
    profit: string;
  }> {
    const grids = this.grids.filter(grid => {
      return grid < this.current;
    });

    this.totalBuy = 0;

    const dataSource: Array<{
      price: number;
      asset: string;
      quote: number;
      profit: string;
    }> = [];
    grids.forEach(grid => {
      dataSource.push({
        price: grid,
        asset: Decimal.div(this.form.value.amountPerGrid, grid).toNumber().toFixed(this.precisionAmount),
        quote: this.form.value.amountPerGrid,
        profit: ((((grid + this.margin) / grid) - 1) * 100).toFixed(2),
      });
      this.totalBuy = Decimal.add(this.totalBuy, this.form.value.amountPerGrid).toNumber();
    });

    this.totalBuy = parseFloat(this.totalBuy.toFixed(this.precisionPrice));
    return dataSource;
  }

  getSellOrders(): Array<{
    price: number;
    asset: string;
    quote: number;
    profit: string;
  }> {
    const grids = this.grids.filter(grid => {
      return grid > this.current;
    });

    this.totalSell = 0;

    const dataSource: Array<{
      price: number;
      asset: string;
      quote: number;
      profit: string;
    }> = [];
    grids.forEach(grid => {
      dataSource.push({
        price: grid,
        asset: Decimal.div(this.form.value.amountPerGrid, grid).toNumber().toFixed(this.precisionAmount),
        quote: this.form.value.amountPerGrid,
        profit: ((1 - ((grid - this.margin) / grid)) * 100).toFixed(2),
      });
      this.totalSell = Decimal.add(this.totalSell, Decimal.div(this.form.value.amountPerGrid, grid).toNumber()).toNumber();
    });

    this.totalSell = parseFloat(this.totalSell.toFixed(this.precisionAmount));

    return dataSource.reverse();
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
