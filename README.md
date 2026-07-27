# Cancha · Ventas & Cuentas

App para llevar las cuentas de tu negocio de aguas y chucherías en el campo, sin libreta.

## Cómo funciona

- **Clientes**: agrega a cada cliente una vez. Al tocar su tarjeta se abre su cuenta.
- **Productos que compra**: dentro de la cuenta del cliente aparece el menú de productos, con los más vendidos primero. Tocas el producto y se va sumando a su cuenta (como fiado), puedes ajustar cantidades con + / −.
- **Cerrar cuenta**: cuando el cliente ya va a pagar, tocas "Cerrar cuenta y dar ticket". Se genera un ticket con todo lo que compró y el total, su cuenta se pone en $0, y el ticket queda guardado en el historial.
- **Productos**: agrega, edita o elimina los productos que vendes (el precio, el nombre). Puedes tener 10, 20, los que sean.
- **Reportes**: total vendido hoy, cuántos tickets cerraste, ticket promedio y tu producto más vendido del día.
- **Tema**: el botón de la lunita/sol cambia entre modo oscuro (por defecto) y modo claro, útil cuando hay mucho sol y no se ve bien la pantalla.
- Todo se guarda en el `localStorage` del navegador — no necesita internet ni servidor, pero vive solo en ese dispositivo/navegador.

## Correr en tu computadora

```bash
npm install
npm run dev
```

Abre lo que te indique la terminal (normalmente `http://localhost:5173`).

## Subir a GitHub

```bash
git init
git add .
git commit -m "Cancha - primera versión"
git branch -M main
git remote add origin https://github.com/UlisesIsaias/TU-REPO.git
git push -u origin main
```

## Deploy en Netlify

1. Entra a [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**.
2. Conecta tu repo de GitHub.
3. Configuración de build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Deploy. Netlify te da la URL (puedes cambiarla en Site settings → Domain management).

## Notas

- Los datos viven en el `localStorage` del navegador donde uses la app. Si la abres en otro celular/computadora, empieza vacía. Si en algún momento quieres que los datos se compartan entre dispositivos (ej. tu celular y una tablet en la caseta), se puede migrar a una base de datos en la nube — avísame y lo vemos.
- El catálogo trae 10 productos de ejemplo (agua, refresco, paletas, etc.) con precios de muestra — edítalos desde la pestaña "Productos" para poner los tuyos reales.
