import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-authorised',
  templateUrl: './not-authorised.component.html',
  styleUrls: ['./not-authorised.component.css']
})
export class NotAuthorisedComponent implements OnInit {

  constructor(private route: Router) { }

  ngOnInit(): void {
  }
  goBack(){
    this.route.navigate(['/']);
  }
}
