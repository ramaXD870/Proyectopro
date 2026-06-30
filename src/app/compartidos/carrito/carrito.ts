import { Component, OnInit } from '@angular/core';
import { producto } from '../../model/producto';
import { Carrito as CarritoService } from '../../servicios/carrito';

@Component({
  selector: 'app-carrito',
  imports: [],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito implements OnInit {

  // Array que recibirá los productos del servicio
  productos: producto[] = [];

  // Inyectamos el servicio
  constructor(private carritoService: CarritoService) {}

  ngOnInit() {

    // Cuando carga la página obtenemos los productos
    this.productos = this.carritoService.obtenerProductos();

  }
// Aumenta cantidad
sumar(p: any) {

  p.cantidad++;

  this.carritoService.actualizarCantidad(
    p.id,
    p.cantidad
  );
}
// Disminuye cantidad
restar(p: any) {

  if (p.cantidad > 1) {

    p.cantidad--;

    this.carritoService.actualizarCantidad(
      p.id,
      p.cantidad
    );

  }
}

// Elimina un producto del carrito
eliminarProducto(id: number) {

  this.carritoService.eliminarProducto(id);

  // Actualizamos la tabla
  this.productos =
    this.carritoService.obtenerProductos();
}

// ==========================
// Subtotal de un producto (precio * cantidad)
// ==========================
subtotal(p: any): number {
  return p.precio * (p.cantidad || 1);
}

// ==========================
// Total general del carrito
// ==========================
total(): number {
  return this.productos.reduce(
    (acumulado, p: any) => acumulado + this.subtotal(p),
    0
  );
}

// ==========================
// Vaciar todo el carrito
// ==========================
vaciarCarrito() {

  this.carritoService.vaciarCarrito();

  this.productos = [];
}

// ==========================
// Comprar ya
// ==========================
comprarYa() {

  if (this.productos.length === 0) {
    alert('Tu carrito está vacío');
    return;
  }

  alert(
    '¡Compra realizada por un total de $' +
    this.total().toFixed(2) +
    '! 🎉'
  );

  this.carritoService.vaciarCarrito();
  this.productos = [];
}

}