import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { LayoutQLComponent } from './layout-ql/layout-ql.component';

const routes: Routes = [
  {path:'', redirectTo:'page',pathMatch:'full'},
  {
    path: 'ql',
    loadChildren: () => import('./QLPage/pql-app-routing.module').then(m => m.PqlAppRoutingModule)
  },
  {
    path: 'page',
    loadChildren: () => import('./homePage/pbarkey-app-routing.module').then(m => m.PbarkeyAppRoutingModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
