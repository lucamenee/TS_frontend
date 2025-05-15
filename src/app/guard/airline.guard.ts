import { CanActivateFn } from '@angular/router';
import { UserHttpService } from '../user-http.service';
import { inject } from '@angular/core';

export const airlineGuard: CanActivateFn = (route, state) => {
  let us = inject(UserHttpService);
  return us.is_logged() && us.is_airline();
};
