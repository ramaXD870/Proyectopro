import { ErrorHandler, Injectable, Injector, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { API_URL } from '../config';
import { AuditLog } from '../modelos/producto.model';
import { AuthService } from './auth.service';

/** Acciones que el frontend puede reportar (la API tiene la misma lista blanca). */
export type AccionCliente = 'NAVIGATION' | 'CLIENT_ERROR' | 'UI_EVENT';

export interface EventoAuditoria {
  accion: AccionCliente;
  nivel?: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  ruta?: string;
  entidad?: string;
  entidad_id?: string | number;
  detalle?: Record<string, unknown>;
}

export interface FiltrosAuditoria {
  accion?: string;
  nivel?: string;
  origen?: string;
  user_id?: string;
  pagina?: number;
}

/**
 * Tracking centralizado. Los eventos se juntan en una cola y se envían en lotes
 * (POST /auditoria) para no hacer una request por cada clic.
 * Si el envío falla se descarta: el log nunca debe afectar al usuario.
 */
@Injectable({ providedIn: 'root' })
export class AuditService {
  private auth = inject(AuthService);
  private http = inject(HttpClient);
  private esNavegador = isPlatformBrowser(inject(PLATFORM_ID));

  private cola: EventoAuditoria[] = [];
  private temporizador: ReturnType<typeof setTimeout> | null = null;
  private readonly TAM_LOTE = 10;
  private readonly ESPERA_MS = 3000;

  constructor() {
    if (this.esNavegador) {
      // Al cerrar o cambiar de pestaña se envía lo pendiente.
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'hidden') this.enviar();
      });
    }
  }

  registrar(evento: EventoAuditoria): void {
    if (!this.esNavegador) return; // en el servidor (SSR) no se registra nada
    this.cola.push(evento);

    if (this.cola.length >= this.TAM_LOTE) {
      this.enviar();
    } else if (!this.temporizador) {
      this.temporizador = setTimeout(() => this.enviar(), this.ESPERA_MS);
    }
  }

  private enviar(): void {
    if (this.temporizador) {
      clearTimeout(this.temporizador);
      this.temporizador = null;
    }
    if (this.cola.length === 0) return;

    const eventos = this.cola.splice(0, this.TAM_LOTE);
    const token = this.auth.getToken();

    // fetch (y no HttpClient) para que el log no pase por el interceptor
    // ni dispare errores globales; keepalive permite enviar al cerrar la pestaña.
    fetch(`${API_URL}/auditoria`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ eventos }),
      keepalive: true,
    }).catch(() => {
      /* sin conexión: se pierde el log, no se molesta al usuario */
    });

    if (this.cola.length > 0) this.enviar();
  }

  /** GET /auditoria (solo admin) */
  listar(filtros: FiltrosAuditoria = {}): Observable<{ pagina: number; limite: number; datos: AuditLog[] }> {
    let params = new HttpParams();
    for (const [k, v] of Object.entries(filtros)) {
      if (v !== undefined && v !== '') params = params.set(k, String(v));
    }
    return this.http.get<{ pagina: number; limite: number; datos: AuditLog[] }>(`${API_URL}/auditoria`, { params });
  }
}

/** Reemplaza el manejador de errores de Angular: además de mostrarlos en consola los audita. */
@Injectable()
export class AuditErrorHandler implements ErrorHandler {
  // Se resuelve de forma perezosa: AuditService -> AuthService -> afterNextRender
  // depende a su vez de ErrorHandler, y inyectarlo en el constructor crearía un ciclo (NG0200).
  private injector = inject(Injector);

  handleError(error: unknown): void {
    console.error(error);
    const e = error as { message?: string; stack?: string };
    this.injector.get(AuditService).registrar({
      accion: 'CLIENT_ERROR',
      nivel: 'ERROR',
      ruta: typeof location !== 'undefined' ? location.pathname : undefined,
      detalle: { mensaje: String(e?.message ?? error).slice(0, 300) },
    });
  }
}
