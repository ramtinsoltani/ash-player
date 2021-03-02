import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { AppService, ModalContent } from '@ash-player/service/app';
import { NotificationsService } from '@ash-player/service/notifications';
import { FirebaseService } from '@ash-player/service/firebase';
import { Invitation, User, SessionMemberStatus } from '@ash-player/model/database';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit, OnDestroy {

  @Input('show-options')
  public showOptions: boolean;

  @Input('show-leave')
  public showLeave: boolean;

  @Input('show-logout')
  public showLogout: boolean;

  @Output('onoptions')
  public onOptions = new EventEmitter<void>();

  @Output('onleave')
  public onLeave = new EventEmitter<void>();

  @Output('onlogout')
  public onLogout = new EventEmitter<void>();

  public invitations: Invitation[] = [];
  public currentUser: User;
  public status: SessionMemberStatus;

  private sessionSub: Subscription;
  private invitationsSub: Subscription;

  constructor(
    private app: AppService,
    private firebase: FirebaseService,
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {

    this.showOptions = this.showOptions !== undefined;
    this.showLogout = this.showLogout !== undefined;

    this.invitationsSub = this.app.getInvitations(invitations => {

      this.invitations = invitations;

    });

    this.currentUser = this.firebase.currentUser;

    this.sessionSub = this.app.onSessionChanges(() => {

      if ( this.app.isHost ) this.status = SessionMemberStatus.Ready;
      else this.status = this.app.sessionMemberStatus;

    });

  }

  ngOnDestroy(): void {

    if ( this.invitationsSub && ! this.invitationsSub.closed )
      this.invitationsSub.unsubscribe();

    if ( this.sessionSub && ! this.sessionSub.closed )
      this.sessionSub.unsubscribe();

  }

  onInvitations() {

    if ( this.app.currentSession ) {

      this.notifications.warning('Cannot open invitations when inside a session!');
      return;

    }

    const lastInvitation = this.invitations.pop();

    this.app.getUser(lastInvitation.from)
    .then(user => {

      this.app.openModal(ModalContent.NewInvitation, { from: user.name });
      this.app.onModalNextState()
      .then(state => {

        if ( state.canceled ) {

          return this.app.onResolveOnly(
            this.app.rejectInvitation(lastInvitation),
            () => this.notifications.info(`Invitation rejected`)
          );

        }
        else {

          return this.app.onResolveOnly(
            this.app.acceptInvitation(lastInvitation),
            () => this.notifications.info(`Joined ${user.name}`)
          );

        }

      });

    })
    .catch(() => this.notifications.error('Could not open invitation!'));

  }

}
