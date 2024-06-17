import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DTOProduct, MENU, MenuItem } from '../mockdata-PQL/menu-item';
import { BarkeyApiService } from 'src/app/Until/barkey-api.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-ql-page-product',
  templateUrl: './ql-page-product.component.html',
  styleUrls: ['./ql-page-product.component.scss']
})
export class QlPageProductComponent{


  currentPage: number = 1;
  totalPages: number = 10;

  onPageChange(page: number) {
    this.currentPage = page;
  }


  products: DTOProduct[] = []

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.barkeyApi.loadProducts().subscribe(
      (data: DTOProduct[]) => {
        this.products = data;
        console.log('Products:', this.products);
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }

  arrUnsubscribe: Subscription[] = [];

  constructor(private barkeyApi : BarkeyApiService){}

  GetListProduct(CatalogId: string):void {
    let GetListProduct = this.barkeyApi.GetProductBycatagoertID(CatalogId)
    .subscribe({
      next: (response: DTOProduct[]) => {
        this.products = response; // Gán dữ liệu nhận được từ API vào biến products
      },
      error: (err: any) => {
        console.log('Error fetching products:', err);
      }
    });
    this.arrUnsubscribe.push(GetListProduct);
  }
  
  
}
