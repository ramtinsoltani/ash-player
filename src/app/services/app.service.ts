import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '@ash-player/service/backend';
import { FirebaseService } from '@ash-player/service/firebase';
import { NotificationsService } from '@ash-player/service/notifications';
import { Invitation, Session } from '@ash-player/model/database';
import { catchError } from 'rxjs/operators';
import { throwError, Subject, BehaviorSubject, Subscription } from 'rxjs';
import { cloneDeep } from 'lodash-es';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  private _modalState$ = new Subject<ModalState>();
  private _isModalOpened: boolean = false;
  private _currentSession: Session = null;
  private _joinedSessionId: string;
  private _invitationsSub: Subscription;
  private _invitations$ = new BehaviorSubject<Invitation[]>([]);
  private _isHost: boolean;
  private _sessionChanges$ = new BehaviorSubject<Session>(null);
  private _statusTimer: NodeJS.Timeout;

  constructor(
    private firebase: FirebaseService,
    private backend: BackendService,
    private notifications: NotificationsService,
    private router: Router
  ) {

    this.firebase.onFullAuthStateChanged(async user => {

      if ( ! user ) {

        this.router.navigate(['/auth']);
        this._invitations$.next([]);
        this._currentSession = null;
        this._joinedSessionId = null;
        this._isHost = false;
        clearInterval(this._statusTimer);

        if ( this._invitationsSub && ! this._invitationsSub.closed )
          this._invitationsSub.unsubscribe();

      }
      else {

        this.router.navigate(['/home']);
        this._invitationsSub = this._getInvitations().subscribe(invitations => {

          this._invitations$.next(cloneDeep(invitations));

        });

        this._statusTimer = setInterval(async () => await this.silent(this.backend.updateUserStatus(await this.firebase.getToken())), 3000);

      }

    });

  }

  private _notifyOnError<T>(promise: Promise<T>): Promise<T> {

    return new Promise<T>((resolve, reject) => {

      promise
      .then(resolve)
      .catch((error: Error) => {

        this.notifications.error(error.message, error);
        reject(error);

      });

    });

  }

  private _getInvitations() {

    return this.firebase.getInvitations()
    .pipe(catchError(error => {

      this.notifications.error(error.message, error);
      return throwError(error);

    }));

  }

  /**
  * Handles the promise silently and returns a promise that will always resolve with either the resolved value or undefined.
  * @param promise A promise to handle.
  */
  public silent<T>(promise: Promise<T>) {

    return new Promise<T>(resolve => {

      promise
      .then(resolve)
      .catch(() => resolve(undefined));

    });

  }

  /**
  * Handles the promise silently and returns a promise that will always resolve with either the resolved value or undefined.
  * It will also call the provided callback function only when the original promise is resolved.
  * @param promise A promise to handle.
  * @param cb A callback function.
  */
  public onResolveOnly<T>(promise: Promise<T>, cb: (value: T) => void) {

    return new Promise<T>(resolve => {

      promise
      .then(value => {

        cb(value);
        resolve(value);

      })
      .catch(() => resolve(undefined));

    });

  }

  public get currentSession() { return cloneDeep(this._currentSession); }

  public get isHost() { return this._isHost; }

  public get joinedSessionId() { return this._joinedSessionId; }

  public async registerUser(email: string, password: string, name: string) {

    await this._notifyOnError(this.firebase.registerUser(email, password));
    await this._notifyOnError(this.backend.registerUser(await this.firebase.getToken(), name));
    await this._notifyOnError(this.firebase.updateCurrentUser());

  }

  public async deleteUser() {

    const token = await this.firebase.getToken();

    await this._notifyOnError(this.backend.deleteUser(token));
    await this.silent(this.firebase.refreshUser());

  }

  public async resetPassword(email: string) {

    await this._notifyOnError(this.firebase.resetPassword(email));

  }

  public async login(email: string, password: string) {

    await this._notifyOnError(this.firebase.login(email, password));

  }

  public async logout() {

    await this._notifyOnError(this.firebase.logout());

  }

  public getContacts() {

    return this.firebase.getContacts()
    .pipe(catchError(error => {

      this.notifications.error(error.message, error);
      return throwError(error);

    }));

  }

  public getUserChanges(uid: string) {

    return this.firebase.getUserChanges(uid)
    .pipe(catchError(error => {

      this.notifications.error(error.message, error);
      return throwError(error);

    }));

  }

  public async addContact(email: string) {

    return this._notifyOnError(this.backend.addContact(await this.firebase.getToken(), email));

  }

  public async deleteContact(uid: string) {

    return this._notifyOnError(this.backend.deleteContact(await this.firebase.getToken(), uid));

  }

  public async inviteUser(uid: string, session: string) {

    return this._notifyOnError(this.backend.inviteUser(await this.firebase.getToken(), uid, session));

  }

  public async createSession(targetLength: number) {

    if ( this._currentSession ) throw new Error(`Session is already in progress!`);

    const res = await this._notifyOnError(this.backend.createSession(await this.firebase.getToken(), targetLength));

    this._currentSession = await this._notifyOnError(this.firebase.getSession(res.id));
    this._isHost = true;
    this._sessionChanges$.next(this.currentSession);

    return res;

  }

  public getUser(uid: string) {

    return this._notifyOnError(this.firebase.getUser(uid));

  }

  public async rejectInvitation(invitation: Invitation) {

    return this._notifyOnError(this.backend.rejectUserInvite(await this.firebase.getToken(), invitation.id));

  }

  public async acceptInvitation(invitation: Invitation) {

    const res =  await this._notifyOnError(this.backend.acceptUserInvite(await this.firebase.getToken(), invitation.id));

    this._joinedSessionId = invitation.session;

    return res;

  }

  public getInvitations(observer: (invitations: Invitation[]) => void) {

    return this._invitations$.subscribe(observer);

  }

  public onSessionChanges(observer: (session: Session) => void) {

    return this._sessionChanges$.subscribe(observer);

  }

  public onModalStateChanged(observer: (state: ModalState) => void) {

    return this._modalState$.subscribe(observer);

  }

  public onModalNextState<T=any>(): Promise<ModalState<T>> {

    return new Promise<ModalState<T>>(resolve => {

      const sub = this._modalState$.subscribe(state => {

        sub.unsubscribe();
        resolve(<any>state);

      });

    });

  }

  public openModal(content: ModalContent, data?: any): boolean {

    if ( this._isModalOpened ) return false;

    this._modalState$.next({ content, closed: false, canceled: false, data });
    this._isModalOpened = true;

    return true;

  }

  public closeModal(data?: any): boolean {

    if ( ! this._isModalOpened ) return false;

    this._modalState$.next({ content: ModalContent.NoContent, closed: true, canceled: false, data });
    this._isModalOpened = false;

    return true;

  }

  public cancelModal(): boolean {

    if ( ! this._isModalOpened ) return false;

    this._modalState$.next({ content: ModalContent.NoContent, closed: true, canceled: true });
    this._isModalOpened = false;

    return true;

  }

  public async cleanup() {

    

  }

}

export interface ModalState<T=any> {

  content: ModalContent;
  closed: boolean;
  canceled: boolean;
  data?: T;

}

export interface AddContactModalData {

  email: string;

}

export enum ModalContent {

  NoContent = 'no-content',
  InviteContact = 'invite-contact',
  AddContact = 'add-contact',
  RemoveContact = 'remove-contact',
  NewInvitation = 'new-invitation',
  VideoSubtitles = 'vide-subtitles',
  RemoveSessionMember = 'remove-session-member',
  DeleteAccount = 'delete-account'

}
