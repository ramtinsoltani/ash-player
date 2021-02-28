import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationsService, Notification } from '@ash-player/service/notifications';
import { Subscription } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 }))
      ]),
      transition('* => void', [
        animate(200, style({ opacity: 0 }))
      ])
    ])
  ]
})
export class NotificationsComponent implements OnInit, OnDestroy {

  private sub: Subscription;
  public currentNotifications: Notification[] = [];

  constructor(
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {

    this.sub = this.notifications.subscribe(notification => {

      this.currentNotifications.push(notification);

      setTimeout(() => {

        const index = this.currentNotifications.indexOf(notification);

        if ( index > -1 ) this.currentNotifications.splice(index, 1);

      }, 5000);

    });

  }

  ngOnDestroy(): void {

    if ( this.sub && ! this.sub.closed ) this.sub.unsubscribe();

  }

}
