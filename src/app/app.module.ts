import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { LOCALE_ID } from '@angular/core';
import localePt from '@angular/common/locales/pt';
import {registerLocaleData} from '@angular/common';
import { FiltroListaPipe } from './pipes/filtro-lista.pipe';

//Configuração necessária para formatar valor monetario com virgulas com o pipe "currency"
registerLocaleData(localePt);

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    RouterOutlet,
    AppRoutingModule,
    HttpClientModule
  ],
  bootstrap: [
    AppComponent
  ],
  providers: [{ //Configuração necessária para formatar valor monetario com virgulas com o pipe "currency"
    provide: LOCALE_ID, 
    useValue: "pt-BR"
  }],
})
export class AppModule { }
