import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {faLinkedin, faInstagram, faFacebook, faTwitter, faGooglePlus} from '@fortawesome/free-brands-svg-icons';
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  isLoggedIn:boolean = false;
  linkedin = faLinkedin;
  instagram = faInstagram;
  facebook = faFacebook;
  twitter = faTwitter;
  google = faGooglePlus;
  rollno:string|null="";
  constructor(private route: Router) { }

  ngOnInit(): void {
  }

}
