import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { CarritoService } from '../../servicios/carrito.service';
import { FavoritoService } from '../../servicios/favorito.service';

@Component({
  selector: 'app-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected auth = inject(AuthService);
  protected carrito = inject(CarritoService);
  private favoritos = inject(FavoritoService);
  private router = inject(Router);

  /** El buscador lleva al catálogo con el texto como filtro (?buscar=...). */
  buscar(texto: string): void {
    this.router.navigate(['/productos'], { queryParams: { buscar: texto.trim() || null } });
  }

  salir(): void {
    this.carrito.limpiarLocal();
    this.favoritos.limpiarLocal();
    this.auth.logout();
  }
}
