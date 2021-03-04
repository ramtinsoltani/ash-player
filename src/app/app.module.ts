import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {  BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { LeftPaneComponent } from './components/left-pane/left-pane.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { ControlsComponent } from './components/controls/controls.component';
import { SourceSelectComponent } from './components/source-select/source-select.component';
import { NotificationsComponent } from './components/notifications/notifications.component';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { ModalComponent } from './components/modal/modal.component';
import { EastereggComponent } from './components/easteregg/easteregg.component';
import { HomeComponent } from './components/home/home.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PersonComponent } from './components/person/person.component';
import { DropzoneDirective } from './directives/dropzone.directive';

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LeftPaneComponent,
    ContactsComponent,
    ControlsComponent,
    SourceSelectComponent,
    NotificationsComponent,
    VideoPlayerComponent,
    ModalComponent,
    EastereggComponent,
    HomeComponent,
    LoaderComponent,
    PersonComponent,
    DropzoneDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
