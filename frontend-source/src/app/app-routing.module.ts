import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {BotsComponent} from './pages/bots/bots.component';
import {BotsDetailComponent} from './pages/bots/bots-detail/bots-detail.component';
import {KeysComponent} from './pages/keys/keys.component';
import {KeysDetailComponent} from './pages/keys/keys-detail/keys-detail.component';


const routes: Routes = [
  {
    path: '',
    component: DashboardComponent
  },
  {
    path: 'bots',
    component: BotsComponent
  },
  {
    path: 'bots/:id',
    component: BotsDetailComponent
  },
  {
    path: 'keys',
    component: KeysComponent
  },
  {
    path: 'keys/:id',
    component: KeysDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
