import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_URL } from '../config';
import { AuthService } from '../servicios/auth.service';

/**
 * Agrega "Authorization: Bearer <token>" a cada pedido hacia la API
 * (así ningún componente tiene que hacerlo a mano) y, si la API responde 401
 * en una ruta protegida, cierra la sesión y manda al login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (!req.url.startsWith(API_URL)) return next(req);

  const token = auth.getToken();
  const conToken = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(conToken).pipe(
    catchError((err: HttpErrorResponse) => {
      // 401 con token = sesión vencida. (El 401 del login no lleva token y no entra acá.)
      if (err.status === 401 && token) {
        auth.borrarSesion();
        router.navigate(['/inicio-sesion'], { queryParams: { vencida: 1 } });
      }
      return throwError(() => err);
    }),
  );
};
