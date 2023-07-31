import { Component, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BoardsServiceService } from '../../services/boards-service.service';
import { ColumnsServiceService, Column, NewOrdersOfColumns } from '../../services/columns-service.service';
import { storage } from '../login/login.component';
import { checkTokenAndRedirect } from '../../functions/check-token';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-board-route',
  templateUrl: './board-route.component.html',
  styleUrls: ['./board-route.component.css'],
})
export class BoardRouteComponent implements OnInit{

  constructor(
    private boardService: BoardsServiceService,
    private columnService: ColumnsServiceService,
  ) {}

  items: any[] = [];

  @ViewChild('columnsContainer', { read: ViewContainerRef })
  columnsContainer!: ViewContainerRef;

  isModalVisible = false;

  token = storage.getItem('token');
  thisBoardId = storage.getItem('boardId') as string;
  thisBoardTitle: string = "";
  board: any;

  error: any;
  errMessage: any = "";
  statusCode: any = "";

  columnOrder: number = 0;
  newOrdersOfColumns: NewOrdersOfColumns[] = [];

  columnNameForm: FormGroup = new FormGroup({
    columnName: new FormControl('', [
      Validators.required,
    ]),
    columnOrder: new FormControl('', [
      Validators.required,
    ]),
  });

  ngOnInit() {
    checkTokenAndRedirect();
    if (this.token) {
      this.board = this.boardService.getBoardById(this.thisBoardId).subscribe(
        (data: any) => {
          this.thisBoardTitle = data.title;
        },
        error => {
          this.errMessage = error.error.message;
          this.statusCode = error.error.statusCode;
        }
      );
    }
    this.columnService.getColumnsByUserId().subscribe(
      (data: any) => {
        data.sort((a: any, b: any) => a.order - b.order);
        data.forEach((item: any) => {
          if (item.boardId == this.thisBoardId) {
            this.items.push(item);
          }
        });
      },
      (error) => {
        this.errMessage = error.error.message;
        this.statusCode = error.error.statusCode;
      }
    );
  }

  createOneColumnComponent() {
    const column: Column = new Column(
      this.columnNameForm.value.columnName,
      this.columnNameForm.value.columnOrder,
    );
    this.columnService.createColumn(column, this.thisBoardId).subscribe(
      (data: any) => {
        this.items.push(data);
        this.items.sort((a: any, b: any) => a.order - b.order);
      },
      (error) => {
        checkTokenAndRedirect();
        this.errMessage = error.error.message
        this.statusCode = error.error.statusCode;
      }
    );
  }

  drop(event: CdkDragDrop<any[]>) {
    checkTokenAndRedirect();
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);

    for (let index = 0; index < this.items.length; index++) {
      const newOrderData: NewOrdersOfColumns = {
        _id: this.items[index]._id,
        order: index
      }
      this.newOrdersOfColumns.push(newOrderData);
    }
    this.columnService.updateSetOfColumns(this.newOrdersOfColumns).subscribe(
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
