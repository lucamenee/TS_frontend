import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { airlineGuard } from './airline.guard';

describe('airlineGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => airlineGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
