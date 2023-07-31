import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { MainRouteComponent } from './components/main-route/main-route.component';
import { BoardRouteComponent } from './components/board-route/board-route.component';


const routes: Routes = [
  {path: '', component:WelcomePageComponent},
  {path: 'login', component:LoginComponent},
  {path: 'sign-up', component:SignUpComponent},
  {path: 'main-route', component:MainRouteComponent},
  {path: 'board-route', component:BoardRouteComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
