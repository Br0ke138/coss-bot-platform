import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-order-table',
  templateUrl: './order-table.component.html',
  styleUrls: ['./order-table.component.scss']
})
export class OrderTableComponent {
  @Input()
  dataSource = [];

  @Input()
  pair: string;

  displayedColumns: string[] = ['price', 'asset', 'quote', 'profit'];

}
