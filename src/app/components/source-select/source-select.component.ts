import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ipcRenderer } from 'electron';
import { NotificationsService } from '@ash-player/service/notifications';
import { ShowOpenDialogResult } from '@ash-player/model/electron';

@Component({
  selector: 'app-source-select',
  templateUrl: './source-select.component.html',
  styleUrls: ['./source-select.component.scss']
})
export class SourceSelectComponent implements OnInit {

  @Output('onsource')
  public onSource = new EventEmitter<string>();

  constructor(
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void { }

  onVideoSelect() {

    ipcRenderer.invoke('showOpenDialog')
    .then((result: ShowOpenDialogResult) => {

      if ( ! result.canceled && result.filePaths.length )
        this.onSource.emit(result.filePaths[0]);

    })
    .catch(error => this.notifications.error(error.message, error));

  }

}
