import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutQLComponent } from '../layout-ql/layout-ql.component';
import { QlPageProductComponent } from './ql-page-product/ql-page-product.component';
import { CustomerComponent } from './customer/customer.component';

const routes: Routes = [
  {path:'', redirectTo:'productQL',pathMatch:'full'},
  {path: '', component:LayoutQLComponent,
    children: [
      {
        path: 'productQL', component: QlPageProductComponent 
        // loadChildren: ()=> import('./ql-page-product/ql-page-product.component').then(m => m.QlPageProductComponent)
      },
      {path:'customerQL', component:CustomerComponent}
    ]
  },
  {path:'**', component:QlPageProductComponent}
];


@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class PqlAppRoutingModule { }
