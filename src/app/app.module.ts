import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { StateManagerService } from './state-manager.service';
import { AngularFireModule } from 'angularfire2';
import { MaterialModule } from '@angular/material';

// Firebase Config from console
const firebaseConfig = {
  apiKey: 'AIzaSyC5GBq_vvyQBAVe4g9dt5FKUCm0BM-HhmU',
  authDomain: 'audiopcp.firebaseapp.com',
  databaseURL: 'https://audiopcp.firebaseio.com',
  storageBucket: 'audiopcp.appspot.com',
  messagingSenderId: '732515644030'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [
    StateManagerService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
