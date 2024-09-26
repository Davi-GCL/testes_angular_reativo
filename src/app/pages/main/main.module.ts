import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MainComponent } from './main.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MainRoutingModule } from './main-routing.module';
import { FiltroListaPipe } from '../../pipes/filtro-lista.pipe';

@NgModule({
  declarations: [
    MainComponent,
    FiltroListaPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MainRoutingModule
  ]
})
export class MainModule { }
