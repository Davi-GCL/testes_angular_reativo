import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { MainComponent } from './pages/main/main.component';

const routes: Routes = [
  { path: '', pathMatch: "full",redirectTo: 'main' },
  { path:'main', loadChildren: () => import('./pages/main/main.module').then(m => m.MainModule) }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ bindToComponentInputs: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
