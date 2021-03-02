import { Component, HostListener } from '@angular/core';
import { AppService, ModalContent } from '@ash-player/service/app';
import { FirebaseService } from '@ash-player/service/firebase';
import { NotificationsService } from '@ash-player/service/notifications';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  private shortcutCount: number = 0;
  private lastShortcutTime: number;

  constructor(
    private app: AppService,
    private firebase: FirebaseService,
    private notifications: NotificationsService
  ) { }

  @HostListener('window:keydown.meta.backspace')
  @HostListener('window.keydown.ctrl.delete')
  onDeleteAccount() {

    if ( this.app.currentSession || this.app.joinedSessionId ) return;

    this.shortcutCount++;

    if ( this.lastShortcutTime && (Date.now() - this.lastShortcutTime) > 1000 )
      this.shortcutCount = 1;

    this.lastShortcutTime = Date.now();

    if ( this.shortcutCount < 3 ) return;

    this.shortcutCount = 0;

    if ( ! this.firebase.currentUser ) return;

    if ( ! this.app.openModal(ModalContent.DeleteAccount) ) return;

    this.app.onModalNextState()
    .then(async state => {

      if ( state.canceled ) return;

      await this.app.onResolveOnly(
        this.app.deleteUser(),
        () => this.notifications.info('User account was deleted')
      );

    });

  }

  @HostListener('window:beforeunload')
  async beforeWindowUnload() {

    await this.app.sessionCleanup();

  }

}
