// Configuración del frontend.
// API_URL: dirección de la API PHP (XAMPP sirve la carpeta api_proyecto/public).
export const API_URL = 'http://localhost/api_proyecto/public';

// Las imágenes de los productos subidas por el admin viven en /uploads de la API.
export const urlImagen = (nombre: string | null | undefined): string =>
  nombre ? `${API_URL}/uploads/${encodeURIComponent(nombre)}` : 'assets/pikachu.webp';
