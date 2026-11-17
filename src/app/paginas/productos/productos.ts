import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Producto } from '../../modelos/producto.model';
import { ProductService } from '../../servicios/product.service';
import { CarritoService } from '../../servicios/carrito.service';
import { FavoritoService } from '../../servicios/favorito.service';
import { AuthService } from '../../servicios/auth.service';
import { urlImagen } from '../../config';

type Orden = 'nombre' | 'precio-asc' | 'precio-desc';

@Component({
  selector: 'app-productos',
  imports: [],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos {
  private productService = inject(ProductService);
  private carrito = inject(CarritoService);
  private favoritos = inject(FavoritoService);
  protected auth = inject(AuthService);
  private ruta = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly urlImagen = urlImagen;

  productos = signal<Producto[]>([]);
  cargando = signal(true);
  error = signal('');
  aviso = signal('');

  // Filtros
  buscar = signal('');
  precioMax = signal<number | null>(null);
  orden = signal<Orden>('nombre');

  /** Lista que se muestra: filtro por precio máximo + orden (la búsqueda por texto la hace la API). */
  visibles = computed(() => {
    const max = this.precioMax();
    const lista = this.productos().filter((p) => max === null || p.precio <= max);

    switch (this.orden()) {
      case 'precio-asc':
        return [...lista].sort((a, b) => a.precio - b.precio);
      case 'precio-desc':
        return [...lista].sort((a, b) => b.precio - a.precio);
      default:
        return [...lista].sort((a, b) => a.nombre.localeCompare(b.nombre));
    }
  });

  constructor() {
    // Cada vez que cambia ?buscar=... en la URL se vuelve a consultar la API
    this.ruta.queryParamMap
      .pipe(
        tap((q) => {
          this.buscar.set(q.get('buscar') ?? '');
          this.cargando.set(true);
          this.error.set('');
        }),
        switchMap((q) => this.productService.listar(q.get('buscar') ?? '')),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (lista) => {
          this.productos.set(lista);
          this.cargando.set(false);
        },
        error: () => {
          this.error.set('No se pudieron cargar los productos. ¿Está encendido XAMPP?');
          this.cargando.set(false);
        },
      });

    // Si hay sesión, se cargan los favoritos para pintar los corazones
    if (this.auth.estaLogueado()) this.favoritos.cargar().subscribe({ error: () => {} });
  }

  buscarTexto(texto: string): void {
    this.router.navigate([], { queryParams: { buscar: texto.trim() || null }, queryParamsHandling: 'merge' });
  }

  cambiarPrecioMax(valor: string): void {
    const n = Number(valor);
    this.precioMax.set(valor.trim() === '' || Number.isNaN(n) ? null : n);
  }

  cambiarOrden(valor: string): void {
    this.orden.set(valor as Orden);
  }

  limpiarFiltros(): void {
    this.precioMax.set(null);
    this.orden.set('nombre');
    this.router.navigate([], { queryParams: {} });
  }

  esFavorito(id: number): boolean {
    return this.favoritos.esFavorito(id);
  }

  /** Acciones que requieren sesión: si no hay, se manda al login y se vuelve acá. */
  private requiereSesion(): boolean {
    if (this.auth.estaLogueado()) return true;
    this.router.navigate(['/inicio-sesion'], { queryParams: { volver: '/productos' } });
    return false;
  }

  agregarAlCarrito(p: Producto): void {
    if (!this.requiereSesion()) return;
    this.carrito.agregar(p.id, 1).subscribe({
      next: () => this.mostrarAviso(`${p.nombre} agregado al carrito 🛒`),
      error: (e: HttpErrorResponse) => this.mostrarAviso(e.error?.error ?? 'No se pudo agregar al carrito'),
    });
  }

  toggleFavorito(p: Producto): void {
    if (!this.requiereSesion()) return;
    this.favoritos.toggle(p.id).subscribe({
      error: (e: HttpErrorResponse) => this.mostrarAviso(e.error?.error ?? 'No se pudo actualizar favoritos'),
    });
  }

  private mostrarAviso(texto: string): void {
    this.aviso.set(texto);
    setTimeout(() => this.aviso.set(''), 2500);
  }
}
