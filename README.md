# Tienda Pokémon — Frontend Angular

Frontend del proyecto final de E-Commerce (Angular 21, SSR, Bootstrap/Bootswatch). Consume la API REST en PHP (`api_proyecto`).

## Cómo ejecutarlo

1. Dejar la API funcionando (ver `api_proyecto/README.md`): XAMPP con Apache y MySQL encendidos, base `tienda`, tabla `audit_logs` y un usuario admin.
2. La URL de la API está en `src/app/config.ts` (`http://localhost/api_proyecto/public`).
3. Instalar y levantar:
   ```
   npm install
   npm start        # http://localhost:4200  (la API solo permite ese origen por CORS)
   ```

## Estructura (`src/app`)

```
auth/            inicio-sesion/, registro/          formularios reactivos + manejo del token
compartidos/     nav/, footer/, carrito/, favoritos/
modelos/         producto.model.ts                  interfaces tipadas de la API
paginas/         inicio, productos, ofertas, contacto, compra, compras, ticket, admin
servicios/       auth, product, carrito, compra, favorito, ticket, audit (.service.ts)
interceptores/   auth.interceptor.ts                agrega "Authorization: Bearer" y maneja el 401
guard/           admin.guard.ts, auth.guard.ts      protegen rutas por sesión y por rol
```

Plantillas con la sintaxis nueva `@if` / `@for` / `@empty`.

## Decisiones

- **Token JWT** en `localStorage`; el interceptor lo agrega a cada pedido a la API. Si la API responde `401` se cierra la sesión.
- **Guards**: `authGuard` (carrito, favoritos, compra, compras, ticket) y `adminGuard` (panel admin). La API vuelve a validar el rol: los guards son solo UX.
- **SSR**: solo `inicio` y `contacto` se prerenderizan; el resto se renderiza en el navegador porque depende de la API y del token.
- **Estado**: carrito y favoritos viven en la base de datos; los servicios mantienen una copia en `signal`s para la pantalla.
- **Datos de envío** (página `compra`): se validan en el formulario pero la base de la consigna no tiene dónde guardarlos.

## Auditoría desde el frontend

- `AuditService` junta eventos y los envía en lotes a `POST /auditoria` (no bloquea la interfaz y descarta si falla).
- `app.ts` registra cada `NavigationEnd` (acción `NAVIGATION`) en un solo lugar.
- `AuditErrorHandler` registra los errores no capturados (`CLIENT_ERROR`).
- Panel admin → pestaña **Auditoría**: tabla con filtros por acción y nivel.
