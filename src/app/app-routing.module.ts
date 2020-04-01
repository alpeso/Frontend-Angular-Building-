import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { Page404Component } from './components/page404/page404.component';
import { BuildingComponent } from './components/building/building.component';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dasboard',
    pathMatch: 'full'
  },
 {
    path: 'dasboard',
    component: BuildingComponent
  },
  { 
    path: '**',
    component: BuildingComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
