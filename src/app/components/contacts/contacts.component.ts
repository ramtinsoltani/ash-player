import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '@ash-player/service/app';
import { User } from '@ash-player/model/database';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss']
})
export class ContactsComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  public contacts: User[] = [];

  constructor(
    private app: AppService
  ) { }

  ngOnInit(): void {

    this.sub = this.app.getContacts().subscribe(contacts => {

      if ( ! contacts ) {

        this.contacts = [];
        return;

      }

      this.app.silent(Promise.all(
        Object.keys(contacts)
        .map(uid => this.app.getUser(uid))
      ))
      .then(users => this.contacts = users || []);

    });

  }

  ngOnDestroy(): void {

    if ( this.sub && ! this.sub.closed ) this.sub.unsubscribe();

  }

}
