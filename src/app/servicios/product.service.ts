import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { API_URL } from '../config';
import { Producto, ProductoForm } from '../modelos/producto.model';

/** CRUD y consulta de productos (API REST). */
@Injectable({ providedIn: 'root' })
export class ProductService {
  private http = inject(HttpClient);
  private url = `${API_URL}/productos`;

  // La API devuelve el precio como texto: lo pasamos a número.
  private normalizar = (p: Producto): Producto => ({ ...p, precio: Number(p.precio) });

  listar(buscar = ''): Observable<Producto[]> {
    let params = new HttpParams();
    if (buscar.trim()) params = params.set('buscar', buscar.trim());
    return this.http.get<Producto[]>(this.url, { params }).pipe(map((l) => l.map(this.normalizar)));
  }

  obtener(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}/${id}`).pipe(map(this.normalizar));
  }

  crear(p: ProductoForm): Observable<{ mensaje: string; id: number }> {
    return this.http.post<{ mensaje: string; id: number }>(this.url, p);
  }

  editar(id: number, p: ProductoForm): Observable<{ mensaje: string }> {
    return this.http.put<{ mensaje: string }>(`${this.url}/${id}`, p);
  }

  eliminar(id: number): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.url}/${id}`);
  }

  /** Sube el archivo (multipart/form-data) y devuelve el nombre guardado. */
  subirImagen(archivo: File): Observable<{ imagen: string }> {
    const datos = new FormData();
    datos.append('imagen', archivo);
    return this.http.post<{ imagen: string }>(`${this.url}/imagen`, datos);
  }
}
