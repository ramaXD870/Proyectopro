import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

import { routes } from './app.routes';
import { authInterceptor } from './interceptores/auth.interceptor';
import { AuditErrorHandler } from './servicios/audit.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    // withFetch: HttpClient usa fetch (recomendado con SSR)
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    // Los errores no capturados también quedan registrados en la auditoría
    { provide: ErrorHandler, useClass: AuditErrorHandler },
  ],
};
