import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = '';
  isMbarkey = true; // Giá trị này sẽ được xác định khi người dùng đăng nhập

  constructor(private router: Router) {}

  ngOnInit() {
    if (this.isMbarkey) {
      this.router.navigate(['/ql']);
    } else {
      this.router.navigate(['/page']);
    }
  }
}
