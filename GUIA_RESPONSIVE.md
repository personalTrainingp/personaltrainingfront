# Guía responsive

Los estilos móviles viven en `src/assets/scss/custom/_mobile.scss`, dentro de un único
`@media (max-width: 767.98px)`. En escritorio ese archivo no tiene ningún efecto.
Cubre de forma genérica tablas, diálogos, pestañas e imágenes, así que una pantalla
nueva ya nace protegida. Aun así, seguir estas seis reglas evita el 90% de los problemas.

## 1. Tablas nuevas: usar `DataTableCR`

`src/components/DataView/DataTableCR.jsx` ya trae `stackOnSmall` y
`responsiveStackBelow = 768` por defecto: por debajo de 768px convierte la tabla en
tarjetas apiladas. Lo usan 53 pantallas.

```jsx
import DataTableCR from '@/components/DataView/DataTableCR';

<DataTableCR value={datos} columns={columnas} />
```

## 2. Si se usa `<Table>` de react-bootstrap, envolver

```jsx
<div className="table-wrapper">
	<Table>...</Table>
</div>
```

`.table-wrapper` ya existe en `_myStyles.scss` con `overflow-x: auto`.

## 3. Nada de píxeles en `style={{}}`

Los anchos y tamaños de letra en línea son los únicos que el CSS no puede corregir.

```jsx
// no
<div style={{ width: '400px', fontSize: '40px' }}>

// sí
<div className="w-100 fs-3">
```

## 4. En `<Col>`, declarar siempre el móvil

```jsx
// no
<Col lg={4}>

// sí
<Col xs={12} md={6} lg={4}>
```

## 5. En `<Dialog>` de PrimeReact, usar `breakpoints`

```jsx
<Dialog
	style={{ width: '50rem' }}
	breakpoints={{ '768px': '95vw' }}
>
```

## 6. Comprobar a 375px antes de dar por terminada una pantalla

En el navegador: herramientas de desarrollo, modo dispositivo, iPhone SE.

## Instalación del proyecto

Node 20 y `npm ci --legacy-peer-deps`. La bandera es obligatoria: `google-maps-react`
declara React 16 como dependencia par y el proyecto usa React 18, así que `npm ci` a
secas falla. No usar `npm install`, que reescribiría `package-lock.json`.

Después de instalar, comprobar `git status`: npm reescribe `yarn.lock` con los binarios
de la plataforma donde se instaló (cambia `@esbuild/win32-x64` por el de macOS o Linux).
Ese cambio **no se debe commitear**, porque el despliegue corre en Linux y esperaría otro
binario. Revertirlo con `git checkout yarn.lock`.
