import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from '@ash-player/service/backend';
import { FirebaseService } from '@ash-player/service/firebase';
import { NotificationsService } from '@ash-player/service/notifications';
import { catchError } from 'rxjs/operators';
import { throwError, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private firebase: FirebaseService,
    private backend: BackendService,
    private notifications: NotificationsService,
    private router: Router
  ) { }

  private _modalState$ = new Subject<ModalState>();
  private _isModalOpened: boolean = false;

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

  public async registerUser(email: string, password: string, name: string) {

    await this._notifyOnError(this.firebase.registerUser(email, password));
    await this._notifyOnError(this.backend.registerUser(await this.firebase.getToken(), name));
    await this._notifyOnError(this.firebase.updateCurrentUser());
    await this.router.navigate(['/home']);

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

    }))

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

    return this._notifyOnError(this.backend.createSession(await this.firebase.getToken(), targetLength));

  }

  public getUser(uid: string) {

    return this._notifyOnError(this.firebase.getUser(uid));

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

  public openModal(content: ModalContent, data?: any) {

    if ( this._isModalOpened ) return;

    this._modalState$.next({ content, closed: false, canceled: false, data });
    this._isModalOpened = true;

  }

  public closeModal(data?: any) {

    if ( ! this._isModalOpened ) return;

    this._modalState$.next({ content: ModalContent.NoContent, closed: true, canceled: false, data });
    this._isModalOpened = false;

  }

  public cancelModal() {

    if ( ! this._isModalOpened ) return;

    this._modalState$.next({ content: ModalContent.NoContent, closed: true, canceled: true });
    this._isModalOpened = false;

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
