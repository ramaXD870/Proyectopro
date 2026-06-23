export interface producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    imagen: string;
    categoria: string;
    disponibilidad: boolean;
    cantidad?: number;
}