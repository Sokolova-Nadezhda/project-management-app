import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OneTaskComponent } from '../one-task/one-task.component';
import { OneColumnComponent } from '../../components/one-column/one-column.component';
import { TaskServiceService, NewParamsOfOneTask } from '../../services/task-service.service';
import { storage } from '../../components/login/login.component';
import { checkTokenAndRedirect } from '../../functions/check-token';

@Component({
  selector: 'app-modal-task-form',
  templateUrl: './modal-task-form.component.html',
  styleUrls: ['./modal-task-form.component.css']
})
export class ModalTaskFormComponent{
  @Input() isNewParamsOfTaskFormVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private oneTask: OneTaskComponent,
    private oneColumn: OneColumnComponent,
    private taskService: TaskServiceService
  ){}

  newParamsForm = this.oneTask.newParamsForm;

  thisBoardId = storage.getItem('boardId') as string;
  userId = storage.getItem('userId') as string;

  error: any;
  errMessage: any = "";
  statusCode: any = "";

  updateThisTask() {
    const thisColumnId = storage.getItem('columnId') as string;
    const thisTaskId = storage.getItem('taskId') as string;
    if (this.newParamsForm.valid) {
      let thisTaskOrder: number = 0;
      let newParams;
      for (let task of this.oneColumn.tasks) {
        if (task._id === thisTaskId) {
          task.title = this.newParamsForm.value.newTaskName;
          task.description = this.newParamsForm.value.newTaskDescription;
          thisTaskOrder = task.order;
        }
      }
      newParams = new NewParamsOfOneTask(
        this.newParamsForm.value.newTaskName,
        thisTaskOrder,
        this.newParamsForm.value.newTaskDescription,
        thisColumnId,
        0,
        [this.userId]
      )
      this.taskService.updateTask(thisColumnId, this.thisBoardId, thisTaskId, newParams).subscribe(
        () => {
          (document.getElementById(`${thisTaskId}`) as HTMLElement).getElementsByClassName('one-task-title')[0].innerHTML = this.newParamsForm.value.newTaskName;
          (document.getElementById(`${thisTaskId}`) as HTMLElement).getElementsByClassName('one-task-desc')[0].innerHTML = this.newParamsForm.value.newTaskDescription;
        },
        (error: any) => {
          checkTokenAndRedirect();
          this.errMessage = error.error.message;
          this.statusCode = error.error.statusCode;
        }
      )
    }
  }

  makeVisibleOrInvisibleTaskForm(event: Event) {
    // event.stopPropagation();
    checkTokenAndRedirect();
    const target = event.target as HTMLElement
    if (this.isNewParamsOfTaskFormVisible) {
      if (target === (event.currentTarget as HTMLElement)) {
        this.isNewParamsOfTaskFormVisible = false;
        this.close.emit();
      }
    } else {
      this.isNewParamsOfTaskFormVisible = true;
    }
  }
}
