import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL } from '../config';
import { Ticket } from '../modelos/producto.model';

/** Tickets PDF: obtener por compra y generar. */
@Injectable({ providedIn: 'root' })
export class TicketService {
  private http = inject(HttpClient);
  private url = `${API_URL}/tickets`;

  /** GET /tickets/{id_compra} (404 si todavía no se generó) */
  obtener(idCompra: number): Observable<Ticket> {
    return this.http.get<Ticket>(`${this.url}/${idCompra}`);
  }

  /** POST /tickets/generar/{id_compra} (idempotente) */
  generar(idCompra: number): Observable<Ticket> {
    return this.http.post<Ticket>(`${this.url}/generar/${idCompra}`, {});
  }

  /** URL pública del PDF para abrirlo o descargarlo. */
  urlPdf(ticket: Ticket): string {
    return `${API_URL}/${ticket.pdf_path}`;
  }
}
