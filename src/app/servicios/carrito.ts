import { Injectable } from "@angular/core";
import { producto } from "../model/producto";

@Injectable({
  providedIn: "root",
})
export class Carrito {

  // Lista privada del carrito
  private productos: producto[] = [];

  // ==========================
  // CREATE
  // Agregar producto
  // ==========================
  agregarProducto(productoNuevo: producto): void {

    // Buscamos si ya existe
    const existe = this.productos.find(
      p => p.id === productoNuevo.id
    );

    if (existe) {

      // Si existe aumenta cantidad
      existe.cantidad = (existe.cantidad || 1) + 1;

    } else {

      // Si no existe se agrega
      this.productos.push({
        ...productoNuevo,
        cantidad: 1
      });

    }
  }

  // ==========================
  // READ
  // Obtener carrito
  // ==========================
  obtenerProductos(): producto[] {
    return this.productos;
  }

  // ==========================
  // UPDATE
  // Modificar cantidad
  // ==========================
  actualizarCantidad(
    id: number,
    cantidad: number
  ): void {

    const producto = this.productos.find(
      p => p.id === id
    );

    if (producto) {
      producto.cantidad = cantidad;
    }
  }

  // ==========================
  // DELETE
  // Eliminar producto
  // ==========================
  eliminarProducto(id: number): void {

    this.productos = this.productos.filter(
      p => p.id !== id
    );

  }

  // ==========================
  // DELETE TOTAL
  // Vaciar carrito
  // ==========================
  vaciarCarrito(): void {
    this.productos = [];
  }
}