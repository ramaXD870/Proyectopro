import { Component } from '@angular/core';
import { Carrito } from '../../servicios/carrito';
import { producto } from '../../model/producto';

@Component({
  selector: 'app-ofertas',
  imports: [],
  templateUrl: './ofertas.html',
  styleUrls: ['./ofertas.css'],
})
export class Ofertas {

  constructor(private carrito: Carrito) {}

  agregarAlCarrito(productoSeleccionado: producto) {

    this.carrito.agregarProducto(productoSeleccionado);

    alert(
      productoSeleccionado.nombre +
      ' agregado al carrito'
    );
  }

}