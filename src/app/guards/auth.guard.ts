import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/** Bloquea el acceso a las vistas internas si la app expiró (10/07/2026) o no hay sesión; redirige a bienvenida. */
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  if (auth.appBloqueada()) {
    router.navigate(['/bienvenida']);
    return false;
  }
  if (auth.isLoggedIn()) return true;
  router.navigate(['/bienvenida']);
  return false;
};
