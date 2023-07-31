import { Component, Input, Output, EventEmitter } from '@angular/core';
import { OneBoardComponent } from '../../components/one-board/one-board.component';
import { OneColumnComponent } from '../../components/one-column/one-column.component';
import { OneTaskComponent } from '../../components/one-task/one-task.component';
import { storage } from '../../components/login/login.component';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {
  @Input() isVisible: boolean = false;
  @Output() close = new EventEmitter<void>();

  constructor(
    private oneBoard: OneBoardComponent,
    private oneColumn: OneColumnComponent,
    private oneTask: OneTaskComponent
  ) {}

  closeModal(): void {
    this.isVisible = false;
    this.close.emit();
  }

  removeElement(event: Event) {
    const type = storage.getItem('typeOfRemovedElement');
    switch (type) {
      case 'board': this.oneBoard.removeThisBoard();
        break;
      case 'column': this.oneColumn.removeThisColumn();
        break;
      case 'task': this.oneTask.removeThisTask();
        break;
      default: break;
    }
  }
}
