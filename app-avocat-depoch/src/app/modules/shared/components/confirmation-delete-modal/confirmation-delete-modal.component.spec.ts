import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDeleteModalComponent } from './confirmation-delete-modal.component';

describe('ConfirmationDeleteModalComponent', () => {
  let component: ConfirmationDeleteModalComponent;
  let fixture: ComponentFixture<ConfirmationDeleteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmationDeleteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmationDeleteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
