import { Component } from '@angular/core';
import { producto } from '../../model/producto'; // Interfaz/tipo que define la forma de un producto
import { Carrito } from '../../servicios/carrito'; // Servicio que maneja el carrito de compras
import { Favoritos } from '../../servicios/favoritos'; // Servicio que maneja la lista de favoritos

@Component({
  selector: 'app-producto',
  imports: [],
  templateUrl: './producto.html', // HTML asociado a este componente
  styleUrl: './producto.css', // CSS asociado a este componente
})
export class Producto {

  // Constructor: Angular inyecta automaticamente las instancias de Carrito y Favoritos
  constructor(
    private carrito: Carrito,
    private favoritos: Favoritos
  ) { }

  // Agrega un producto al carrito
  agregarAlCarrito(
    productoSeleccionado: producto
  ) {

    // Llama al servicio Carrito para guardar el producto seleccionado
    this.carrito.agregarProducto(
      productoSeleccionado
    );

    // Muestra un mensaje emergente confirmando que se agrego
    alert(
      productoSeleccionado.nombre +
      " agregado al carrito"
    );
  }

  // ==========================
  // Alternar favorito (marcar / desmarcar)
  // ==========================
  toggleFavorito(
    productoSeleccionado: producto
  ) {

    // El servicio agrega si no estaba, o elimina si ya estaba
    const quedoMarcado = this.favoritos.toggleFavorito(
      productoSeleccionado
    );

    // Mensaje distinto segun el resultado
    if (quedoMarcado) {
      alert(productoSeleccionado.nombre + " agregado a favoritos ❤️");
    } else {
      alert(productoSeleccionado.nombre + " quitado de favoritos");
    }
  }

  // Saber si un producto esta marcado como favorito (para el HTML)
  esFavorito(id: number): boolean {
    return this.favoritos.esFavorito(id);
  }


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
      precio: 89.99,
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
      // Nota: el id salta de 5 a 7 (no hay id 6), por eso en el HTML
      // pueden verse menos productos de los que esperarias por la cantidad de ids
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