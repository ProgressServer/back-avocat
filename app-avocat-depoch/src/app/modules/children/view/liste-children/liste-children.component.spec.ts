import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListeChildrenComponent } from './liste-children.component';

describe('ListeChildrenComponent', () => {
  let component: ListeChildrenComponent;
  let fixture: ComponentFixture<ListeChildrenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListeChildrenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListeChildrenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
