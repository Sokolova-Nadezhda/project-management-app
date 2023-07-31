import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { storage } from '../components/login/login.component';
import { serviceLink } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class ColumnsServiceService {
  token = storage.getItem('token');
  userId = storage.getItem('userId') as string;

  constructor(private http: HttpClient) { }

  newColumnId: string = '';

  createColumn(column: Column, boardId: string) {
    const body = {
      title: column.title,
      order: column.order
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.post(serviceLink + ':3000/boards/' + boardId + '/columns', body, { headers });
  }

  removeColumn(idColumn: string, boardId: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.delete(serviceLink + ':3000/boards/' + boardId + '/columns/' + idColumn, { headers });
  }

  updateColumn(idColumn: string, boardId: string, newParams: NewTitleForColumn) {
    const body = newParams;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.put(serviceLink + ':3000/boards/' + boardId + '/columns/' + idColumn, body, { headers });
  }

  getColumnsByUserId() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.get(serviceLink + ':3000/columnsSet?userId=' + this.userId, { headers });
  }

  updateSetOfColumns(arrayOfNewParams: NewOrdersOfColumns[]) {
    const body = arrayOfNewParams;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.patch(serviceLink + ':3000/columnsSet', body, { headers });
  }
}

export class Column{
  constructor(
    public title?: string,
    public order?: number,
  ){}
}

export interface NewOrdersOfColumns {
  _id: string,
  order: number
}

export interface NewTitleForColumn {
  title: string,
  order: number
}
