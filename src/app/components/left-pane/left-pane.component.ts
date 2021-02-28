import { Component, OnInit } from '@angular/core';
import { AppService } from '@ash-player/service/app';

@Component({
  selector: 'app-left-pane',
  templateUrl: './left-pane.component.html',
  styleUrls: ['./left-pane.component.scss']
})
export class LeftPaneComponent implements OnInit {

  constructor(
    private app: AppService
  ) { }

  ngOnInit(): void {
  }

  onLogout() {

    this.app.silent(this.app.logout());

  }

}
