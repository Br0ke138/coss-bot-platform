import {AfterViewInit, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {MatSidenav} from '@angular/material';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {

  routes = [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      path: '',
    },
    {
      title: 'Bots',
      icon: 'view_list',
      path: 'bots',
    },
    {
      title: 'Keys',
      icon: 'view_list',
      path: 'keys',
    },
    {
      title: 'Telegram',
      icon: 'view_list',
      path: 'telegram',
    }
  ];

}
