import { Component, OnInit, Input } from '@angular/core';
// import { remote } from 'electron';
import { NotificationsService } from '@ash-player/service/notifications';
import { AppService } from '@ash-player/service/app';
// import renderer from 'webgl-video-renderer';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit {

  @Input('source')
  public source: string;

  // private renderContext: any;
  // private player = remote.require('webchimera.js').createPlayer();

  constructor(
    private app: AppService,
    private notifications: NotificationsService
  ) { }

  ngOnInit(): void {

    if ( ! this.source ) return this.notifications.error('Source path is not set!');

    // this.renderContext = renderer.setupCanvas('canvas');
    //
    // this.player.onFrameReady = frame => {
    //
    //   this.renderContext.render(frame, frame.width, frame.height, frame.uOffset, frame.vOffset);
    //
    // };
    //
    // this.player.onLogMessage = (level, message) => {
    //
    //   console.log(message);
    //
    // };
    //
    // this.player.play(this.source);

  }

}
