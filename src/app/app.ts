import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { Nav } from './compartidos/nav/nav';
import { Footer } from './compartidos/footer/footer';
import { AuditService } from './servicios/audit.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private router = inject(Router);
  private audit = inject(AuditService);

  constructor() {
    // Tracking de navegación en UN solo lugar: ninguna página tiene que registrar nada a mano.
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(inject(DestroyRef)),
      )
      .subscribe((e) => this.audit.registrar({ accion: 'NAVIGATION', ruta: e.urlAfterRedirects.split('?')[0] }));
  }
}
