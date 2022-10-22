import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn:boolean = false;
  role: string|null = '';
  constructor(private route: Router) { }

  ngOnInit(): void {
    this.role = localStorage.getItem('Role');
    if (localStorage.getItem('LoggedIn')) {
      this.isLoggedIn = true;
    }
  }

  goToRegistrationPage() {
    this.route.navigate(['/register']);
  }
  goToLoginPage() {
    this.route.navigate(['/login']);
  }
  logOut() {
    localStorage.clear();
    this.goToLoginPage();
  }
  clickedLogo(){
    this.route.navigate(['/']);
  }
}
