import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { FavoritoService } from '../../servicios/favorito.service';
import { CarritoService } from '../../servicios/carrito.service';
import { Favorito } from '../../modelos/producto.model';
import { urlImagen } from '../../config';

@Component({
  selector: 'app-favoritos',
  imports: [RouterLink],
  templateUrl: './favoritos.html',
  styleUrl: './favoritos.css',
})
export class Favoritos {
  protected favoritos = inject(FavoritoService);
  private carrito = inject(CarritoService);
  protected readonly urlImagen = urlImagen;

  cargando = signal(true);
  mensaje = signal('');

  constructor() {
    this.favoritos.cargar().subscribe({
      next: () => this.cargando.set(false),
      error: () => {
        this.mensaje.set('No se pudieron cargar los favoritos.');
        this.cargando.set(false);
      },
    });
  }

  quitar(f: Favorito): void {
    this.favoritos.quitar(f.id_producto).subscribe({ error: (e) => this.fallo(e) });
  }

  agregarAlCarrito(f: Favorito): void {
    this.carrito.agregar(f.id_producto, 1).subscribe({
      next: () => this.mensaje.set(`${f.nombre} agregado al carrito 🛒`),
      error: (e) => this.fallo(e),
    });
  }

  private fallo(e: HttpErrorResponse): void {
    this.mensaje.set(e.error?.error ?? 'Ocurrió un error.');
  }
}
