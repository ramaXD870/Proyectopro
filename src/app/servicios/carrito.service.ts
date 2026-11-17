import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { API_URL } from '../config';
import { ItemCarrito } from '../modelos/producto.model';

/** Carrito persistente: vive en la base de datos, el signal es solo una copia para la pantalla. */
@Injectable({ providedIn: 'root' })
export class CarritoService {
  private http = inject(HttpClient);
  private url = `${API_URL}/carrito`;

  private _items = signal<ItemCarrito[]>([]);

  readonly items = this._items.asReadonly();
  readonly cantidadTotal = computed(() => this._items().reduce((n, i) => n + i.cantidad, 0));
  readonly total = computed(() => this._items().reduce((s, i) => s + i.cantidad * i.precio_unitario, 0));

  /** GET /carrito */
  cargar(): Observable<ItemCarrito[]> {
    return this.http.get<ItemCarrito[]>(this.url).pipe(
      map((lista) =>
        lista.map((i) => ({ ...i, cantidad: Number(i.cantidad), precio_unitario: Number(i.precio_unitario) })),
      ),
      tap((lista) => this._items.set(lista)),
    );
  }

  /** POST /carrito/agregar */
  agregar(idProducto: number, cantidad = 1): Observable<unknown> {
    return this.http
      .post(`${this.url}/agregar`, { id_producto: idProducto, cantidad })
      .pipe(tap(() => this.cargar().subscribe()));
  }

  /** PUT /carrito/actualizar/{idProducto} */
  actualizar(idProducto: number, cantidad: number): Observable<unknown> {
    return this.http
      .put(`${this.url}/actualizar/${idProducto}`, { cantidad })
      .pipe(tap(() => this.cargar().subscribe()));
  }

  /** DELETE /carrito/eliminar/{idProducto} */
  eliminar(idProducto: number): Observable<unknown> {
    return this.http
      .delete(`${this.url}/eliminar/${idProducto}`)
      .pipe(tap(() => this._items.update((l) => l.filter((i) => i.id_producto !== idProducto))));
  }

  /** DELETE /carrito/vaciar */
  vaciar(): Observable<unknown> {
    return this.http.delete(`${this.url}/vaciar`).pipe(tap(() => this._items.set([])));
  }

  /** Al cerrar sesión o terminar la compra se limpia la copia local. */
  limpiarLocal(): void {
    this._items.set([]);
  }
}
