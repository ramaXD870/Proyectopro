import { Component } from '@angular/core';
import { producto } from '../../model/producto';

@Component({
  selector: 'app-producto',
  imports: [],
  templateUrl: './producto.html',
  styleUrl: './producto.css',
})
export class Producto {
  Productos: producto[] = [
    {
      id: 1,
      nombre: 'Pikachu Holo Raro',
      categoria: 'Eléctrico',
      imagen: 'assets/pikachu.webp',
      descripcion: 'Pikachu Holo Raro - Edición Limitada',
      precio: 45.99,
      stock: 12,
      disponibilidad: true
    },
    {
      id: 2,
      nombre: 'Charizard EX',
      categoria: 'Fuego',
      imagen: 'assets/chari.webp',
      descripcion: 'Charizard EX Ultra Raro - Poder Supremo',
      precio: 89.99 ,
      stock: 8,
      disponibilidad: true
    },
    {
      id: 3,
      nombre: 'Booster XY',
      categoria: 'Booster',
      imagen: 'assets/bosteeer.webp',
      descripcion: 'Booster Pack XY Evoluciones - 10 cartas',
      precio: 29.99,
      stock: 25,
      disponibilidad: true
    },
    {
      id: 4,
      nombre: 'Mewtwo VMAX',
      categoria: 'Psíquico',
      imagen: 'assets/mewto.jpg',
      descripcion: 'Mewtwo VMAX Gigamax - Edición Especial',
      precio: 129.99,
      stock: 5,
      disponibilidad: true
    },
    {
      id: 5,
      nombre: 'Eevee Pack',
      categoria: 'Normal',
      imagen: 'assets/evee.webp',
      descripcion: 'Pack Completo Evoluciones Eevee',
      precio: 39.99,
      stock: 18,
      disponibilidad: true
    },
    {
      id: 7,
      nombre: 'Sword & Shield',
      categoria: 'Booster',
      imagen: 'assets/sword.jpg',
      descripcion: 'Booster Sword & Shield Vivos',
      precio: 34.99,
      stock: 30,
      disponibilidad: true
    },
    {
      id: 8,
      nombre: 'Lugia Legend',
      categoria: 'Psíquico',
      imagen: 'assets/lugia.jpg',
      descripcion: 'Lugia Legendaria Reverse Holo',
      precio: 99.99,
      stock: 6,
      disponibilidad: true
    },
    {
      id: 9,
      nombre: 'Gengar VMAX',
      categoria: 'Fantasma',
      imagen: 'assets/gengar.webp',
      descripcion: 'Gengar VMAX Fantasma Gigante',
      precio: 119.99,
      stock: 4,
      disponibilidad: true
    },
    {
      id: 10,
      nombre: 'Elite Trainer',
      categoria: 'Accesorios y Cartas',
      imagen: 'assets/elite.webp',
      descripcion: 'Elite Trainer Box Completa + 8 boosters',
      precio: 59.99,
      stock: 15,
      disponibilidad: true
    },
    {
      id: 11,
      nombre: 'Elite Trainer box:Mega evolutions',
      categoria: 'Accesorios y Cartas',
      imagen: 'assets/fantasmaa.webp',
      descripcion: 'Elite Trainer Box Completa + 8 boosters',
      precio: 125.00,
      stock: 2,
      disponibilidad: true
    }

  ]
}


