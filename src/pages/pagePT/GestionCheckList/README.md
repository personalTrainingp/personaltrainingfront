# GestionCheckList — Backend pendiente

Este módulo del frontend ya está completo y funcionando en **modo mock**
(`hook/useCheckListStore.js` simula la API con un "fake DB" en memoria).
El contrato exacto de endpoints que el backend debe implementar está
documentado en [`checklist.hook`](./checklist.hook).

Cuando el backend implemente esas rutas, solo hay que reemplazar el cuerpo
de cada función de `useCheckListStore.js` por el `PTApi.get/post/put`
correspondiente (la firma de cada función ya queda lista para eso).

## Prompt para pedirle el backend a Claude

Copia y pega esto en la terminal de Claude Code **dentro del repositorio
del backend** (Express + Sequelize + SQL Server):

```
Necesito que implementes el módulo backend de "CheckList" (mantenimiento de
inventario por checklist) en este proyecto Express + Sequelize + SQL Server.

Antes de escribir código, inspecciona el proyecto para copiar sus
convenciones exactas:
- Cómo están organizados los módulos existentes (por ejemplo /egreso,
  /articulo, /storage/blob): estructura de carpetas, nombres de archivo
  de model/controller/routes.
- El formato de respuesta que usan los controllers ({ ok, msg, ... }) y
  cómo manejan errores.
- El middleware de autenticación por header `x-token` (tipo validar-jwt)
  y cualquier middleware de validación de campos (express-validator u
  otro) que ya se use en rutas similares, para reutilizarlos igual aquí.
- La convención de nombres de tabla (por ejemplo prefijo `tb_`, como
  `tb_images`, `tb_articulo`) y de claves foráneas (`id_empresa`,
  `id_articulo`), para que las tablas nuevas encajen con el resto del
  esquema.
- Cómo está modelado el inventario/artículos por empresa (el endpoint
  GET /inventario/obtener-inventario/:id_enterprice o equivalente) y sus
  imágenes (tabla tb_images), porque el checklist depende de ese modelo.

Con esas convenciones ya identificadas, crea TODO lo necesario (models,
controllers, routes y middlewares) para exponer exactamente este contrato
(las respuestas y payloads deben respetarlo tal cual, adaptando solo el
formato interno de ok/msg/errores al que ya use el proyecto):

===========================================================================
CHECKLIST (cabecera)
===========================================================================

POST /checklist/:id_empresa
  Crea la cabecera de un checklist para una empresa.
  IMPORTANTE: en la MISMA transacción debe generarse automáticamente UN
  item por CADA artículo activo del inventario de esa empresa (reutiliza
  la misma lógica/modelo que usa el inventario, no repliques datos a
  mano), todos con revisado=false. El usuario nunca agrega ni elimina
  items sueltos.
  body: { titulo, fecha_checklist (YYYY-MM-DD), responsable, observacion_general }
  response: { ok: true, msg: 'CHECKLIST REGISTRADO', checklist: { id, id_empresa,
    titulo, fecha_checklist, responsable, observacion_general, estado: 'PENDIENTE',
    items: [ ...un item por cada artículo, ver forma en checklist-item... ] } }

GET /checklist/empresa/:id_empresa
  Lista los checklist en estado 'PENDIENTE' de una empresa (sin items).
  response: { ok: true, checklists: [{ id, id_empresa, titulo, fecha_checklist,
    responsable, observacion_general, estado }] }

GET /checklist/historial/:id_empresa
  Igual que el anterior pero filtrando estado = 'COMPLETADO' (histórico).

GET /checklist/id/:id
  Obtiene un checklist puntual CON todos sus items.
  response: { ok: true, checklist: { id, id_empresa, titulo, fecha_checklist,
    responsable, observacion_general, estado, items: [...] } }

PUT /checklist/id/:id
  Actualiza la cabecera (mismos campos que el POST).
  response: { ok: true, msg: 'CHECKLIST ACTUALIZADO' }

PUT /checklist/completar/id/:id
  Marca el checklist como estado = 'COMPLETADO' (pasa al histórico).
  response: { ok: true, msg: 'CHECKLIST FINALIZADO' }

PUT /checklist/delete/id/:id
  Soft-delete del checklist (no borrar físicamente la fila).
  response: { ok: true, msg: 'CHECKLIST ELIMINADO' }

===========================================================================
CHECKLIST ITEM (revisión por artículo)
===========================================================================
Los items NO se crean ni se eliminan sueltos: nacen todos juntos al crear
el checklist (uno por cada artículo del inventario). La única operación
sobre un item es revisarlo/actualizarlo.

Forma de un item:
  { id, id_checklist, id_articulo, producto (nombre del artículo,
    denormalizado para la tabla), opciones: string[] (subset de: arreglo,
    ajuste, cambio, pintura, limpieza, lubricacion, revision_electrica,
    otros), observacion, revisado: boolean, uid_imagen_item, uid_foto_antes,
    uid_foto_despues }

PUT /checklist-item/id/:id
  Actualiza la revisión de un item existente.
  body: { opciones: string[], observacion, revisado }
  El backend debe generar uid_imagen_item / uid_foto_antes / uid_foto_despues
  (uuid) si aún no existían, para que el frontend pueda subir cada binario
  justo después con el endpoint YA EXISTENTE:
    POST /storage/blob/create/:uid_image?container=checklist-items
  (no lo reimplementes, solo genera y devuelve los uid).
  response: { ok: true, msg: 'ITEM ACTUALIZADO', item: { ...forma de arriba... } }

===========================================================================

Todas las rutas van protegidas con el mismo middleware de autenticación
por `x-token` que ya usa el resto del proyecto, y deben incluir las
validaciones de campos correspondientes en cada ruta (usando el mismo
mecanismo de validación que ya usa el proyecto).

Al final, muéstrame un resumen de los archivos creados/modificados
(models, controllers, routes, middlewares) y cómo registrar las rutas
nuevas en el router principal si no lo hiciste ya.
```

## Ajuste posterior: contadores en el histórico

El frontend ya está conectado al contrato de arriba. Detectamos que
`GET /checklist/historial/:id_empresa` no alcanza para pintar los
contadores de items en la tabla de histórico (esa ruta solo devuelve
cabeceras, sin items). Si aún no lo aplicaste, pega esto también en la
terminal de Claude del backend:

```
En el módulo de CheckList que ya implementamos, ajusta el controller de
GET /checklist/historial/:id_empresa para que cada checklist del arreglo
"checklists" incluya, además de los campos que ya devuelve, estos tres
campos calculados a partir de sus items (sin traer el array completo de
items en la respuesta):

  total_items: number   -> cantidad total de items del checklist
  revisados: number     -> cantidad de items con revisado = true
  no_revisados: number  -> total_items - revisados

No cambies nada más del contrato existente (ni de GET /checklist/empresa/:id_empresa,
que debe seguir igual sin estos campos).
```
