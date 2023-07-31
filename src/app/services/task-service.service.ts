import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { storage } from '../components/login/login.component';
import { serviceLink } from './auth-service.service';

@Injectable({
  providedIn: 'root'
})
export class TaskServiceService {
  token = storage.getItem('token');
  userId = storage.getItem('userId') as string;

  constructor(private http: HttpClient) { }

  newTaskId: string = '';

  createTask(task: Task, boardId: string, columnId: string) {
    const body = {
      title: task.title,
      order: task.order,
      description: task.description,
      userId: task.userId,
      users: task.users
    };

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.post(serviceLink + ':3000/boards/' + boardId + '/columns/' + columnId + '/tasks', body, { headers });
  }

  removeTask(boardId: string, idColumn: string, taskId: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.delete(serviceLink + ':3000/boards/' + boardId + '/columns/' + idColumn + '/tasks/' + taskId, { headers });
  }

  updateTask(idColumn: string, boardId: string, taskId: string, newParams: NewParamsOfOneTask) {
    const body = newParams;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.put(serviceLink + ':3000/boards/' + boardId + '/columns/' + idColumn + '/tasks/' + taskId, body, { headers });
  }

  getTasksInThisColumn(boardId: string, columnId: string) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.get(serviceLink + ':3000/boards/' + boardId + '/columns/' + columnId + '/tasks', { headers })
  }

  updateSetOfTasks(arrayOfNewParams: NewParamsOfTasks[]) {
    const body = arrayOfNewParams;
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`,
    });
    return this.http.patch(serviceLink + ':3000/tasksSet', body, { headers });
  }
}

export class Task{
  constructor(
    public title: string,
    public order: number,
    public description: string,
    public userId: number,
    public users: string[]
  ){}
}

export class NewParamsOfTasks{
  constructor(
    public _id: string,
    public order: number,
    public columnId: string,
  ){}
}

export class NewParamsOfOneTask{
  constructor(
    public title: string,
    public order: number,
    public description: string,
    public columnId: string,
    public userId: number,
    public users: string[]
  ){}
}
