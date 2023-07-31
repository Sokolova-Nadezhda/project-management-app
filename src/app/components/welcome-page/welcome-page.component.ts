import { Component, OnInit } from '@angular/core';
import { storage } from '../../components/login/login.component';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit{
  currentDate = new Date();
  tokenExpiration = new Date(Number(storage.getItem('tokenExpiration')));
  token = storage.getItem('token');

  ngOnInit(): void {
    if (this.token) {
      if (this.currentDate < this.tokenExpiration) {
        window.location = '/main-route' as (string | Location) & Location;
      }
    }
  }
}
