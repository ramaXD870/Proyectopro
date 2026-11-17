import { RenderMode, ServerRoute } from '@angular/ssr';

// Solo las páginas estáticas se prerenderizan. El resto depende de la API y del
// token del usuario (localStorage), así que se renderiza en el navegador.
export const serverRoutes: ServerRoute[] = [
  { path: 'inicio', renderMode: RenderMode.Prerender },
  { path: 'contacto', renderMode: RenderMode.Prerender },
  { path: '**', renderMode: RenderMode.Client },
];
