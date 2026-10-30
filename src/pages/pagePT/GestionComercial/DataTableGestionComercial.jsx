import React, { useEffect, useMemo } from 'react'
import { useGestionComercialStore } from './useGestionComercialStore'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { arrayEstadoComercial, arrayNivelInteresComercial } from '@/types/type'
import dayjs from 'dayjs'
import 'dayjs/locale/es'

// TIPO de fila: prospecto o socio de seguimiento (activo / inactivo)
const tipoFila = (row)=>!row.esSocio ? 'PROSPECTO' : row.activo ? 'ACTIVO' : 'INACTIVO'
const colorTipo = { PROSPECTO: '#7b2cbf', ACTIVO: '#198754', INACTIVO: '#dc3545' }

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
  // socios activos de seguimiento: se quitan los id_cli que ya estan en prospectos
  const dataSocios = useMemo(() => {
    const idsEnProspecto = new Set(dataView?.map(e=>e.id_cli).filter(Boolean))
    return dataSociosSinProspecto
      .filter(c=>!idsEnProspecto.has(c.id_cli))
      .map(c=>({
        esSocio: true,
        codigo: `CLI${c.id_cli}`,
        id_cli: c.id_cli,
        // fecha de la venta del seguimiento (ultima membresia)
        fecha_registro: c.fecha_venta,
        nombres: (c.nombre_cli ?? '').trim(),
        apellidos: [c.apPaterno_cli, c.apMaterno_cli].map(a=>(a ?? '').trim()).filter(Boolean).join(' '),
        celular: c.tel_cli,
        name_pgm: c.name_pgm,
        vendedor: (c.vendedor ?? '').trim(),
        vencimiento: c.vencimiento,
        activo: c.activo,
        // los comentarios del socio van en el cliente (tb_clientes.uid_comentario)
        uid_comentario: c.uid_comentario,
      }))
  }, [dataView, dataSociosSinProspecto])
  const dataFiltrada = useMemo(() => {
    const prospectos = (dataView ?? []).filter(e=>
      (!filtroEstado || e.parametro_estado?.id_param===filtroEstado) &&
      (!filtroAsesor || (e.id_empl ?? e.empleado?.id_empl)===filtroAsesor) &&
      // filtroFecha: YYYY-MM-DD, comparado en hora local como la columna FECHA
      (!filtroFecha || (e.fecha_registro && dayjs(e.fecha_registro).format('YYYY-MM-DD')===filtroFecha))
    // codigo: el buscador de la tabla busca en los datos de la fila, asi se puede buscar por PROS<id>
    ).map(e=>({...e, codigo: `PROS${e.id}`}))
    // los socios no tienen status/asesor/fecha de prospecto: solo se muestran sin filtros
    const hayFiltros = filtroEstado || filtroAsesor || filtroFecha
    // tipo en la fila para que el buscador encuentre ACTIVO / INACTIVO / PROSPECTO
    return (hayFiltros ? prospectos : [...prospectos, ...dataSocios])
      .map(e=>({...e, tipo: tipoFila(e)}))
      .filter(e=>!filtroTipo || e.tipo===filtroTipo)
  }, [dataView, dataSocios, filtroEstado, filtroAsesor, filtroFecha, filtroTipo])
  const columns = [
    {
      id: 0, header: 'ID', render:(row)=>{
        return (
          <>
          {row.codigo}
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
          {row.esSocio ? row.vendedor : row.empleado?.nombres_apellidos_empl}
          </>
        )
      }
    },
    {
      id: 3, header: 'NOMBRES', render: (row)=>{
        return (
          <>
          {row.nombres}
          </>
        )
      }
    },
    {
      id: 4 , header: 'APELLIDOS', render: (row)=>{
        return (
          <>
          {row.apellidos}
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
          {row.celular}
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
          {row.esSocio ? row.name_pgm : [{label: 'CHANGE 45', value: 2}, {label: 'FS 45', value: 3}, {label: 'FISIO MUSCLE', value: 4}].find(e=>e.value===row.id_pgm)?.label}
          </>
        )
      }
    },
    {
      id: 9, header: 'STATUS', render: (row)=>{
        if (row.esSocio) return <Button className={`${row.activo ? 'bg-success' : 'bg-secondary'} border-none`} label={row.activo ? 'SOCIO ACTIVO' : 'SOCIO INACTIVO'}/>
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
        if (row.esSocio) return row.vencimiento ? <>{row.activo ? 'VENCE' : 'VENCIO'}: {dayjs(row.vencimiento).format('DD/MM/YYYY')}</> : null
        return (
          <>
          {row.observacion}
          </>
        )
      }
    },
    {
      id: 10, header: '', render: (row)=>{
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
    { id: 'codigo', exportHeader: 'ID', exportValue: (row)=>row.codigo },
    { id: 'tipo', exportHeader: 'TIPO', width: 12, exportValue: (row)=>tipoFila(row) },
    { id: 'fecha_registro', exportHeader: 'FECHA DE REGISTRO', width: 14, exportValue: (row)=>row.fecha_registro ? dayjs(row.fecha_registro).format('DD/MM/YYYY') : '' },
    { id: 'asesor', exportHeader: 'ASESOR', width: 30, exportValue: (row)=>(row.esSocio ? row.vendedor : row.empleado?.nombres_apellidos_empl) ?? '' },
    { id: 'nombres', exportHeader: 'NOMBRES', exportValue: (row)=>row.nombres ?? '' },
    { id: 'apellidos', exportHeader: 'APELLIDOS', width: 25, exportValue: (row)=>row.apellidos ?? '' },
    { id: 'socio', exportHeader: 'SOCIO', width: 15, exportValue: (row)=>row.id_cli ? 'CON HISTORIAL' : 'SIN HISTORIAL' },
    { id: 'id_cli', exportHeader: 'ID_CLI', width: 10, exportValue: (row)=>row.id_cli || '' },
    { id: 'celular', exportHeader: 'CELULAR', width: 14, exportValue: (row)=>row.celular ?? '' },
    { id: 'canal', exportHeader: 'CANAL', exportValue: (row)=>row.parametro_canal?.label_param ?? '' },
    { id: 'programa', exportHeader: 'PROGRAMA', width: 15, exportValue: (row)=>(row.esSocio ? row.name_pgm : [{label: 'CHANGE 45', value: 2}, {label: 'FS 45', value: 3}, {label: 'FISIO MUSCLE', value: 4}].find(e=>e.value===row.id_pgm)?.label) ?? '' },
    { id: 'status', exportHeader: 'STATUS', width: 25, exportValue: (row)=>row.esSocio ? (row.activo ? 'SOCIO ACTIVO' : 'SOCIO INACTIVO') : row.parametro_estado?.label_param ?? '' },
    { id: 'interes', exportHeader: 'INTERES', width: 15, exportValue: (row)=>row.parametro_nivel_interes?.label_param ?? '' },
    { id: 'observacion', exportHeader: 'OBSERVACION', width: 50, exportValue: (row)=>row.esSocio ? (row.vencimiento ? `${row.activo ? 'VENCE' : 'VENCIO'}: ${dayjs(row.vencimiento).format('DD/MM/YYYY')}` : '') : row.observacion ?? '' },
  ]

  return (
    <div>
      <DataTableCR
          data={dataFiltrada}
          columns={columns}
          exportExtraColumns={columnsExports}
          exportFileName={`prospectos_${dayjs().format('DDMMYYYY')}`}
        />
    </div>
  )
}
