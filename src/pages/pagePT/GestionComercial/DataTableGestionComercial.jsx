import React, { useEffect, useMemo } from 'react'
import { useGestionComercialStore } from './useGestionComercialStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { arrayEstadoComercial, arrayNivelInteresComercial } from '@/types/type'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

// TIPO: socio de seguimiento -> por su fecha de vencimiento (ACTIVO si vence hoy o despues, si no INACTIVO).
// Lead (lo da el backend): sin cliente PROSPECTO; con cliente ACTIVO si tiene membresia vigente hoy, si no INACTIVO
const tipoFila = (row)=>row.esSocio ? (row.activo ? 'ACTIVO' : 'INACTIVO') : row.tipo ?? 'PROSPECTO'
// celular comparable: solo digitos, ultimos 9 (ignora +51, espacios, guiones)
const cel9 = (cel)=>String(cel ?? '').replace(/\D/g, '').slice(-9)
const colorTipo = { PROSPECTO: '#7b2cbf', ACTIVO: '#198754', INACTIVO: '#dc3545' }
// Solo datos de tb_prospectoLeads (no se reemplazan con los del cliente vinculado)
const nombresDe = (row)=>row.nombres
const apellidosDe = (row)=>row.apellidos
const celularDe = (row)=>row.celular
const labelPrograma = (id_pgm)=>[{label: 'CHANGE 45', value: 2}, {label: 'FS 45', value: 3}, {label: 'FISIO MUSCLE', value: 4}].find(e=>e.value===id_pgm)?.label
// filas de socio (seguimiento): asesor = vendedor de su ultima membresia, programa de esa membresia, observacion = vencimiento
const asesorDe = (row)=>row.esSocio ? row.vendedor : row.empleado?.nombres_apellidos_empl
const programaDe = (row)=>row.esSocio ? row.name_pgm : labelPrograma(row.id_pgm)
const statusSocio = (row)=>row.activo ? 'SOCIO ACTIVO' : 'SOCIO INACTIVO'
const observacionDe = (row)=>row.esSocio
  ? (row.vencimiento ? `${row.activo ? 'VENCE' : 'VENCIO'}: ${dayjs(row.vencimiento).format('DD/MM/YYYY')}` : '')
  : row.observacion

