import { TestBed } from '@angular/core/testing';

import { CanActivatAdminGuard } from './can-activat-admin.guard';

describe('CanActivatAdminGuard', () => {
  let guard: CanActivatAdminGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivatAdminGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
