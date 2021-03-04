import { Directive, Output, EventEmitter, HostListener, HostBinding } from '@angular/core';

@Directive({
  selector: '[dropzone]'
})
export class DropzoneDirective {

  @Output('dropzone')
  public onDropzone = new EventEmitter<string[]>();

  constructor() { }

  @HostBinding('class.dropzone-active')
  active: boolean = false;

  @HostListener('body:dragover', ['$event'])
  onBodyDragOver(event: DragEvent) {

    event.stopPropagation();
    event.preventDefault();

  }

  @HostListener('body:drop', ['$event'])
  onBodyDrop(event: DragEvent) {

    event.preventDefault();

  }

  @HostListener('dragover')
  onDragOver() {

    this.active = true;

  }

  @HostListener('dragleave')
  onDragLeave() {

    this.active = false;

  }

  @HostListener('drop', ['$event'])
  onDrop(event: DragEvent) {

    this.active = false;
    event.preventDefault();

    if ( ! event.dataTransfer.items || ! event.dataTransfer.items.length ) return;

    const filenames: string[] = [];

    for ( let i = 0; i < event.dataTransfer.items.length; i++ ) {

      const item = event.dataTransfer.items[i];

      if ( item.kind !== 'file' ) continue;

      filenames.push(item.getAsFile().path);

    }

    if ( filenames.length ) this.onDropzone.emit(filenames);

    event.dataTransfer.items.clear();

  }

}
