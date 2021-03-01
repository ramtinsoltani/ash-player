import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '@ash-player/service/app';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.scss']
})
export class LeftPaneComponent implements OnInit, OnDestroy {

  public showLeave: boolean = false;
  private sub: Subscription;

  constructor(
    private app: AppService
  ) { }

  ngOnInit(): void {

    this.sub = this.app.onSessionChanges(session => {

      this.showLeave = !! session;

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
