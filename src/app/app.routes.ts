import { Routes } from '@angular/router';
import { Inicio } from './pagina/inicio/inicio';
import { Contacto } from './pagina/contacto/contacto';
import { Ofertas } from './pagina/ofertas/ofertas';
import { Carrito } from './compartidos/carrito/carrito';
import { FavotirosComponent } from './compartidos/favotiros/favotiros';
import { Producto } from './pagina/producto/producto';
import { Registro } from './auth/registro/registro';
import { InicioS } from './auth/inicio-s/inicio-s';

export const routes: Routes = [
    { path: '', redirectTo: 'inicio', pathMatch: 'full' },

{ path: 'inicio', component: Inicio },
{ path: 'contacto', component: Contacto},
{ path: 'ofertas', component: Ofertas },
{ path: 'carrito', component: Carrito},
{ path: 'favotiros', component: FavotirosComponent},
{ path: 'productos', component: Producto },
{ path: 'registro', component: Registro },
{ path: 'inicioS', component: InicioS },

{ path: '**', redirectTo: 'inicio' },


];
