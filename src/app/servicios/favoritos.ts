import { Injectable } from "@angular/core";
import { producto } from "../model/producto";

@Injectable({
  providedIn: "root",
})
export class Favoritos {

  // ==================================
  // Lista privada de favoritos
  // ==================================
  private favoritos: producto[] = [];

  // ==================================
  // CREATE
  // Agregar producto a favoritos
  // ==================================
  agregarFavorito(productoNuevo: producto): void {

    // Verificamos si ya existe
    const existe = this.favoritos.find(
      p => p.id === productoNuevo.id
    );

    // Si no existe lo agregamos
    if (!existe) {
      this.favoritos.push(productoNuevo);
    }
  }

  // ==================================
  // READ
  // Obtener todos los favoritos
  // ==================================
  obtenerFavoritos(): producto[] {
    return this.favoritos;
  }

  // ==================================
  // READ
  // Saber si un producto ya esta en favoritos
  // ==================================
  esFavorito(id: number): boolean {
    return this.favoritos.some(p => p.id === id);
  }

  // ==================================
  // TOGGLE
  // Si esta en favoritos lo quita, si no esta lo agrega
  // Devuelve true si quedo marcado, false si quedo desmarcado
  // ==================================
  toggleFavorito(productoToggle: producto): boolean {

    const existe = this.favoritos.find(
      p => p.id === productoToggle.id
    );

    if (existe) {
      this.eliminarFavorito(productoToggle.id);
      return false;
    } else {
      this.agregarFavorito(productoToggle);
      return true;
    }
  }

  // ==================================
  // UPDATE
  // Actualizar información de un favorito
  // ==================================
  actualizarFavorito(
    id: number,
    datosActualizados: producto
  ): void {

    const indice = this.favoritos.findIndex(
      p => p.id === id
    );

    if (indice !== -1) {
      this.favoritos[indice] = datosActualizados;
    }
  }

  // ==================================
  // DELETE
  // Eliminar un favorito
  // ==================================
  eliminarFavorito(id: number): void {

    this.favoritos = this.favoritos.filter(
      p => p.id !== id
    );

  }

  // ==================================
  // DELETE TOTAL
  // Vaciar favoritos
  // ==================================
  vaciarFavoritos(): void {
    this.favoritos = [];
  }
}