import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutQlComponent } from '../layout/layout-ql/layout-ql.component';

const routes: Routes = [
  {path:'', redirectTo:'/',pathMatch:'full'},
  {path: 'productQL', component:LayoutQlComponent,
    children: [
      {
        path:'',
        loadChildren: ()=> import('./ql-page-product/ql-page-product.component').then(m => m.QlPageProductComponent)
      }
    ]
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PqlAppRoutingModule { }
