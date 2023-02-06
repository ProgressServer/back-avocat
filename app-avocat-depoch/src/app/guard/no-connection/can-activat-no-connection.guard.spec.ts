import { TestBed } from '@angular/core/testing';

import { CanActivatNoConnectionGuard } from './can-activat-no-connection.guard';

describe('CanActivatNoConnectionGuard', () => {
  let guard: CanActivatNoConnectionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivatNoConnectionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