export const DataTableGestionComercial = ({onOpenModalComentario, onOpenModalGestionComercial, onOpenModalTareas, onOpenModalMembresias, filtroEstado, filtroAsesor, filtroFecha, filtroTipo}) => {
  const { obtenerGestionComercial, validarEdicionLead, obtenerSociosActivosSinProspecto, dataSociosSinProspecto } = useGestionComercialStore()
  const {dataView} = useSelector(e=>e.COMERCIAL)
  const onClickEditar = async(row)=>{
    if (await validarEdicionLead(row.id)) {
      onOpenModalGestionComercial(row.id, false, row)
    }
  }
  useEffect(() => {
    obtenerGestionComercial()
    obtenerSociosActivosSinProspecto()
  }, [])
  // Socios de seguimiento que no estan como prospecto en la tabla (ni por id_cli ni por celular)
  const sociosSinProspecto = useMemo(() => {
    const cliEnLead = new Set((dataView ?? []).map(e=>e.id_cli).filter(Boolean))
    const celEnLead = new Set((dataView ?? []).map(e=>cel9(e.celular)).filter(c=>c.length===9))
    return (dataSociosSinProspecto ?? [])
      .filter(s=>!cliEnLead.has(s.id_cli) && !(cel9(s.tel_cli).length===9 && celEnLead.has(cel9(s.tel_cli))))
      .map(s=>({
        esSocio: true,
        id_cli: s.id_cli,
        uid_comentario: s.uid_comentario,
        nombres: String(s.nombre_cli ?? '').trim(),
        apellidos: [s.apPaterno_cli, s.apMaterno_cli].map(a=>String(a ?? '').trim()).filter(Boolean).join(' '),
        celular: s.tel_cli,
        vendedor: String(s.vendedor ?? '').trim(),
        name_pgm: s.name_pgm,
        fecha_registro: s.fecha_venta,
        vencimiento: s.vencimiento,
        activo: s.activo,
        // para el modal de membresias
        cliente: { nombres_apellidos_cli: [s.nombre_cli, s.apPaterno_cli, s.apMaterno_cli].map(a=>String(a ?? '').trim()).filter(Boolean).join(' ') },
        codigo_prospecto: '',
        codigo_cliente: `CLI${s.id_cli}`,
      }))
  }, [dataView, dataSociosSinProspecto])
  const dataFiltrada = useMemo(() => {
    const prospectos = (dataView ?? []).filter(e=>
      (!filtroEstado || e.parametro_estado?.id_param===filtroEstado) &&
      (!filtroAsesor || (e.id_empl ?? e.empleado?.id_empl)===filtroAsesor) &&
      // filtroFecha: YYYY-MM-DD, comparado en hora local como la columna FECHA
      (!filtroFecha || (e.fecha_registro && dayjs(e.fecha_registro).format('YYYY-MM-DD')===filtroFecha))
    // codigos: el buscador de la tabla busca en los datos de la fila, asi se puede buscar por PROS<id> o CLI<id_cli>
    ).map(e=>({...e, codigo_prospecto: `PROS${e.id}`, codigo_cliente: e.id_cli ? `CLI${e.id_cli}` : ''}))
    // socios: no tienen STATUS ni asesor del lead, se ocultan si se filtra por esos campos
    const socios = (filtroEstado || filtroAsesor) ? [] : sociosSinProspecto.filter(e=>
      !filtroFecha || (e.fecha_registro && dayjs(e.fecha_registro).format('YYYY-MM-DD')===filtroFecha)
    )
    // tipo en la fila para que el buscador encuentre ACTIVO / INACTIVO / PROSPECTO
    return [...prospectos, ...socios]
      .map(e=>({...e, tipo: tipoFila(e)}))
      .filter(e=>!filtroTipo || e.tipo===filtroTipo)
  }, [dataView, sociosSinProspecto, filtroEstado, filtroAsesor, filtroFecha, filtroTipo])
  const columns = [
    {
      id: 0, header: 'CODIGO PROSPECTO', render:(row)=>{
        return (
          <>
          {row.codigo_prospecto || '-'}
          </>
        )
      }
    },
    {
      id: 17, header: 'CODIGO SOCIO', render:(row)=>{
        return (
          <>
          {row.codigo_cliente || '-'}
          </>
        )
      }
    },
    {
      id: 16, header: 'TIPO', render: (row)=>{
        const tipo = tipoFila(row)
        return (
          <Button className='border-none' style={{ backgroundColor: colorTipo[tipo] }} label={tipo}/>
        )
      }
    },
    {
      id: 1, header: 'FECHA DE REGISTRO', render:(row)=>{
        return (
          <>
          {row.fecha_registro && dayjs(row.fecha_registro).locale('es').format('dddd D [de] MMMM [del] YYYY')}
          </>
        )
      }
    },
    {
      id: 2, header: 'ASESOR', render: (row)=>{
        return (
          <>
          {asesorDe(row)}
          </>
        )
      }
    },
    {
      id: 3, header: 'NOMBRES', render: (row)=>{
        return (
          <>
          {nombresDe(row)}
          </>
        )
      }
    },
    {
      id: 4 , header: 'APELLIDOS', render: (row)=>{
        return (
          <>
          {apellidosDe(row)}
          </>
        )
      }
    },
    {
      id: 14, header: 'SOCIO', render: (row)=>{
        if (!row.id_cli) return <span className='text-muted'>SIN HISTORIAL</span>
        return (
          <span className='text-primary text-decoration-underline cursor-pointer' onClick={()=>onOpenModalMembresias(row)}>
            {/* {row.cliente?.nombres_apellidos_cli ?? `CLIENTE ${row.id_cli}`} */}
            CON HISTORIAL
          </span>
        )
      }
    },
    {
      id: 5, header: 'CELULAR', render: (row)=>{
        return (
          <>
          {celularDe(row)}
          </>
        )
      }
    },
    // {
    //   id: 6, header: 'DISTRITO', render: (row)=>{
    //     return (
    //       <>
    //       </>
    //     )
    //   }
    // },
    {
      id: 7, header: 'CANAL', render: (row)=>{
        return (
          <>
          {row.parametro_canal?.label_param}
          </>
        )
      }
    },
    {
      id: 8, header: 'PROGRAMA', render: (row)=>{
        return (
          <>
          {programaDe(row)}
          </>
        )
      }
    },
    {
      id: 9, header: 'STATUS', render: (row)=>{
        if (row.esSocio) return <Button className={`${row.activo ? 'bg-success' : 'bg-secondary'} border-none`} label={statusSocio(row)}/>
        return (
          <>
          <Button className={`${arrayEstadoComercial.find(e=>e.value===row.parametro_estado?.id_param)?.color} border-none`} label={row.parametro_estado?.label_param}/>
          </>
        )
      }
    },
    {
      id: 15, header: 'INTERES', render: (row)=>{
        if (!row.parametro_nivel_interes) return null
        return (
          <>
          <Button className={`${arrayNivelInteresComercial.find(e=>e.value===row.parametro_nivel_interes.id_param)?.color} border-none`} label={row.parametro_nivel_interes.label_param}/>
          </>
        )
      }
    },
    {
      id: 13, header: 'OBSERVACION', render: (row)=>{
        return (
          <>
          {observacionDe(row)}
          </>
        )
      }
    },
    {
      id: 10, header: '', render: (row)=>{
        // socio: sin EDITAR (no es lead); comentarios del cliente y tareas por id_cli
        if (row.esSocio) return (
          <>
            <Button icon="pi pi-comment" onClick={()=>onOpenComentario(row.uid_comentario)} rounded outlined severity="danger"  className='mr-2' disabled={!row.uid_comentario}/>
            <Button icon="pi pi-list-check" onClick={()=>onOpenModalTareas(row)} rounded outlined severity="danger"  className='mr-2' tooltip='TAREAS' tooltipOptions={{ position: 'top' }}/>
          </>
        )
        return (
          <>
            <Button icon="pi pi-pencil" onClick={()=>onClickEditar(row)} rounded outlined severity="danger"  className='mr-2' tooltip='EDITAR' tooltipOptions={{ position: 'top' }}/>
            <Button icon="pi pi-comment" onClick={()=>onOpenComentario(row.uid_comentario, row.id_cli)} rounded outlined severity="danger"  className='mr-2'/>
            {/* <Button icon="pi pi-history" onClick={()=>onOpenComentario(row.uid_comentario)} rounded outlined severity="danger"  className='mr-2'/>
            <Button icon="pi pi-eye" onClick={()=>onOpenComentario(row.uid_comentario)} rounded outlined severity="danger"  className='mr-2'/> */}
            <Button icon="pi pi-list-check" onClick={()=>onOpenModalTareas(row)} rounded outlined severity="danger"  className='mr-2' tooltip='TAREAS' tooltipOptions={{ position: 'top' }}/>
          </>
        )
      }
    },
  ]
  const onOpenComentario = (uid, id_cli)=>{
    onOpenModalComentario(uid, id_cli)
  }
  // columnas del "Descargar Excel": DataTableCR solo exporta estas
  const columnsExports = [
    { id: 'codigo_prospecto', exportHeader: 'CODIGO PROSPECTO', width: 18, exportValue: (row)=>row.codigo_prospecto },
    { id: 'codigo_cliente', exportHeader: 'CODIGO SOCIO', width: 18, exportValue: (row)=>row.codigo_cliente },
    { id: 'tipo', exportHeader: 'TIPO', width: 12, exportValue: (row)=>tipoFila(row) },
    { id: 'fecha_registro', exportHeader: 'FECHA DE REGISTRO', width: 14, exportValue: (row)=>row.fecha_registro ? dayjs(row.fecha_registro).format('DD/MM/YYYY') : '' },
    { id: 'asesor', exportHeader: 'ASESOR', width: 30, exportValue: (row)=>asesorDe(row) ?? '' },
    { id: 'nombres', exportHeader: 'NOMBRES', exportValue: (row)=>nombresDe(row) ?? '' },
    { id: 'apellidos', exportHeader: 'APELLIDOS', width: 25, exportValue: (row)=>apellidosDe(row) ?? '' },
    { id: 'socio', exportHeader: 'SOCIO', width: 15, exportValue: (row)=>row.id_cli ? 'CON HISTORIAL' : 'SIN HISTORIAL' },
    { id: 'celular', exportHeader: 'CELULAR', width: 14, exportValue: (row)=>celularDe(row) ?? '' },
    { id: 'canal', exportHeader: 'CANAL', exportValue: (row)=>row.parametro_canal?.label_param ?? '' },
    { id: 'programa', exportHeader: 'PROGRAMA', width: 15, exportValue: (row)=>programaDe(row) ?? '' },
    { id: 'status', exportHeader: 'STATUS', width: 25, exportValue: (row)=>row.esSocio ? statusSocio(row) : row.parametro_estado?.label_param ?? '' },
    { id: 'interes', exportHeader: 'INTERES', width: 15, exportValue: (row)=>row.parametro_nivel_interes?.label_param ?? '' },
    { id: 'observacion', exportHeader: 'OBSERVACION', width: 50, exportValue: (row)=>observacionDe(row) ?? '' },
  ]

  return (
    <div>
      <DataTableCR
          data={dataFiltrada}
          columns={columns}
          exportExtraColumns={columnsExports}
          exportFileName={`prospectos_y_socios_${dayjs().format('DDMMYYYY')}`}
        />
    </div>
  )
}
