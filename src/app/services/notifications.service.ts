import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  private notifications$ = new Subject<Notification>();

  constructor() {

    this.notifications$.subscribe(notification => {

      if ( notification.type === NotificationType.Error )
        console.error(notification.message, ...notification.additionalMessages);
      else if ( notification.type === NotificationType.Warning )
        console.warn(notification.message, ...notification.additionalMessages);
      else
        console.log(notification.message, ...notification.additionalMessages);

    });

  }

  public subscribe(observer: (notification: Notification) => void) {

    return this.notifications$.subscribe(observer);

  }

  public debug(message: string, ...additionalMessages: any[]) {

    console.debug(message, ...additionalMessages);

  }

  public info(message: string, ...additionalMessages: any[]) {

    this.notifications$.next({ type: NotificationType.Info, message, additionalMessages });

  }

  public warning(message: string, ...additionalMessages: any[]) {

    this.notifications$.next({ type: NotificationType.Warning, message, additionalMessages });

  }

  public error(message: string, ...additionalMessages: any[]) {

    this.notifications$.next({ type: NotificationType.Error, message, additionalMessages });

  }

  public success(message: string, ...additionalMessages: any[]) {

    this.notifications$.next({ type: NotificationType.Success, message, additionalMessages });

  }

}

export interface Notification {
  type: NotificationType,
  message: string;
  additionalMessages?: any[];
}

export enum NotificationType {
  Info = 'info',
  Warning = 'warning',
  Error = 'error',
  Success = 'success'
}
