import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AppService } from '@ash-player/service/app';
import { NotificationsService } from '@ash-player/service/notifications';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  public cursorLeft: number = 0;
  public cursorWidth: number = 87;
  public selectedTab: string = 'login';
  public resetPassword: boolean = false;
  public loading: boolean = false;

  constructor(
    private app: AppService,
    private notifications: NotificationsService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  public updateCursor(event: MouseEvent, tabName: string) {

    if ( tabName === this.selectedTab ) return;

    this.resetPassword = false;

    this.cursorLeft = (<HTMLDivElement>event.target).offsetLeft;
    this.cursorWidth = (<HTMLDivElement>event.target).offsetWidth;
    this.selectedTab = tabName;

  }

  public onLogin(form: NgForm) {

    if ( form.invalid ) return;

    this.loading = true;

    this.app.login(form.value.email, form.value.password)
    .then(() => this.router.navigate(['/home']))
    .catch()
    .finally(() => {

      form.reset();
      this.loading = false;

    });

  }

  public onResetPasswordShow() {

    this.resetPassword = true;

  }

  public onResetPasswordCancel() {

    this.resetPassword = false;

  }

  public onResetPassword(form: NgForm) {

    if ( form.invalid ) return;

    this.loading = true;

    this.app.resetPassword(form.value.email)
    .then(() => {

      this.notifications.info('Password reset email sent');
      this.resetPassword = false;

    })
    .catch()
    .finally(() => {

      form.reset();
      this.loading = false;

    });

  }

  public onRegister(form: NgForm) {

    if ( form.invalid ) return;

    this.loading = true;

    this.app.registerUser(form.value.email, form.value.password, form.value.displayName)
    .then(() => this.router.navigate(['/home']))
    .catch()
    .finally(() => {

      form.reset();
      this.loading = false;

    });

  }

}
