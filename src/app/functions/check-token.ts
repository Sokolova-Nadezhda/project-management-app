import { storage } from '../components/login/login.component';

export function checkTokenAndRedirect() {
  let tokenExpiration = new Date(Number(storage.getItem('tokenExpiration')));
  let token = storage.getItem('token');
  
  if (token) {
    if (new Date() > tokenExpiration) {
      storage.removeItem('token');
      token = '';
      window.location = '/' as (string | Location) & Location;
    }
  } else {
    window.location = '/' as (string | Location) & Location;
  }
}
