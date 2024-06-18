import { Component } from '@angular/core';
import { DTOProduct } from '../../../../share/DTO/dto';
import { BkapiService } from 'src/app/share/service/bkapi.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-m-product',
  templateUrl: './m-product.component.html',
  styleUrls: ['./m-product.component.scss']
})
export class MProductComponent {
//menu

currentPage: number = 1; // Khởi tạo currentPage với giá trị mặc định là 1
totalPages: number = 0; // Khởi tạo totalPages với giá trị mặc định là 0

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

  constructor(private barkeyApi : BkapiService){}

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
  

  //chuyển trang
  onPageChange(pageNumber: number): void {
    this.currentPage = pageNumber; // Cập nhật trang hiện tại
    this.loadProducts(); // Tải lại dữ liệu sản phẩm cho trang mới
  }
}
