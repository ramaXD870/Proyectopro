import { Component, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { AuditLog, Compra, Producto, Usuario } from '../../modelos/producto.model';
import { ProductService } from '../../servicios/product.service';
import { CompraService } from '../../servicios/compra.service';
import { AuditService } from '../../servicios/audit.service';
import { AuthService } from '../../servicios/auth.service';
import { API_URL, urlImagen } from '../../config';
import { HttpClient } from '@angular/common/http';

type Pestania = 'productos' | 'usuarios' | 'ventas' | 'auditoria';

/** Panel de administración (rol admin): productos, usuarios, ventas y auditoría. */
@Component({
  selector: 'app-admin',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './admin.html',
  styleUrl: './admin.css',
})
export class Admin {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private productService = inject(ProductService);
  private compraService = inject(CompraService);
  private audit = inject(AuditService);
  protected auth = inject(AuthService);
  protected readonly urlImagen = urlImagen;

  pestania = signal<Pestania>('productos');
  mensaje = signal('');
  error = signal('');

  // ---------- Productos ----------
  productos = signal<Producto[]>([]);
  editandoId = signal<number | null>(null);
  subiendo = signal(false);

  form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    descripcion: ['', [Validators.required, Validators.maxLength(2000)]],
    precio: [0, [Validators.required, Validators.min(0)]],
    imagen: ['', Validators.required],
  });

  // ---------- Usuarios / Ventas / Auditoría ----------
  usuarios = signal<Usuario[]>([]);
  ventas = signal<Compra[]>([]);
  logs = signal<AuditLog[]>([]);
  filtroAccion = signal('');
  filtroNivel = signal('');
  paginaLogs = signal(1);

  constructor() {
    this.cargarProductos();
  }

  cambiarPestania(p: Pestania): void {
    this.pestania.set(p);
    this.mensaje.set('');
    this.error.set('');
    if (p === 'productos') this.cargarProductos();
    if (p === 'usuarios') this.cargarUsuarios();
    if (p === 'ventas') this.cargarVentas();
    if (p === 'auditoria') this.cargarLogs();
  }

  // ===== Productos =====
  cargarProductos(): void {
    this.productService.listar().subscribe({
      next: (l) => this.productos.set(l),
      error: (e) => this.fallo(e),
    });
  }

  editar(p: Producto): void {
    this.editandoId.set(p.id);
    this.form.setValue({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, imagen: p.imagen });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicion(): void {
    this.editandoId.set(null);
    this.form.reset({ nombre: '', descripcion: '', precio: 0, imagen: '' });
  }

  /** Sube la imagen elegida y guarda el nombre que devuelve la API en el formulario. */
  elegirImagen(evento: Event): void {
    const archivo = (evento.target as HTMLInputElement).files?.[0];
    if (!archivo) return;

    this.subiendo.set(true);
    this.error.set('');
    this.productService.subirImagen(archivo).subscribe({
      next: (r) => {
        this.form.controls.imagen.setValue(r.imagen);
        this.subiendo.set(false);
      },
      error: (e) => {
        this.subiendo.set(false);
        this.fallo(e);
      },
    });
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const datos = this.form.getRawValue();
    const id = this.editandoId();
    const peticion = id ? this.productService.editar(id, datos) : this.productService.crear(datos);

    peticion.subscribe({
      next: () => {
        this.exito(id ? 'Producto actualizado' : 'Producto creado');
        this.cancelarEdicion();
        this.cargarProductos();
      },
      error: (e) => this.fallo(e),
    });
  }

  eliminar(p: Producto): void {
    if (!confirm(`¿Eliminar "${p.nombre}"?`)) return;
    this.productService.eliminar(p.id).subscribe({
      next: () => {
        this.exito('Producto eliminado');
        this.cargarProductos();
      },
      error: (e) => this.fallo(e),
    });
  }

  // ===== Usuarios =====
  cargarUsuarios(): void {
    this.http.get<Usuario[]>(`${API_URL}/usuarios/todos`).subscribe({
      next: (l) => this.usuarios.set(l),
      error: (e) => this.fallo(e),
    });
  }

  // ===== Ventas =====
  cargarVentas(): void {
    this.compraService.todas().subscribe({
      next: (l) => this.ventas.set(l),
      error: (e) => this.fallo(e),
    });
  }

  totalVentas(): number {
    return this.ventas().reduce((s, v) => s + v.total, 0);
  }

  // ===== Auditoría =====
  cargarLogs(pagina = 1): void {
    this.paginaLogs.set(pagina);
    this.audit
      .listar({ accion: this.filtroAccion(), nivel: this.filtroNivel(), pagina })
      .subscribe({
        next: (r) => this.logs.set(r.datos),
        error: (e) => this.fallo(e),
      });
  }

  setFiltro(campo: 'accion' | 'nivel', valor: string): void {
    (campo === 'accion' ? this.filtroAccion : this.filtroNivel).set(valor);
    this.cargarLogs(1);
  }

  iso(fecha: string): string {
    return fecha.replace(' ', 'T');
  }

  private exito(texto: string): void {
    this.error.set('');
    this.mensaje.set(texto);
    setTimeout(() => this.mensaje.set(''), 2500);
  }

  private fallo(e: HttpErrorResponse): void {
    const campos = e.error?.campos ? ' (' + Object.values(e.error.campos).join(', ') + ')' : '';
    this.error.set((e.error?.error ?? 'Ocurrió un error.') + campos);
  }
}
