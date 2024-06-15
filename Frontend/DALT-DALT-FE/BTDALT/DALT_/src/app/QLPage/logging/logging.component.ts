import { Component } from '@angular/core';
import { BarkeyApiService } from 'src/app/Until/barkey-api.service';
import { DTOuser } from '../mockdata-PQL/menu-item';

@Component({
  selector: 'app-logging',
  templateUrl: './logging.component.html',
  styleUrls: ['./logging.component.scss']
})
export class LoggingComponent {
  username: string = '';
  password: string = '';
  statusMessage: string = '';
  responseMessage: string = '';
  userLoggedIn: boolean = false;

  constructor(private apiService: BarkeyApiService) {}

  onSubmit(): void {
    this.apiService.login(this.username, this.password).subscribe({
      next: response => {
        this.statusMessage = response.status;
        this.responseMessage = response.message;
        this.userLoggedIn = true;
        console.log('Login successful', response);
      },
      error: error => {
        this.statusMessage = 'Login failed';
        console.error('Login failed', error);
      }
    });
  }
}
