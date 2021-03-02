import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '@ash-player/service/app';
import { SessionMemberStatus } from '@ash-player/model/database';
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
    private app: AppService
  ) { }

  ngOnInit(): void {

    this.app.onSessionChanges(() => {

      this.memberStatus = this.app.sessionMemberStatus;
      this.joined = !! this.app.joinedSessionId;
      this.host = this.app.isHost;

    });

  }

  onSourceSelected(filepath: string) {

    this.source = filepath;
console.log(this.app.joinedSessionId);
    if ( this.app.joinedSessionId )
      this.app.silent(this.app.updateSessionTargetLength([1, 50, 100][Math.floor(Math.random() * 3)]));
    else
      this.app.silent(this.app.createSession(100));

  }

  ngOnDestroy(): void {

    if ( this.sub && ! this.sub.closed )
      this.sub.unsubscribe();

  }

}
