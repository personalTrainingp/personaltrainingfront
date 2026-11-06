import ExcelJS from 'exceljs'
import { saveAs } from 'file-saver'

// Mismos colores de la tabla (.bg-change / .text-change / .text-ISESAC)
const ROJO = 'FFCD1014'
const VERDE = 'FF17A700'
const GRIS = 'FF6C757D'
const BLANCO = 'FFFFFFFF'
const BORDE_COLOR = { argb: 'FFDEE2E6' }
const BORDE = { top: {style: 'thin', color: BORDE_COLOR}, bottom: {style: 'thin', color: BORDE_COLOR}, left: {style: 'thin', color: BORDE_COLOR}, right: {style: 'thin', color: BORDE_COLOR} }
const FONDO_ROJO = { type: 'pattern', pattern: 'solid', fgColor: { argb: ROJO } }
const MONEDA = '#,##0.00'

const COLUMNAS = [
    { key: 'numero', titulo: 'N°', ancho: 6, centrado: true },
    { key: 'colaborador', titulo: 'COLABORADOR', ancho: 40, negrita: true },
    { key: 'cargo', titulo: 'CARGO', ancho: 26 },
    { key: 'honorario', titulo: 'HONORARIO', ancho: 14, formato: MONEDA },
    { key: 'costoDia', titulo: 'COSTO\nPOR DIA', ancho: 12, formato: MONEDA },
    { key: 'diasNoAsistio', titulo: 'DIAS QUE\nNO ASISTIO', ancho: 14, formato: '0', centrado: true, negrita: true },
    { key: 'descuento', titulo: 'DESCUENTO', ancho: 14, formato: MONEDA, color: ROJO, negrita: true },
    { key: 'minutosTardanza', titulo: 'MINUTOS DE\nTARDANZA', ancho: 14, formato: '0" min"', centrado: true, color: ROJO, negrita: true },
    { key: 'descuentoTardanza', titulo: 'DESCUENTO\nTARDANZA', ancho: 14, formato: MONEDA, color: ROJO, negrita: true },
    { key: 'salidasSinGoce', titulo: 'SALIDAS TEMPRANAS\nSIN GOCE', ancho: 20, formato: MONEDA, color: ROJO },
    { key: 'horasExtras', titulo: 'HORAS\nEXTRAS', ancho: 12, formato: MONEDA, color: VERDE },
    { key: 'neto', titulo: 'PAGO\nNETO', ancho: 14, formato: MONEDA, color: VERDE, negrita: true },
]
const COL_HONORARIO = COLUMNAS.findIndex(c=>c.key === 'honorario') + 1
const COL_NETO = COLUMNAS.findIndex(c=>c.key === 'neto') + 1

const sumar = (filas, key)=> filas.reduce((total, f)=>total + (Number(f[key]) || 0), 0)

// Fila roja de ancho completo: título de la planilla y de cada concepto
const agregarTitulo = (hoja, texto, tamano)=>{
    const fila = hoja.addRow([texto])
    hoja.mergeCells(fila.number, 1, fila.number, COLUMNAS.length)
    const celda = fila.getCell(1)
    celda.fill = FONDO_ROJO
    celda.font = { bold: true, size: tamano, color: { argb: BLANCO } }
    celda.alignment = { horizontal: 'center', vertical: 'middle' }
}

const agregarCabecera = (hoja)=>{
    const fila = hoja.addRow(COLUMNAS.map(c=>c.titulo))
    fila.height = 34
    fila.eachCell((celda)=>{
        celda.fill = FONDO_ROJO
        celda.font = { bold: true, color: { argb: BLANCO } }
        celda.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true }
        celda.border = BORDE
    })
}

const agregarColaborador = (hoja, datos)=>{
    const fila = hoja.addRow(COLUMNAS.map(c=>datos[c.key] ?? '-'))
    COLUMNAS.forEach((col, i)=>{
        const valor = datos[col.key]
        const celda = fila.getCell(i + 1)
        const esNumero = typeof valor === 'number'
        const sinDato = col.formato && !esNumero
        if(col.formato && esNumero) celda.numFmt = col.formato
        // igual que en la tabla: en gris lo que está en 0 o sin horario
        const color = col.color && esNumero && valor > 0 ? col.color : (sinDato || (col.color && valor === 0) ? GRIS : null)
        celda.font = { bold: Boolean(col.negrita) && !sinDato, ...(color && { color: { argb: color } }) }
        celda.alignment = { horizontal: col.centrado || valor == null || sinDato ? 'center' : esNumero ? 'right' : 'left', vertical: 'middle' }
        celda.border = BORDE
    })
}

const agregarTotal = (hoja, etiqueta, filas, tamano)=>{
    const fila = hoja.addRow([])
    fila.getCell(1).value = etiqueta
    fila.getCell(COL_HONORARIO).value = sumar(filas, 'honorario')
    fila.getCell(COL_NETO).value = sumar(filas, 'neto')
    COLUMNAS.forEach((_, i)=>{
        const celda = fila.getCell(i + 1)
        celda.fill = FONDO_ROJO
        celda.font = { bold: true, size: tamano, color: { argb: BLANCO } }
    })
    fila.getCell(COL_HONORARIO).numFmt = MONEDA
    fila.getCell(COL_NETO).numFmt = MONEDA
    hoja.mergeCells(fila.number, 1, fila.number, COL_HONORARIO - 1)
    hoja.mergeCells(fila.number, COL_HONORARIO + 1, fila.number, COL_NETO - 1)
}

// grupos: [{concepto, filas: [{numero, colaborador, cargo, honorario, ...}]}] con los valores ya calculados
export const construirLibroPlanilla = (titulo, grupos)=>{
    const libro = new ExcelJS.Workbook()
    const hoja = libro.addWorksheet('Planilla')
    hoja.columns = COLUMNAS.map(c=>({ width: c.ancho }))
    agregarTitulo(hoja, titulo, 18)
    grupos.forEach(({concepto, filas})=>{
        agregarTitulo(hoja, `${concepto} (${filas.length})`, 14)
        agregarCabecera(hoja)
        filas.forEach(f=>agregarColaborador(hoja, f))
        agregarTotal(hoja, `TOTAL ${concepto}`, filas, 12)
    })
    agregarTotal(hoja, 'TOTAL GENERAL', grupos.flatMap(g=>g.filas), 14)
    return libro
}

export const exportarPlanillaExcel = async (titulo, grupos, nombreArchivo)=>{
    const buffer = await construirLibroPlanilla(titulo, grupos).xlsx.writeBuffer()
    saveAs(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), nombreArchivo)
}
