import {Component, Input, OnChanges, OnInit, Output, EventEmitter, SimpleChanges} from '@angular/core';

@Component({
  selector: 'app-confirmation-delete-modal',
  templateUrl: './confirmation-delete-modal.component.html',
  styleUrls: ['./confirmation-delete-modal.component.css']
})
export class ConfirmationDeleteModalComponent implements OnInit, OnChanges {

  @Input() textConfirm!: string;
  @Output() deleteFunction = new EventEmitter<String>();

  public loader = false;

  callDelete(): void {
    this.deleteFunction.emit('complete');
  }

  userTextInput: string = '';
  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
  }

  public closeBtn(): void {
    const btn = document.getElementById('btnConfirmCloseModal');
    if (btn) {
      btn.click();
    }
  }

  public openBtn(): void {
    const btn = document.getElementById('btnConfirmOpenModal');
    if (btn) {
      btn.click();
    }
  }

  initTextUser(): void {
    this.userTextInput = '';
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes.textConfirm) {
  //     const sc = changes.textConfirm;
  //     this.textConfirm = sc.currentValue;
  //   }
  // }

}
