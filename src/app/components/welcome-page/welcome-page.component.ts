import { Component, OnInit } from '@angular/core';
import { storage } from '../../components/login/login.component';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.css']
})
export class WelcomePageComponent implements OnInit{

  ngOnInit(): void {
    const currentDate = new Date();
    const tokenExpiration = new Date(Number(storage.getItem('tokenExpiration')));
    const token = storage.getItem('token');
    if (token) {
      if (currentDate < tokenExpiration) {
        window.location = '/main-route' as (string | Location) & Location;
      }
    }
  }
}
