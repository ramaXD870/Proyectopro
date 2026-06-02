import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inicio-s',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './inicio-s.html',
  styleUrl: './inicio-s.css',
})
export class InicioS implements OnInit {
  loginForm!: FormGroup;
  isLoading = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      remember: [false]
    });
  }

  // Getters para facilitar el acceso a los controles
  get email() {
    return this.loginForm.get('email')!;
  }

  get password() {
    return this.loginForm.get('password')!;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      // Simular llamada al API
      setTimeout(() => {
        console.log('Login data:', this.loginForm.value);
        this.isLoading = false;
        // Aquí iría tu lógica de autenticación real
        alert('¡Login exitoso! (Simulado)');
      }, 2000);
    }
  }

  goToRegister(event: Event): void {
    event.preventDefault();
    // Aquí navegas a la página de registro
    console.log('Ir a registro');
  }
}