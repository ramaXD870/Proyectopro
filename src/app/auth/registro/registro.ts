import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../servicios/auth.service';

// Validador de grupo: las dos contraseñas deben coincidir
function coinciden(grupo: AbstractControl): ValidationErrors | null {
  return grupo.get('password')?.value === grupo.get('repetir')?.value ? null : { distintas: true };
}

@Component({
  selector: 'app-registro',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  cargando = signal(false);
  error = signal('');
  exito = signal(false);

  form = this.fb.nonNullable.group(
    {
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(72)]],
      repetir: ['', Validators.required],
    },
    { validators: coinciden },
  );

  enviar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    const { nombre, email, password } = this.form.getRawValue();

    this.auth.registro(nombre, email, password).subscribe({
      next: () => {
        this.exito.set(true);
        setTimeout(() => this.router.navigate(['/inicio-sesion']), 1500);
      },
      error: (e: HttpErrorResponse) => {
        this.cargando.set(false);
        this.error.set(
          e.status === 0 ? 'No se pudo conectar con el servidor.' : (e.error?.error ?? 'No se pudo registrar.'),
        );
      },
    });
  }
}
