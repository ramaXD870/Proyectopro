import { Routes } from '@angular/router';
import { Inicio } from './paginas/inicio/inicio';
import { Contacto } from './paginas/contacto/contacto';
import { Ofertas } from './paginas/ofertas/ofertas';
import { Productos } from './paginas/productos/productos';
import { Compra } from './paginas/compra/compra';
import { Compras } from './paginas/compras/compras';
import { TicketPagina } from './paginas/ticket/ticket';
import { Admin } from './paginas/admin/admin';
import { Carrito } from './compartidos/carrito/carrito';
import { Favoritos } from './compartidos/favoritos/favoritos';
import { Registro } from './auth/registro/registro';
import { InicioSesion } from './auth/inicio-sesion/inicio-sesion';
import { authGuard } from './guard/auth.guard';
import { adminGuard } from './guard/admin.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },

  // Públicas
  { path: 'inicio', component: Inicio },
  { path: 'contacto', component: Contacto },
  { path: 'ofertas', component: Ofertas },
  { path: 'productos', component: Productos },
  { path: 'registro', component: Registro },
  { path: 'inicio-sesion', component: InicioSesion },

  // Requieren sesión
  { path: 'carrito', component: Carrito, canActivate: [authGuard] },
  { path: 'favoritos', component: Favoritos, canActivate: [authGuard] },
  { path: 'compra', component: Compra, canActivate: [authGuard] },
  { path: 'compras', component: Compras, canActivate: [authGuard] },
  { path: 'ticket/:id', component: TicketPagina, canActivate: [authGuard] },

  // Solo admin
  { path: 'admin', component: Admin, canActivate: [adminGuard] },

  { path: '**', redirectTo: 'inicio' },
];
