import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Compra } from '../../modelos/producto.model';
import { CompraService } from '../../servicios/compra.service';

/** Historial de compras del usuario. */
@Component({
  selector: 'app-compras',
  imports: [RouterLink, DatePipe],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class Compras {
  private compraService = inject(CompraService);

  compras = signal<Compra[]>([]);
  cargando = signal(true);
  error = signal('');

  constructor() {
    this.compraService.historial().subscribe({
      next: (l) => {
        this.compras.set(l);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No se pudo cargar el historial.');
        this.cargando.set(false);
      },
    });
  }

  // "2026-11-15 21:30:00" -> formato ISO que DatePipe entiende
  iso(fecha: string): string {
    return fecha.replace(' ', 'T');
  }
}
