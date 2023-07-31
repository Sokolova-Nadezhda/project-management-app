import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TaskServiceService } from '../../services/task-service.service';
import { OneColumnComponent } from '../../components/one-column/one-column.component';
import { checkTokenAndRedirect } from '../../functions/check-token';
import { storage } from '../login/login.component';

@Component({
  selector: 'app-one-task',
  templateUrl: './one-task.component.html',
  styleUrls: ['./one-task.component.css']
})
export class OneTaskComponent implements OnInit{
  @Input() data!: any;

  constructor(
    private taskService: TaskServiceService,
    private oneColumn: OneColumnComponent
  ) {}

  title!: string;
  description!: string;

  thisTaskId: string = "";
  userId = storage.getItem('userId') as string;
  thisBoardId = storage.getItem('boardId') as string;
  thisColumnId = storage.getItem('columnId') as string;

  isModalVisible: boolean = false;
  isNewParamsOfTaskFormVisible: boolean = false;

  error: any;
  errMessage: any = "";
  statusCode: any = "";

  newParamsForm: FormGroup = new FormGroup({
    newTaskName: new FormControl('', [
      Validators.required,
    ]),
    newTaskDescription: new FormControl('', [
      Validators.required,
    ]),
  });

  ngOnInit() {
    if (this.data) {
      this.title = this.data.title;
      this.description = this.data.description;
    }
  }

  openModal(event: Event): void {
    event.stopPropagation();
    checkTokenAndRedirect();
    this.isModalVisible = true;
    storage.setItem('typeOfRemovedElement', 'task');
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  getIdThisTask(event: Event) {
    checkTokenAndRedirect();
    this.thisTaskId = this.taskService.newTaskId;
    if (this.thisTaskId === '') {
      this.thisTaskId = (event.currentTarget as Element).closest('app-one-task')?.id as string;
      storage.setItem('taskId', this.thisTaskId)
    } else {
      this.thisTaskId = this.thisTaskId;
      storage.setItem('taskId', this.thisTaskId)
    }
  }

  removeThisTask() {
    this.taskService.removeTask(this.thisBoardId, this.thisColumnId, this.thisTaskId).subscribe(
      () => {
        this.closeModal();
        const arr = this.oneColumn.tasks;
        const arrLength = arr.length;
        for (let i = 0; i < arrLength; i++) {
          if (arr[i]._id == this.thisTaskId) {
            arr.splice(i, 1)
          }
        }
      },
      (error: any) => {
        this.errMessage = error.error.message;
        this.statusCode = error.error.statusCode;
      }
    );
  }
}
