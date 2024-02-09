import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { storage } from '../components/login/login.component';

@Injectable({
  providedIn: 'root',
})
export class AuthServiceService {
  token = storage.getItem('token');
  userId = storage.getItem('userId');

  constructor(private http: HttpClient) {}

  signinUser(user: User) {
    const body = {
      login: user.login,
      password: user.password
    };
    return this.http.post(serviceLink + '/auth/signin', body);
  }

  signupUser(user: User) {
    const body = {
      name: user.name,
      login: user.login,
      password: user.password
    };

    return this.http.post(serviceLink + '/auth/signup', body);
  }

  getUserById() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.get(serviceLink + '/users/' + this.userId, { headers });
  }

  updateUser(user: User) {
    const body = {
      name: user.name,
      login: user.login,
      password: user.password
    };
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.put(serviceLink + '/users/' + this.userId, body, { headers })
  }
}

export class User{
  constructor(
    public login?:any,
    public password?: any,
    public name?:any,){}
}

export const serviceLink = "https://unruly-sack-production.up.railway.app"
