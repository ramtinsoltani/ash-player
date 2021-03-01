import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import { UserWithUID, SessionMemberStatus } from '@ash-player/model/database';

@Component({
  selector: 'app-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  @Input('user')
  public user: UserWithUID&{ status?: SessionMemberStatus };

  @Input('add-button')
  public addButton: boolean;

  @Input('invitations-count')
  public invitationsCount: number;

  @Input('current-user')
  public currentUser: boolean;

  @Input('session-member')
  public sessionMember: boolean;

  @Output('ondelete')
  public onDelete = new EventEmitter<void>();

  @Output('onselect')
  public onSelect = new EventEmitter<void>();

  @Output('oninvitations')
  public onInvitations = new EventEmitter<void>();

  @Output('onban')
  public onBan = new EventEmitter<void>();

  public gravatar: string;
  public gravatarLoaded: boolean = false;

  constructor() { }

  ngOnInit(): void {

    this.addButton = this.addButton !== undefined;
    this.currentUser = this.currentUser !== undefined;
    this.sessionMember = this.sessionMember !== undefined;

    if ( this.user ) {

      this.gravatar = `https://gravatar.com/avatar/${Md5.hashStr(this.user.email, false)}?s=54&d=404`;

    }

  }

  onGravatarLoaded() {

    this.gravatarLoaded = true;

  }

  hasPersonBeenRecentlyOnline() {

    return Date.now() - this.user.lastTimeOnline < 5000;

  }

  onPersonDelete(event: MouseEvent) {

    event.stopImmediatePropagation();

    this.onDelete.emit();

  }

}
