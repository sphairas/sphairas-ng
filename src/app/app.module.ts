import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TermSheetsModule } from './termsheets/termsheets.module';
import { AppMainComponent } from './app.main';
import { LessonsModule } from './lessons/lessons.module';

//Needed to set de locale
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
registerLocaleData(localeDe, 'de');

@NgModule({
  declarations: [
    AppComponent,
    AppMainComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // import HttpClientModule after BrowserModule.
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    // MatIconRegistry,
    MatButtonModule,
    HttpClientModule,
    AppRoutingModule,
    LessonsModule,
    TermSheetsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: "de" }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
