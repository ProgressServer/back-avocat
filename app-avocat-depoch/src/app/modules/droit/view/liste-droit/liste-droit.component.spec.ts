import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeDroitComponent } from './liste-droit.component';

describe('ListeDroitComponent', () => {
  let component: ListeDroitComponent;
  let fixture: ComponentFixture<ListeDroitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeDroitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeDroitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
