import { Component, OnInit } from '@angular/core';
import { AppService } from '@ash-player/service/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private app: AppService
  ) { }

  ngOnInit(): void {
  }

}
