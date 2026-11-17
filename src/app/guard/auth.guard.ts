import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../servicios/auth.service';

/** Exige haber iniciado sesión (carrito, favoritos, compras, tickets). */
export const authGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  auth.restaurarSesion(); // la restauración normal ocurre después del primer render

  return auth.estaLogueado()
    ? true
    : router.createUrlTree(['/inicio-sesion'], { queryParams: { volver: state.url } });
};
