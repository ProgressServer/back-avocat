import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NouvelleDroitComponent } from './nouvelle-droit.component';

describe('NouvelleDroitComponent', () => {
  let component: NouvelleDroitComponent;
  let fixture: ComponentFixture<NouvelleDroitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NouvelleDroitComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NouvelleDroitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
