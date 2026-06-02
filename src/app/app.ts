import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menu } from './compartidos/menu/menu';
import { Pie } from './compartidos/pie/pie';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Menu,Pie],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('proyectobr');
}
