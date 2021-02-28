import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-controls',
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss']
})
export class ControlsComponent implements OnInit {

  @Input('show-options')
  public showOptions: boolean;

  @Input('show-leave')
  public showLeave: boolean;

  @Input('show-logout')
  public showLogout: boolean;

  @Output('onoptions')
  public onOptions = new EventEmitter<void>();

  @Output('onleave')
  public onLeave = new EventEmitter<void>();

  @Output('onlogout')
  public onLogout = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {

    this.showOptions = this.showOptions !== undefined;
    this.showLeave = this.showLeave !== undefined;
    this.showLogout = this.showLogout !== undefined;

  }

}
