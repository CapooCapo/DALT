import { Component } from '@angular/core';
import { BarkeyApiService } from 'src/app/Until/barkey-api.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  phoneNumber: string = '';
  email: string = '';
  statusMessage: string = '';

  constructor(private apiService: BarkeyApiService) {}

  onRegister(): void {
    this.apiService.register(this.username, this.password, this.phoneNumber, this.email).subscribe({
      next: response => {
        this.statusMessage = 'Registration successful';
        console.log('Registration successful', response);
      },
      error: error => {
        this.statusMessage = 'Registration failed';
        console.error('Registration failed', error);
      }
    });
  }
}
