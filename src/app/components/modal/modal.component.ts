import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { trigger, transition, style, animate, query, animateChild, group } from '@angular/animations';
import { AppService, ModalState, ModalContent } from '@ash-player/service/app';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        group([
          animate(200, style({ opacity: 1 })),
          query('@expand', animateChild())
        ])
      ]),
      transition('* => void', [
        group([
          query('@expand', animateChild()),
          animate(200, style({ opacity: 0 }))
        ])
      ])
    ]),
    trigger('expand', [
      transition('void => *', [
        style({ transform: 'scale(0)' }),
        animate(200, style({ transform: 'scale(1)' }))
      ]),
      transition('* => void', [
        animate(200, style({ transform: 'scale(0)' }))
      ])
    ])
  ]
})
export class ModalComponent implements OnInit {

  public state: ModalState = { closed: true, canceled: false, content: ModalContent.NoContent };
  public modalContent = ModalContent;

  constructor(
    private app: AppService
  ) { }

  ngOnInit(): void {

    this.app.onModalStateChanged(state => this.state = state);

  }

  onCancel() {

    this.app.cancelModal();

  }

  onConfirm() {

    this.app.closeModal();

  }

  onAddContact(form: NgForm) {

    if ( form.invalid ) return;

    this.app.closeModal({ email: form.value.email });

  }

}
