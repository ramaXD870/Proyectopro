import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { CarritoService } from '../../servicios/carrito.service';
import { CompraService } from '../../servicios/compra.service';
import { TicketService } from '../../servicios/ticket.service';
import { urlImagen } from '../../config';

/** Finalizar compra: datos de envío + resumen del carrito. */
@Component({
  selector: 'app-compra',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './compra.html',
  styleUrl: './compra.css',
})
export class Compra {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private compraService = inject(CompraService);
  private ticketService = inject(TicketService);
  protected carrito = inject(CarritoService);
  protected readonly urlImagen = urlImagen;

  cargando = signal(true);
  procesando = signal(false);
  error = signal('');

  // Los datos de envío se validan acá; la base de datos de la consigna no tiene campos para guardarlos.
  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    direccion: ['', [Validators.required, Validators.maxLength(150)]],
    ciudad: ['', [Validators.required, Validators.maxLength(80)]],
    telefono: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{6,20}$/)]],
  });

  constructor() {
    this.carrito.cargar().subscribe({
      next: () => this.cargando.set(false),
      error: () => {
        this.error.set('No se pudo cargar el carrito.');
        this.cargando.set(false);
      },
    });
  }

  confirmar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    if (this.carrito.items().length === 0) {
      this.error.set('El carrito está vacío.');
      return;
    }

    this.procesando.set(true);
    this.error.set('');

    this.compraService.finalizar().subscribe({
      next: ({ id_compra }) => {
        // Se genera el ticket PDF; si fallara, igual se muestra la compra y se puede reintentar.
        this.ticketService.generar(id_compra).subscribe({
          next: () => this.router.navigate(['/ticket', id_compra]),
          error: () => this.router.navigate(['/ticket', id_compra]),
        });
      },
      error: (e: HttpErrorResponse) => {
        this.procesando.set(false);
        this.error.set(e.error?.error ?? 'No se pudo finalizar la compra.');
      },
    });
  }
}
