import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeSpecialityComponent } from './liste-speciality.component';

describe('ListeSpecialityComponent', () => {
  let component: ListeSpecialityComponent;
  let fixture: ComponentFixture<ListeSpecialityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeSpecialityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeSpecialityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
