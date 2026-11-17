import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { API_URL } from '../config';
import { Compra, DetalleCompra } from '../modelos/producto.model';
import { CarritoService } from './carrito.service';

/** Finalizar compra y consultar compras. */
@Injectable({ providedIn: 'root' })
export class CompraService {
  private http = inject(HttpClient);
  private carrito = inject(CarritoService);
  private url = `${API_URL}/compras`;

  private normalizar = (c: Compra): Compra => ({
    ...c,
    total: Number(c.total),
    detalle: c.detalle?.map((d: DetalleCompra) => ({
      ...d,
      cantidad: Number(d.cantidad),
      precio_unitario: Number(d.precio_unitario),
      subtotal: Number(d.subtotal),
    })),
  });

  /** POST /compras/finalizar: convierte el carrito en una compra. */
  finalizar(): Observable<{ mensaje: string; id_compra: number }> {
    return this.http
      .post<{ mensaje: string; id_compra: number }>(`${this.url}/finalizar`, {})
      .pipe(tap(() => this.carrito.limpiarLocal()));
  }

  /** GET /compras: mi historial. */
  historial(): Observable<Compra[]> {
    return this.http.get<Compra[]>(this.url).pipe(map((l) => l.map(this.normalizar)));
  }

  /** GET /compras/{id}: una compra con sus productos. */
  detalle(id: number): Observable<Compra> {
    return this.http.get<Compra>(`${this.url}/${id}`).pipe(map(this.normalizar));
  }

  /** GET /compras/todas: todas las ventas (admin). */
  todas(): Observable<Compra[]> {
    return this.http.get<Compra[]>(`${this.url}/todas`).pipe(map((l) => l.map(this.normalizar)));
  }
}
