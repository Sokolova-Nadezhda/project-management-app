import { Component, ViewChild, ViewContainerRef, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BoardsServiceService, Board } from '../../services/boards-service.service';
import { storage } from '../../components/login/login.component';
import { checkTokenAndRedirect } from '../../functions/check-token';

@Component({
  selector: 'app-main-route',
  templateUrl: './main-route.component.html',
  styleUrls: ['./main-route.component.css']
})

export class MainRouteComponent implements OnInit {

  constructor(
    private service: BoardsServiceService
  ) {}

  items: any[] = [];

  @ViewChild('boardsContainer', { read: ViewContainerRef })
  boardsContainer!: ViewContainerRef;

  error: any;
  errMessage: any = "";
  statusCode: any = "";

  userId = storage.getItem('userId')!;
  newBoardId: string = '';

  boardNameForm: FormGroup = new FormGroup({
    boardName: new FormControl('', [
      Validators.required,
    ]),
  });

  ngOnInit() {
    checkTokenAndRedirect();
    this.service.getBoards().subscribe(
      data => {
        this.items = data as any[];
      },
      error => {
        this.errMessage = error.error.message;
        this.statusCode = error.error.statusCode;
      }
    );
  }

  createOneBoardComponent() {
    const board: Board = new Board(
      this.boardNameForm.value.boardName,
      this.userId,
      [this.userId]
    );

    this.service.createBoard(board).subscribe(
      (data: any) => {
        this.items.push(data);
      },
      (error) => {
        this.errMessage = error.error.message
        this.statusCode = error.error.statusCode;
        checkTokenAndRedirect();
      }
    );
  }
}
