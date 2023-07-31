import { Component, OnDestroy, OnInit  } from '@angular/core';
import { checkTokenAndRedirect } from './functions/check-token';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy{
  private tokenCheckInterval: any;

  ngOnInit() {
    this.tokenCheckInterval = setInterval(() => {
      checkTokenAndRedirect();
    }, 300000);
  }

  ngOnDestroy() {
    clearInterval(this.tokenCheckInterval);
  }
}
