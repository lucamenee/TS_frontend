import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { passsengerGuard } from './passsenger.guard';

describe('passsengerGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => passsengerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
