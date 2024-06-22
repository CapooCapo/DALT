import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MLayoutComponent } from './m-layout/m-layout.component';
import { MProductComponent } from './in-pages/m-product/m-product.component';
import { LoggingComponent } from './share/component/logging/logging.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/',
    pathMatch: 'full',
  },
  {
    path: '',
    component: MLayoutComponent,
    children:[
      {path: 'porducts', component: MProductComponent},
      {path: 'logging', component: LoggingComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
