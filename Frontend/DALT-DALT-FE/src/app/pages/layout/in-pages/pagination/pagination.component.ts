import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {
  @Input() currentPage: number = 1; // Initialize currentPage with a default value of 1
  @Input() totalPages: number = 10; // Initialize totalPages with a default value of 0
  @Output() pageChange = new EventEmitter<number>(); // Event emitter for page change


  onPageChange(pageNumber: number): void {
    this.pageChange.emit(pageNumber); // Emit sự kiện khi chuyển trang
  }

  isFirstPage(): boolean {
    return this.currentPage === 1; // Kiểm tra xem có phải trang đầu tiên không
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages; // Kiểm tra xem có phải trang cuối cùng không
  }

  goToPreviousPage(): void {
    if (!this.isFirstPage()) {
      this.onPageChange(this.currentPage - 1); // Đi tới trang trước đó nếu không phải trang đầu tiên
    }
  }

  goToNextPage(): void {
    if (!this.isLastPage()) {
      this.onPageChange(this.currentPage + 1); // Đi tới trang kế tiếp nếu không phải trang cuối cùng
    }
  }
}
