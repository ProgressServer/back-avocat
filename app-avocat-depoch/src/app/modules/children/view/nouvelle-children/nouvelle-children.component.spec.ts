import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleChildrenComponent } from './nouvelle-children.component';

describe('NouvelleChildrenComponent', () => {
  let component: NouvelleChildrenComponent;
  let fixture: ComponentFixture<NouvelleChildrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouvelleChildrenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelleChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
