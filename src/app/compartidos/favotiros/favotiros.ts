import { Component, OnInit } from '@angular/core';
import { producto } from '../../model/producto';
import { Favoritos } from '../../servicios/favoritos';
import { Carrito } from '../../servicios/carrito';

@Component({
  selector: 'app-favotiros',
  imports: [],
  templateUrl: './favotiros.html',
  styleUrl: './favotiros.css',
})
export class FavotirosComponent {


  favoritos: producto[] = [];

  constructor(
    private favoritosService: Favoritos,
    private carritoService: Carrito
  ) {}

  ngOnInit() {

    // READ
    this.favoritos =
      this.favoritosService.obtenerFavoritos();

  }

  // DELETE
  eliminar(id: number) {

    this.favoritosService.eliminarFavorito(id);

    this.favoritos =
      this.favoritosService.obtenerFavoritos();

  }

  // DELETE TOTAL
  vaciarFavoritos() {

    this.favoritosService.vaciarFavoritos();

    this.favoritos = [];

  }

  // ==========================
  // Agregar un favorito al carrito
  // ==========================
  agregarAlCarrito(productoSeleccionado: producto) {

    this.carritoService.agregarProducto(
      productoSeleccionado
    );

    alert(
      productoSeleccionado.nombre +
      " agregado al carrito 🛒"
    );
  }
}