import { Injectable, PLATFORM_ID, afterNextRender, computed, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { API_URL } from '../config';
import { RespuestaLogin, Usuario } from '../modelos/producto.model';

const CLAVE_TOKEN = 'token';
const CLAVE_USUARIO = 'usuario';

/** Login, registro, roles y manejo del JWT (guardado en localStorage). */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  private _usuario = signal<Usuario | null>(null);

  readonly usuario = this._usuario.asReadonly();
  readonly estaLogueado = computed(() => this._usuario() !== null);
  readonly esAdmin = computed(() => this._usuario()?.rol === 'admin');

  constructor() {
    // Se restaura DESPUÉS del primer render para no romper la hidratación del SSR
    // (el servidor siempre renderiza "sin sesión").
    afterNextRender(() => this.restaurarSesion());
  }

  registro(nombre: string, email: string, contraseña: string): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${API_URL}/usuarios/registro`, { nombre, email, contraseña });
  }

  login(email: string, contraseña: string): Observable<RespuestaLogin> {
    return this.http.post<RespuestaLogin>(`${API_URL}/usuarios/login`, { email, contraseña }).pipe(
      tap((r) => {
        this.guardar(CLAVE_TOKEN, r.token);
        this.guardar(CLAVE_USUARIO, JSON.stringify(r.usuario));
        this._usuario.set(r.usuario);
      }),
    );
  }

  logout(): void {
    this.borrarSesion();
    this.router.navigate(['/inicio-sesion']);
  }

  /** Sin redirigir: lo usa el interceptor cuando el token venció. */
  borrarSesion(): void {
    this.quitar(CLAVE_TOKEN);
    this.quitar(CLAVE_USUARIO);
    this._usuario.set(null);
  }

  getToken(): string | null {
    return this.leer(CLAVE_TOKEN);
  }

  /** Lee la sesión guardada; si el token venció la descarta. Es idempotente. */
  restaurarSesion(): void {
    const token = this.getToken();
    const crudo = this.leer(CLAVE_USUARIO);
    if (!token || !crudo) return;

    if (this.tokenVencido(token)) {
      this.borrarSesion();
      return;
    }
    try {
      this._usuario.set(JSON.parse(crudo) as Usuario);
    } catch {
      this.borrarSesion();
    }
  }

  // ---------- helpers ----------

  /** El payload del JWT trae "exp" (segundos); solo es una comprobación de UX, la validación real la hace la API. */
  private tokenVencido(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return typeof payload.exp !== 'number' || payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private leer(clave: string): string | null {
    if (!this.esNavegador) return null;
    try {
      return localStorage.getItem(clave);
    } catch {
      return null;
    }
  }

  private guardar(clave: string, valor: string): void {
    if (!this.esNavegador) return;
    try {
      localStorage.setItem(clave, valor);
    } catch {
      /* almacenamiento bloqueado: la sesión dura hasta recargar */
    }
  }

  private quitar(clave: string): void {
    if (!this.esNavegador) return;
    try {
      localStorage.removeItem(clave);
    } catch {
      /* nada */
    }
  }
}
