import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MLayoutComponent } from './m-layout/m-layout.component';
import { ULayoutComponent } from './u-layout/u-layout.component';
import { PaginationComponent } from './in-pages/pagination/pagination.component';
import { MProductComponent } from './in-pages/m-product/m-product.component';
import { RouterModule } from '@angular/router';
import { LayoutRoutingModule } from './layout-routing.module';
import { HeaderComponent } from './share/component/header/header.component';
import { FormsModule } from '@angular/forms';
import { FooterComponent } from './share/component/footer/footer.component';



@NgModule({
  declarations: [
    MLayoutComponent,
    ULayoutComponent,
    PaginationComponent,
    MProductComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    LayoutRoutingModule
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA,
  ],
  exports: [ 
    CommonModule,
    FormsModule,
    HeaderComponent
  ]
})
export class LayoutModule { }
