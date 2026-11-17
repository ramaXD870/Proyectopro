import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Producto } from '../../modelos/producto.model';
import { ProductService } from '../../servicios/product.service';
import { CarritoService } from '../../servicios/carrito.service';
import { AuthService } from '../../servicios/auth.service';
import { urlImagen } from '../../config';

@Component({
  selector: 'app-ofertas',
  imports: [],
  templateUrl: './ofertas.html',
  styleUrls: ['./ofertas.css'],
})
export class Ofertas {
  private productService = inject(ProductService);
  private carrito = inject(CarritoService);
  private auth = inject(AuthService);
  private router = inject(Router);
  protected readonly urlImagen = urlImagen;

  private productos = signal<Producto[]>([]);
  cargando = signal(true);
  aviso = signal('');

  /** Destacados: los 6 productos de menor precio del catálogo real. */
  destacados = computed(() => [...this.productos()].sort((a, b) => a.precio - b.precio).slice(0, 6));

  constructor() {
    this.productService.listar().subscribe({
      next: (l) => {
        this.productos.set(l);
        this.cargando.set(false);
      },
      error: () => {
        this.aviso.set('No se pudieron cargar las ofertas.');
        this.cargando.set(false);
      },
    });
  }

  agregarAlCarrito(p: Producto): void {
    if (!this.auth.estaLogueado()) {
      this.router.navigate(['/inicio-sesion'], { queryParams: { volver: '/ofertas' } });
      return;
    }
    this.carrito.agregar(p.id, 1).subscribe({
      next: () => this.aviso.set(`${p.nombre} agregado al carrito 🛒`),
      error: () => this.aviso.set('No se pudo agregar al carrito'),
    });
  }
}
