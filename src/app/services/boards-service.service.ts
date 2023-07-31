import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { storage } from '../components/login/login.component';
import { serviceLink } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class BoardsServiceService {
  token = storage.getItem('token');
  userId = storage.getItem('userId');

  newBoardId: string = '';

  constructor(private http: HttpClient) {}

  createBoard(board: Board) {
    const body = {
      title: board.title,
      owner: board.owner,
      users: board.users
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });

    return this.http.post(serviceLink + ':3000/boards', body, { headers });
  }

  removeBoard(idBoard: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.delete(serviceLink + ':3000/boards/' + idBoard, { headers });
  }

  getBoards() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.get(serviceLink + ':3000/boardsSet/' + this.userId, { headers });
  }

  getBoardById(idBoard: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.get(serviceLink + ':3000/boards/' + idBoard, { headers });
  }
}

export class Board{
  constructor(
    public title?: string,
    public owner?: string,
    public users?: [string]
  ){}
}
