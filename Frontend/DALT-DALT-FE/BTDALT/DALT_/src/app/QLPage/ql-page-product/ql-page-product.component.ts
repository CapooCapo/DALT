import { PRODUCTS } from './../mockdata-PQL/menu-item';
import { Component } from '@angular/core';
import { MENU, MenuItem, product } from '../mockdata-PQL/menu-item';
import { BarkeyApiService } from 'src/app/Until/barkey-api.service';


@Component({
  selector: 'app-ql-page-product',
  templateUrl: './ql-page-product.component.html',
  styleUrls: ['./ql-page-product.component.scss']
})
export class QlPageProductComponent {
  products= PRODUCTS;
  // constructor(private barkeyAPI: BarkeyApiService) {}

  //lifecycle
  // ngOnInit(): void {
  //   // this.loadProducts(); // Call method to load products on component initialization
  // }

  menuItems = MENU;
  selectedItem?: MenuItem;
  onselecItem(mItem: MenuItem): void {
    this.selectedItem = mItem;
  };


  // private loadProducts(): void {
  //   this.barkeyAPI.getlistproduct().subscribe(
  //     (data: product[]) => {
  //       this.products = data; // Assign fetched products to the products property
  //     },
  //     (error) => {
  //       console.error('Error loading products:', error);
  //       // Handle error as needed
  //     }
  //   );
  // }
}
