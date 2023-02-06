import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleSpecialityComponent } from './nouvelle-speciality.component';

describe('NouvelleSpecialityComponent', () => {
  let component: NouvelleSpecialityComponent;
  let fixture: ComponentFixture<NouvelleSpecialityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouvelleSpecialityComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelleSpecialityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
