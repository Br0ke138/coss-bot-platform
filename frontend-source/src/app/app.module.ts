import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SidenavComponent} from './sidenav/sidenav.component';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatFormFieldModule, MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule, MatProgressSpinnerModule, MatSelectModule,
  MatSidenavModule,
  MatToolbarModule
} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HeaderComponent} from './header/header.component';
import {FooterComponent} from './footer/footer.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {BotsComponent} from './pages/bots/bots.component';
import {NewBotComponent} from './pages/bots/new-bot/new-bot.component';
import {BotsDetailComponent} from './pages/bots/bots-detail/bots-detail.component';
import { KeysComponent } from './pages/keys/keys.component';
import { KeysDetailComponent } from './pages/keys/keys-detail/keys-detail.component';
import { NewKeyComponent } from './pages/keys/new-key/new-key.component';
import {NgApexchartsModule} from 'ng-apexcharts';
import {HttpClientModule} from '@angular/common/http';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';

@NgModule({
  declarations: [
    AppComponent,
    SidenavComponent,
    HeaderComponent,
    FooterComponent,
    DashboardComponent,
    BotsComponent,
    NewBotComponent,
    BotsDetailComponent,
    KeysComponent,
    KeysDetailComponent,
    NewKeyComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatCardModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatGridListModule,
    NgApexchartsModule,
    MatProgressSpinnerModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    NewBotComponent,
    NewKeyComponent
  ]
})
export class AppModule { }
