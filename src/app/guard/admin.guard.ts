import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

/** Bloquea rutas que requieren rol "admin". (La API vuelve a comprobarlo: esto es solo UX.) */
export const adminGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  auth.restaurarSesion();

  if (!auth.estaLogueado()) return router.createUrlTree(['/inicio-sesion']);
  if (!auth.esAdmin()) return router.createUrlTree(['/inicio']);
  return true;
};
