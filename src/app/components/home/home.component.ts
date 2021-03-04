import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '@ash-player/service/app';
import { NotificationsService } from '@ash-player/service/notifications';
import { SessionMemberStatus } from '@ash-player/model/database';
import { extname } from 'path';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public source: string;
  public joined: boolean = false;
  public host: boolean = false;
  public memberStatus: SessionMemberStatus;

  private sub: Subscription;

  constructor(
    private app: AppService,
    private notifications: NotificationsService
  ) { }

  private updateSession() {

    if ( this.app.joinedSessionId )
      this.app.silent(this.app.updateSessionTargetLength([1, 50, 100][Math.floor(Math.random() * 3)]));
    else
      this.app.silent(this.app.createSession(100));

  }

  private isExtensionSupported(filename: string) {

    return ['.mkv', '.mp4', '.avi', '.mov', '.flv', '.3gp'].includes(extname(filename).toLowerCase());

  }

  ngOnInit(): void {

    this.app.onSessionChanges(() => {

      this.memberStatus = this.app.sessionMemberStatus;
      this.joined = !! this.app.joinedSessionId;
      this.host = this.app.isHost;

    });

  }

  onSourceSelected(filepath: string) {

    if ( ! this.isExtensionSupported(filepath) ) {

      this.notifications.warning(`File is not supported!`);
      return;

    }

    this.source = filepath;
    this.updateSession();

  }

  onFileDrop(filepaths: string[]) {

    if ( filepaths.length !== 1 ) {

      this.notifications.warning(`Only one file at a time can be dropped!`);
      return;

    }

    if ( ! this.isExtensionSupported(filepaths[0]) ) {

      this.notifications.warning(`File is not supported!`);
      return;

    }

    this.source = filepaths[0];
    this.updateSession();

  }

  ngOnDestroy(): void {

    if ( this.sub && ! this.sub.closed )
      this.sub.unsubscribe();

  }

}
