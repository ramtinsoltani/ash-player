import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService, ModalContent, AddContactModalData } from '@ash-player/service/app';
import { NotificationsService } from '@ash-player/service/notifications';
import { UserWithUID, Session, SessionMemberStatus } from '@ash-player/model/database';
import { Subscription } from 'rxjs';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  private contactsSub: Subscription;
  private contactsChangesSub: Subscription[] = [];
  private sessionSub: Subscription;
  public contacts: UserWithUID[] = [];
  public session: Session;
  public members: (UserWithUID&{ status: SessionMemberStatus })[] = [];

  constructor(
    private app: AppService,
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {

    this.contactsSub = this.app.getContacts().subscribe(contacts => {

      for ( const sub of this.contactsChangesSub ) {

        if ( ! sub.closed ) sub.unsubscribe();

      }

      if ( ! contacts ) {

        this.contacts = [];
        return;

      }

      this.contacts = this.contacts.filter(contact => Object.keys(contacts).includes(contact.uid));

      for ( const uid in contacts ) {

        this.contactsChangesSub.push(this.app.getUserChanges(uid).subscribe(user => {

          const index = this.contacts.indexOf(this.contacts.find(contact => contact.uid === user.uid));

          if ( index > -1 ) this.contacts[index] = user;
          else this.contacts = orderBy([...this.contacts, user].filter(user => !! user), 'name');

        }));

      }

    });
    this.sessionSub = this.app.onSessionChanges(session => {

      this.session = session;
      this.members = this.contacts
      .filter(user => Object.keys(this.session.members).includes(user.uid))
      .map(member => ({ ...member, status: this.session.members[member.uid].status }));

    });

  }

  onAddContact() {

    this.app.openModal(ModalContent.AddContact);
    this.app.onModalNextState<AddContactModalData>()
    .then(async state => {

      if ( state.canceled ) return;

      await this.app.onResolveOnly(
        this.app.addContact(state.data.email),
        () => this.notifications.info('Contact was added')
      );

    });

  }

  onDeleteContact(contact: UserWithUID) {

    this.app.openModal(ModalContent.RemoveContact, { name: contact.name });
    this.app.onModalNextState()
    .then(async state => {

      if ( state.canceled ) return;

      await this.app.onResolveOnly(
        this.app.deleteContact(contact.uid),
        () => this.notifications.info('Contact was removed')
      );

    });

  }

  onInviteContact(contact: UserWithUID) {

    this.app.openModal(ModalContent.InviteContact, { name: contact.name });
    this.app.onModalNextState()
    .then(async state => {

      if ( state.canceled ) return;

      const response = await this.app.createSession(100);
      await this.app.onResolveOnly(
        this.app.inviteUser(contact.uid, response.id),
        () => this.notifications.info(`${contact.name} joined`)
      );

    });

  }

  onBan(member: UserWithUID) {

    console.log('Banning member', member.name);

  }

  ngOnDestroy(): void {

    if ( this.contactsSub && ! this.contactsSub.closed ) this.contactsSub.unsubscribe();
    if ( this.sessionSub && ! this.sessionSub.closed ) this.sessionSub.unsubscribe();

  }

}
