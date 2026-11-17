import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CarritoService } from '../../servicios/carrito.service';
import { ItemCarrito } from '../../modelos/producto.model';
import { urlImagen } from '../../config';

@Component({
  selector: 'app-carrito',
  imports: [RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  protected carrito = inject(CarritoService);
  protected readonly urlImagen = urlImagen;

  cargando = signal(true);
  error = signal('');

  constructor() {
    this.carrito.cargar().subscribe({
      next: () => this.cargando.set(false),
      error: () => {
        this.error.set('No se pudo cargar el carrito.');
        this.cargando.set(false);
      },
    });
  }

  subtotal(i: ItemCarrito): number {
    return i.cantidad * i.precio_unitario;
  }

  sumar(i: ItemCarrito): void {
    this.cambiarCantidad(i, i.cantidad + 1);
  }

  restar(i: ItemCarrito): void {
    if (i.cantidad > 1) this.cambiarCantidad(i, i.cantidad - 1);
  }

  private cambiarCantidad(i: ItemCarrito, cantidad: number): void {
    this.carrito.actualizar(i.id_producto, cantidad).subscribe({ error: (e) => this.fallo(e) });
  }

  eliminar(i: ItemCarrito): void {
    this.carrito.eliminar(i.id_producto).subscribe({ error: (e) => this.fallo(e) });
  }

  vaciar(): void {
    if (!confirm('¿Vaciar todo el carrito?')) return;
    this.carrito.vaciar().subscribe({ error: (e) => this.fallo(e) });
  }

  private fallo(e: HttpErrorResponse): void {
    this.error.set(e.error?.error ?? 'No se pudo actualizar el carrito.');
  }
}
