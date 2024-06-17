import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PageLayoutComponent } from './page-layout/page-layout.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: 'customerPage', pathMatch: 'full' },
  {
    path: '',
    component: PageLayoutComponent,
    children: [
      { path: 'customerPage', component: HomeComponent },
      // Các đường dẫn khác cho phần khách hàng
    ]
  }
];


@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PbarkeyAppRoutingModule { }
