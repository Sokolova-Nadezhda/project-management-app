import { Component, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ColumnsServiceService, NewTitleForColumn } from '../../services/columns-service.service';
import { TaskServiceService, Task, NewParamsOfTasks } from '../../services/task-service.service';
import { BoardRouteComponent } from '../../components/board-route/board-route.component';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { storage } from '../login/login.component';
import { checkTokenAndRedirect } from '../../functions/check-token';
import { CdkDragDrop, moveItemInArray, transferArrayItem,} from '@angular/cdk/drag-drop';


@Component({
  selector: 'app-one-column',
  templateUrl: './one-column.component.html',
  styleUrls: ['./one-column.component.css']
})
export class OneColumnComponent implements OnInit{
  @Input() data!: any;

  constructor(
    private serviceColumn: ColumnsServiceService,
    private taskService: TaskServiceService,
    private boardRoute: BoardRouteComponent
  ) {}

  @Input() tasks: any[] = [];

  @ViewChild('tasksContainer', { read: ViewContainerRef })
  tasksContainer!: ViewContainerRef;

  title!: string;

  error: any;
  errMessage: any = "";
  statusCode: any = "";

  thisColumnId: string = "";
  thisBoardId = storage.getItem('boardId') as string;
  userId = storage.getItem('userId') as string;

  isModalVisible: boolean = false;
  isNewColumnNameFormVisible: boolean = false;
  isFormForNewTaskVisible: boolean = false;
  isNewParamsOfTaskFormVisible: boolean = false;

  taskOrder: number = 0;
  NewParamsOfTasks: NewParamsOfTasks[] = []

  newColumnNameForm: FormGroup = new FormGroup({
    newColumnName: new FormControl('', [
      Validators.required,
    ])
  });

  createTaskForm: FormGroup = new FormGroup({
    taskName: new FormControl('', [
      Validators.required,
    ]),
    taskOrder: new FormControl('', [
      Validators.required,
    ]),
    taskDescription: new FormControl('', [
      Validators.required,
    ]),
  });

  ngOnInit() {
    this.title = "My New Column";
    if (this.data) {
      this.title = this.data.title
    }

    this.taskService.getTasksInThisColumn(this.thisBoardId, this.data._id).subscribe(
      (data: any) => {
        data.sort((a: any, b: any) => a.order - b.order);
        this.tasks = data as any[];
      },
      (error) => {
        checkTokenAndRedirect();
        this.errMessage = error.error.message;
        this.statusCode = error.error.statusCode;
      }
    );
  }

  openModal(event: Event): void {
    event.stopPropagation();
    checkTokenAndRedirect();
    this.isModalVisible = true;
    storage.setItem('typeOfRemovedElement', 'column');
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  makeVisibleOrInvisibleTaskForm(event: Event) {
    // event.stopPropagation();
    checkTokenAndRedirect();
    const target = event.target as HTMLElement
    // if (this.isNewParamsOfTaskFormVisible) {
      if (target.closest('.btn-link')) {
        this.isNewParamsOfTaskFormVisible = false;
      // }
    } else {
      this.isNewParamsOfTaskFormVisible = true;
    }
  }

  makeVisibleOrInvisibleTitle(event: Event) {
    event.stopPropagation();
    checkTokenAndRedirect();
    const target = event.target as HTMLElement
    if (this.isNewColumnNameFormVisible) {
      if (target === (event.currentTarget as HTMLElement)) {
        this.isNewColumnNameFormVisible = false;
      }
    } else {
      this.isNewColumnNameFormVisible = true;
    }
  }

  getIdThisColumn(event: Event) {
    checkTokenAndRedirect();
    this.thisColumnId = this.serviceColumn.newColumnId;
    if (this.thisColumnId === '') {
      this.thisColumnId = (event.currentTarget as Element).closest('app-one-column')?.id as string;
      storage.setItem('columnId', this.thisColumnId)
    } else {
      this.thisColumnId = this.thisColumnId;
      storage.setItem('columnId', this.thisColumnId)
    }
  }

  updateThisColumn() {
    if (this.newColumnNameForm.valid) {
      let thisColumnOrder: number = 0;
      let newParams: NewTitleForColumn;

      for (let item of this.boardRoute.items) {
        if (item._id === this.thisColumnId) {
          thisColumnOrder = item.order;
        }
      }
      newParams = {
        title: this.newColumnNameForm.value.newColumnName,
        order: thisColumnOrder
      }
      this.serviceColumn.updateColumn(this.thisColumnId, this.thisBoardId, newParams).subscribe(
        () => {
          (document.getElementById(`${this.thisColumnId}`) as HTMLElement).getElementsByTagName('h4')[0].innerHTML = this.newColumnNameForm.value.newColumnName;
        },
        (error: any) => {
          checkTokenAndRedirect();
          this.errMessage = error.error.message;
          this.statusCode = error.error.statusCode;
        }
      )
    }
  }

  removeThisColumn() {
    this.serviceColumn.removeColumn(this.thisColumnId, this.thisBoardId).subscribe(
      () => {
        this.closeModal();
        const arr = this.boardRoute.items;
        const arrLength = arr.length;
        for (let i = 0; i < arrLength; i++) {
          if (arr[i]._id == this.thisColumnId) {
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

  createOneTaskComponent() {
    const task: Task = new Task(
      this.createTaskForm.value.taskName,
      this.createTaskForm.value.taskOrder,
      this.createTaskForm.value.taskDescription,
      0,
      [this.userId]
    );
    this.taskService.createTask(task, this.thisBoardId, this.thisColumnId).subscribe(
      (data: any) => {
        this.tasks.push(data);
        this.tasks.sort((a: any, b: any) => a.order - b.order);
      },
      (error) => {
        checkTokenAndRedirect();
        this.errMessage = error.error.message
        this.statusCode = error.error.statusCode;
      }
    );
  }

  drop(event: CdkDragDrop<any[]>) {

    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex,
      );
    }
    const newColumnId = event.container.element.nativeElement.closest('app-one-column')?.id as string;
    for (let index = 0; index < this.tasks.length; index++) {
      this.tasks[index].order = index;
      const newParamsData: NewParamsOfTasks = {
        _id: this.tasks[index]._id,
        order: index,
        columnId: newColumnId
      }
      this.NewParamsOfTasks.push(newParamsData);
    }
    this.taskService.updateSetOfTasks(this.NewParamsOfTasks).subscribe(
      () => {

      },
      (error) => {
        checkTokenAndRedirect();
        this.errMessage = error.error.message
        this.statusCode = error.error.statusCode;
      }
    );
  }
}
