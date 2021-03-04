import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '@ash-player/service/app';
import { SessionMemberStatus } from '@ash-player/model/database';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.scss']
})
export class LeftPaneComponent implements OnInit, OnDestroy {

  public showLeave: boolean = false;
  public showLogout: boolean = true;
  public status: SessionMemberStatus;

  private sub: Subscription;

  constructor(
    private app: AppService
  ) { }

  ngOnInit(): void {

    this.sub = this.app.onSessionChanges(() => {

      if ( this.app.isHost ) this.status = SessionMemberStatus.Ready;
      else this.status = this.app.sessionMemberStatus;

      this.showLeave = !! this.status;
      this.showLogout = ! this.status;

    });

  }

  onLogout() {

    this.app.silent(this.app.logout());

  }

  onLeave() {

    // Leave the session

  }

  ngOnDestroy(): void {

    if ( this.sub && ! this.sub.closed ) this.sub.unsubscribe();

  }

}
