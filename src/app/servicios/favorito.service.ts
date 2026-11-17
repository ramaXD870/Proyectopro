import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, tap } from 'rxjs';
import { API_URL } from '../config';
import { Favorito } from '../modelos/producto.model';

/** Favoritos del usuario (guardados en la base de datos). */
@Injectable({ providedIn: 'root' })
export class FavoritoService {
  private http = inject(HttpClient);
  private url = `${API_URL}/favoritos`;

  private _favoritos = signal<Favorito[]>([]);

  readonly favoritos = this._favoritos.asReadonly();
  private ids = computed(() => new Set(this._favoritos().map((f) => f.id_producto)));

  esFavorito(idProducto: number): boolean {
    return this.ids().has(idProducto);
  }

  /** GET /favoritos */
  cargar(): Observable<Favorito[]> {
    return this.http.get<Favorito[]>(this.url).pipe(
      map((l) => l.map((f) => ({ ...f, precio: Number(f.precio) }))),
      tap((l) => this._favoritos.set(l)),
    );
  }

  /** POST /favoritos/agregar */
  agregar(idProducto: number): Observable<unknown> {
    return this.http
      .post(`${this.url}/agregar`, { id_producto: idProducto })
      .pipe(tap(() => this.cargar().subscribe()));
  }

  /** DELETE /favoritos/eliminar/{idProducto} */
  quitar(idProducto: number): Observable<unknown> {
    return this.http
      .delete(`${this.url}/eliminar/${idProducto}`)
      .pipe(tap(() => this._favoritos.update((l) => l.filter((f) => f.id_producto !== idProducto))));
  }

  /** Marca o desmarca según el estado actual. */
  toggle(idProducto: number): Observable<unknown> {
    return this.esFavorito(idProducto) ? this.quitar(idProducto) : this.agregar(idProducto);
  }

  limpiarLocal(): void {
    this._favoritos.set([]);
  }
}
