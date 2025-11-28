import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StoreModule } from '@ngrx/store';
import { MatButton } from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppStateModule } from './state/app-state.module';
import { AppPaginatorIntl } from './services/utils/mat-paginator-intl.service';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StoreModule.forRoot({}),
    AppStateModule,
    MatButton,
    HttpClientModule,
  ],
  providers: [
    provideAnimationsAsync('noop'),
    { provide: MatPaginatorIntl, useClass: AppPaginatorIntl },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
