import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms'; // <-- NgModel lives here


import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LayoutQlComponent } from './layout/layout-ql/layout-ql.component';
import { QlPageProductComponent } from './QLPage/ql-page-product/ql-page-product.component';
import { PqlAppRoutingModule } from './QLPage/pql-app-routing.module';
import { BarkeyApiService } from './Until/barkey-api.service';
import { HttpClientModule } from '@angular/common/http';
import { LoggingComponent } from './QLPage/logging/logging.component';
import { NavbarComponent } from './QLPage/navbar/navbar.component';
import { RegisterComponent } from './QLPage/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    LayoutQlComponent,
    QlPageProductComponent,
    LoggingComponent,
    NavbarComponent,
    RegisterComponent

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    PqlAppRoutingModule,
    HttpClientModule,
    FormsModule,
    
  ],
  providers: [BarkeyApiService],
  bootstrap: [AppComponent]
})
export class AppModule { }
