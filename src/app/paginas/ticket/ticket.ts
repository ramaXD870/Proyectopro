import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Compra, Ticket } from '../../modelos/producto.model';
import { CompraService } from '../../servicios/compra.service';
import { TicketService } from '../../servicios/ticket.service';

/** Vista del ticket de una compra: detalle + descarga del PDF. */
@Component({
  selector: 'app-ticket',
  imports: [RouterLink, DatePipe],
  templateUrl: './ticket.html',
  styleUrl: './ticket.css',
})
export class TicketPagina {
  private ruta = inject(ActivatedRoute);
  private compraService = inject(CompraService);
  private ticketService = inject(TicketService);

  idCompra = Number(this.ruta.snapshot.paramMap.get('id'));
  compra = signal<Compra | null>(null);
  ticket = signal<Ticket | null>(null);
  cargando = signal(true);
  generando = signal(false);
  error = signal('');

  constructor() {
    if (!Number.isInteger(this.idCompra) || this.idCompra < 1) {
      this.error.set('Compra inválida.');
      this.cargando.set(false);
      return;
    }

    this.compraService.detalle(this.idCompra).subscribe({
      next: (c) => {
        this.compra.set(c);
        this.cargando.set(false);
        // El ticket puede no existir todavía (404): no es un error grave
        this.ticketService.obtener(this.idCompra).subscribe({ next: (t) => this.ticket.set(t), error: () => {} });
      },
      error: (e: HttpErrorResponse) => {
        this.error.set(e.status === 403 || e.status === 404 ? 'No encontramos esa compra.' : 'No se pudo cargar la compra.');
        this.cargando.set(false);
      },
    });
  }

  generar(): void {
    this.generando.set(true);
    this.ticketService.generar(this.idCompra).subscribe({
      next: (t) => {
        this.ticket.set(t);
        this.generando.set(false);
      },
      error: () => {
        this.error.set('No se pudo generar el ticket.');
        this.generando.set(false);
      },
    });
  }

  urlPdf(): string {
    const t = this.ticket();
    return t ? this.ticketService.urlPdf(t) : '';
  }

  iso(fecha: string): string {
    return fecha.replace(' ', 'T');
  }
}
