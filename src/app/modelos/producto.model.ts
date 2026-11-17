// Interfaces que tipan lo que responde la API REST.
// Nota: MySQL devuelve los DECIMAL como texto ("45.99"); los servicios los
// convierten a number para poder operar con ellos.

export interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
  creado?: string;
}

export interface ProductoForm {
  nombre: string;
  descripcion: string;
  precio: number;
  imagen: string;
}

export interface ItemCarrito {
  id_producto: number;
  nombre: string;
  imagen: string;
  cantidad: number;
  precio_unitario: number;
}

export interface Favorito {
  id: number;
  id_producto: number;
  nombre: string;
  precio: number;
  imagen: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'user' | 'admin';
  creado?: string;
}

export interface RespuestaLogin {
  token: string;
  usuario: Usuario;
}

export interface Compra {
  id_compra: number;
  id_usuario?: number;
  total: number;
  fecha: string;
  nombre?: string; // comprador (solo en /compras/todas)
  email?: string;
  detalle?: DetalleCompra[];
}

export interface DetalleCompra {
  id_detalle: number;
  id_producto: number;
  nombre: string;
  imagen: string;
  cantidad: number;
  precio_unitario: number;
  subtotal: number;
}

export interface Ticket {
  id_ticket?: number;
  numero_ticket: string;
  id_compra?: number;
  pdf_path: string;
  fecha?: string;
}

export interface AuditLog {
  id: number;
  fecha_hora: string;
  origen: 'CLIENT' | 'SERVER';
  nivel: 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';
  accion: string;
  user_id: number | null;
  entidad: string | null;
  entidad_id: string | null;
  detalle: string | null;
  ruta: string | null;
  metodo_http: string | null;
  status_code: number | null;
  duracion_ms: number | null;
  ip_origen: string | null;
}
