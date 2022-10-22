import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AllServiceService } from '../services/all-service.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  password: string = '';
  username: string = '';
  hide: boolean = true;
  isValidPassword: boolean = false;
  isValidUsername: boolean = false;
  constructor(
    private allservice: AllServiceService,
    private snackBar: MatSnackBar,
    private route: Router
  ) {}

  ngOnInit(): void {
  }
  validateUsername(): boolean {

    var validRegex = /^\d{4,5}$/;
    if (this.username.match(validRegex) && this.username.length <= 5) {
      this.isValidUsername = true;
      return true;
    }
    this.isValidUsername = false;
    return false;
  }
  login() {
    let returnValue;
    if (this.isValidUsername && this.isValidPassword) {
      this.allservice.login(parseInt(this.username), this.password).subscribe(
        (res) => {
          returnValue = res.body ? res.body : '';
          if (res.status == 200) {
            this.showSnackBar('Login successful', 'sucess');
            this.allservice.isLoggedIn = true;
            this.allservice.saveTokenToLocalstorage(
              returnValue,
              this.username,
              this.password
            );
            this.allservice.fetchUserDetails(
              JSON.parse(JSON.stringify(returnValue))['access_token']
            );
            if (localStorage.getItem('TranscriptRole') === 'tpc') {
              this.route.navigate(['/admin-tpc']);
            }
            if (localStorage.getItem('TranscriptRole') === 'tpo') {
              this.route.navigate(['/admin-tpo']);
            }
            if (localStorage.getItem('TranscriptRole') === 'admin') {
              this.route.navigate(['/admin']);
            }
            if (localStorage.getItem('TranscriptRole') === 'student') {
              this.route.navigate(['/dashboard', this.username]);
            }
          }
        },
        (err: Error) => {
          console.log(err);
        }
      );
    }
  }
  cancelLogin() {}
  validatePassword() {
    if (this.password.length > 0) {
      this.isValidPassword = true;
      return true;
    }
    this.isValidPassword = false;
    return false;
  }
  showSnackBar(message: string, type: string) {
    if (type == 'success') {
      this.snackBar.open(message, 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 2000,
        panelClass: ['green-snackbar'],
      });
    } else {
      this.snackBar.open(message, 'Close', {
        horizontalPosition: 'right',
        verticalPosition: 'top',
        duration: 4000,
      });
    }
  }
}
