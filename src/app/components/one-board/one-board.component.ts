import { Component, Input, OnInit } from '@angular/core';
import { BoardsServiceService } from '../../services/boards-service.service';
import { MainRouteComponent } from '../../components/main-route/main-route.component';
import { storage } from '../login/login.component';
import { checkTokenAndRedirect } from '../../functions/check-token';

@Component({
  selector: 'app-one-board',
  templateUrl: './one-board.component.html',
  styleUrls: ['./one-board.component.css']
})

export class OneBoardComponent implements OnInit{
  @Input() data!: any;

  constructor(
    private service: BoardsServiceService,
    private mainRoute: MainRouteComponent,
  ) {}

  title!: string;
  isModalVisible: boolean = false;

  error: any;
  errMessage: any = "";
  statusCode: any = "";

  thisBoardId: string = "";

  ngOnInit() {
    this.title = "My New Board";
    if (this.data) {
      this.title = this.data.title
    }
  }

  openModal(): void {
    checkTokenAndRedirect();
    this.isModalVisible = true;
    storage.setItem('typeOfRemovedElement', 'board');
  }

  closeModal(): void {
    this.isModalVisible = false;
  }

  getIdThisBoard(event: Event) {
    checkTokenAndRedirect();
    event.stopPropagation();
    this.thisBoardId = this.service.newBoardId;
    if (this.thisBoardId === '') {
      this.thisBoardId = (event.currentTarget as Element).closest('app-one-board')?.id as string;
      storage.setItem('boardId', this.thisBoardId)
    } else {
      this.thisBoardId = this.thisBoardId;
      storage.setItem('boardId', this.thisBoardId)
    }
  }

  removeThisBoard() {
    this.service.removeBoard(this.thisBoardId).subscribe(
      () => {
        this.closeModal();
        this.mainRoute.ngOnInit();
      },
      error => {
        this.errMessage = error.error.message;
        this.statusCode = error.error.statusCode;
      }
    );
  }
}
