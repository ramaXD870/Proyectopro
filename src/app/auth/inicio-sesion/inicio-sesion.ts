import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../servicios/auth.service';
import { CarritoService } from '../../servicios/carrito.service';
import { FavoritoService } from '../../servicios/favorito.service';

@Component({
  selector: 'app-inicio-sesion',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.css',
})
export class InicioSesion {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  private ruta = inject(ActivatedRoute);
  private carrito = inject(CarritoService);
  private favoritos = inject(FavoritoService);

  cargando = signal(false);
  error = signal('');
  sesionVencida = this.ruta.snapshot.queryParamMap.has('vencida');

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: () => {
        // Se cargan el carrito y los favoritos guardados en la base de datos
        this.carrito.cargar().subscribe({ error: () => {} });
        this.favoritos.cargar().subscribe({ error: () => {} });

        const volver = this.ruta.snapshot.queryParamMap.get('volver');
        // Solo rutas internas (evita redirecciones abiertas hacia otros sitios)
        this.router.navigateByUrl(volver && volver.startsWith('/') && !volver.startsWith('//') ? volver : '/productos');
      },
      error: (e: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(
          e.status === 0
            ? 'No se pudo conectar con el servidor.'
            : (e.error?.error ?? 'No se pudo iniciar sesión.'),
        );
      },
    });
  }
}
