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
    this.role = localStorage.getItem('TranscriptRole');
    if (localStorage.getItem('TranscriptLoggedIn')) {
      this.isLoggedIn = true;
    }
  }
  goToHomePage():void{
    if(this.role=='student'){
      this.route.navigate(['/dashboard',localStorage.getItem('TranscriptUsername')]);
    }
  }
  goToApplicationPage(){
    this.route.navigate(['/transcriptRegistration']);
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
