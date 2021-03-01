import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService, ModalContent, AddContactModalData } from '@ash-player/service/app';
import { NotificationsService } from '@ash-player/service/notifications';
import { UserWithUID } from '@ash-player/model/database';
import { Subscription } from 'rxjs';
import { orderBy } from 'lodash';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  public contacts: UserWithUID[] = [];

  constructor(
    private app: AppService,
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {

    this.sub = this.app.getContacts().subscribe(contacts => {

      if ( ! contacts ) {

        this.contacts = [];
        return;

      }

      this.app.silent(Promise.all(
        Object.keys(contacts)
        .map(uid => this.app.silent(this.app.getUser(uid)))
      ))
      .then(users => this.contacts = orderBy(users.filter(user => !! user), 'name') || []);

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

    console.log('invite contact');

  }

  ngOnDestroy(): void {

    if ( this.sub && ! this.sub.closed ) this.sub.unsubscribe();

  }

}
