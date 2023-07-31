import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxTranslateModule } from './components/translate/translate.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { HeaderComponent } from './components/header/header.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
import { LoginComponent } from './components/login/login.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SelectLanguageComponent } from './components/select-language/select-language.component';
import { MainRouteComponent } from './components/main-route/main-route.component';
import { BoardRouteComponent } from './components/board-route/board-route.component';
import { OneBoardComponent } from './components/one-board/one-board.component';
import { OneColumnComponent } from './components/one-column/one-column.component';
import { ModalComponent } from './components/modal/modal.component';
import { OneTaskComponent } from './components/one-task/one-task.component';

import { AuthServiceService } from './services/auth-service.service';
import { BoardsServiceService } from './services/boards-service.service';
import { ColumnsServiceService } from './services/columns-service.service';
import { TaskServiceService } from './services/task-service.service';
import { ModalTaskFormComponent } from './components/modal-task-form/modal-task-form.component';

@NgModule({
  declarations: [
    AppComponent,
    WelcomePageComponent,
    LoginComponent,
    SignUpComponent,
    SelectLanguageComponent,
    MainRouteComponent,
    BoardRouteComponent,
    OneBoardComponent,
    HeaderComponent,
    OneColumnComponent,
    ModalComponent,
    OneTaskComponent,
    ModalTaskFormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    NgxTranslateModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    DragDropModule
  ],
  providers: [
    AuthServiceService,
    BoardsServiceService,
    ColumnsServiceService,
    TaskServiceService,
    MainRouteComponent,
    BoardRouteComponent,
    SignUpComponent,
    OneBoardComponent,
    OneColumnComponent,
    OneTaskComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
