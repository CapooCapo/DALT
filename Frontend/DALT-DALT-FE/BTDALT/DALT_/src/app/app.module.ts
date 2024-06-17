import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';

import { BarkeyApiService } from './Until/barkey-api.service';


import { AppComponent } from './app.component';
import { QlPageProductComponent } from './QLPage/ql-page-product/ql-page-product.component';
import { PqlAppRoutingModule } from './QLPage/pql-app-routing.module';
import { LoggingComponent } from './QLPage/logging/logging.component';
import { PaginationComponent } from './QLPage/pagination/pagination.component';
import { ListProductComponent } from './QLPage/list-product/list-product.component';
import { LayoutQLComponent } from './layout-ql/layout-ql.component';
import { HeaderQLComponent } from './QLPage/header-ql/header-ql.component';
import { PbarkeyAppRoutingModule } from './homePage/pbarkey-app-routing.module';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './homePage/home/home.component';
import { PageLayoutComponent } from './homePage/page-layout/page-layout.component';
import { CustomerComponent } from './QLPage/customer/customer.component';

@NgModule({
  declarations: [
    AppComponent,
    QlPageProductComponent,
    LoggingComponent,
    PaginationComponent,
    ListProductComponent,
    LayoutQLComponent,
    HeaderQLComponent,
    HomeComponent,
    PageLayoutComponent,
    CustomerComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    CommonModule,
    PbarkeyAppRoutingModule,
    RouterModule.forRoot([]) // Không có đường dẫn ở đây vì đường dẫn sẽ được quyết định trong AppComponent
  ],
  providers: [BarkeyApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
