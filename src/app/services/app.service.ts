import { Injectable } from '@angular/core';
import { BackendService } from '@ash-player/service/backend';
import { FirebaseService } from '@ash-player/service/firebase';
import { NotificationsService } from '@ash-player/service/notifications';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private firebase: FirebaseService,
    private backend: BackendService,
    private notifications: NotificationsService
  ) { }

  private notifyOnError<T>(promise: Promise<T>): Promise<T> {

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

  public async registerUser(email: string, password: string, name: string) {

    await this.notifyOnError(this.firebase.registerUser(email, password));
    return await this.notifyOnError(this.backend.registerUser(await this.firebase.getToken(), name));

  }

  public async deleteUser() {

    const token = await this.firebase.getToken();

    await this.notifyOnError(this.backend.deleteUser(token));
    await this.silent(this.firebase.refreshUser());

  }

  public async resetPassword(email: string) {

    await this.notifyOnError(this.firebase.resetPassword(email));

  }

  public async login(email: string, password: string) {

    await this.notifyOnError(this.firebase.login(email, password));

  }

  public async logout() {

    await this.notifyOnError(this.firebase.logout());

  }

  public getContacts() {

    return this.firebase.getContacts()
    .pipe(catchError(error => {

      this.notifications.error(error.message, error);
      return throwError(error);

    }))

  }

  public getUser(uid: string) {

    return this.notifyOnError(this.firebase.getUser(uid));

  }

}
