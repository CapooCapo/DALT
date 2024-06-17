import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BarkeyApiService } from 'src/app/Until/barkey-api.service';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  private barkeyApi: BarkeyApiService;

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  private fetchProducts(page: number) {
    this.barkeyApi.GetListProduct(page).subscribe(
      (data) => {
        // Optionally handle successful API response data here
      },
      (error) => {
        console.error('Error fetching products:', error);
      }
    );
  }
  onPageChange(page: number) {
    this.currentPage = page;
    this.fetchProducts(this.currentPage);
  }

}
