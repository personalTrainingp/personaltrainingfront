import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import dayjs from 'dayjs'
import 'dayjs/locale/es'
import utc from 'dayjs/plugin/utc'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import React, { useEffect, useState } from 'react'
import { Alert, Table } from 'react-bootstrap'
import { ModalTiempoEspecial } from './ModalTiempoEspecial'
import { useTiemposEspecialesStore } from './useTiemposEspecialesStore'
dayjs.extend(utc)

// entidad: lo que se guarda en rrhh_tiemposEspeciales.
// Sus tipos están en tb_parametros: entidad_param = 'horas_especiales', grupo_param = la misma entidad.
const CONFIG = {
    permiso: { titulo: 'PERMISO', rangoFechas: true, usaMinutos: false, usaGoce: true },
    tardanza: { titulo: 'TARDANZA', rangoFechas: false, usaMinutos: true, usaGoce: true },
    'hora-extra': { titulo: 'HORAS EXTRAS', rangoFechas: false, usaMinutos: true, usaGoce: false },
    'salida-temprana': { titulo: 'SALIDA TEMPRANA', rangoFechas: false, usaMinutos: true, usaGoce: true },
}

const formatFecha = (fecha)=> fecha ? dayjs.utc(fecha).locale('es').format('dddd D [de] MMMM [del] YYYY').toUpperCase() : '-'
const formatMinutos = (minutos)=>{
    const horas = Math.floor(minutos / 60)
    const resto = minutos % 60
    return [horas > 0 && `${horas} H`, (resto > 0 || horas === 0) && `${resto} MIN`].filter(Boolean).join(' ')
}

export const PanelTiemposEspeciales = ({entidad, id_colaborador, id_empresa}) => {
    const config = CONFIG[entidad]
    const { registros, cargando, error, obtenerRegistros, guardarRegistro, eliminarRegistro } = useTiemposEspecialesStore(entidad, id_empresa, id_colaborador)
    const { obtenerParametroPorEntidadyGrupo, DataGeneral: tipos } = useTerminoStore()
    // null: formulario cerrado. {registro: null}: nuevo. {registro}: editando
    const [formulario, setformulario] = useState(null)
    useEffect(() => {
        obtenerRegistros()
        obtenerParametroPorEntidadyGrupo('horas_especiales', entidad)
    }, [entidad, id_colaborador, id_empresa])

    const onEliminar = (id)=>{
        confirmDialog({
            header: 'Confirmar eliminación',
            message: '¿Está seguro de eliminar este registro?',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Sí',
            rejectLabel: 'No',
            accept: ()=>eliminarRegistro(id),
        })
    }
    const ordenados = [...registros].sort((a, b)=>new Date(b.fechaDesde) - new Date(a.fechaDesde) || b.id - a.id)
    const columnas = 3 + (config.rangoFechas ? 2 : 1) + (config.usaMinutos ? 1 : 0) + (config.usaGoce ? 1 : 0)

  return (
    <>
        <Button onClick={()=>setformulario({registro: null})} className='m-2'>AGREGAR {config.titulo}</Button>
        {error && <Alert variant='danger'>{error}</Alert>}
        <Table className='table-centered mb-0' hover responsive>
            <thead className='bg-primary'>
                <tr>
                    <th className='text-white p-1'>TIPO</th>
                    <th className='text-white p-1'>{config.rangoFechas ? 'FECHA INICIO' : 'FECHA'}</th>
                    {config.rangoFechas && <th className='text-white p-1'>FECHA FINAL</th>}
                    {config.usaMinutos && <th className='text-white p-1'>TIEMPO</th>}
                    {config.usaGoce && <th className='text-white p-1'>¿CON GOCE DE SUELDO?</th>}
                    <th className='text-white p-1'>OBSERVACION</th>
                    <th className='text-white p-1'></th>
                </tr>
            </thead>
            <tbody>
                {ordenados.map((r)=>(
                    <tr key={r.id}>
                        <td>{tipos.find(t=>t.value === r.id_tipo)?.label ?? '-'}</td>
                        <td>{formatFecha(r.fechaDesde)}</td>
                        {config.rangoFechas && <td>{formatFecha(r.fechaHasta)}</td>}
                        {config.usaMinutos && <td>{formatMinutos(r.minutos)}</td>}
                        {config.usaGoce && <td>{r.conGoceSueldo ? 'SI' : 'NO'}</td>}
                        <td>{r.observacion || '-'}</td>
                        <td className='text-nowrap'>
                            <Button icon='pi pi-pencil' rounded text aria-label='Editar' onClick={()=>setformulario({registro: r})}/>
                            <Button icon='pi pi-trash' rounded text severity='danger' aria-label='Eliminar' onClick={()=>onEliminar(r.id)}/>
                        </td>
                    </tr>
                ))}
                {ordenados.length === 0 && (
                    <tr>
                        <td colSpan={columnas} className='text-center text-muted'>{cargando ? 'Cargando...' : 'Sin registros'}</td>
                    </tr>
                )}
            </tbody>
        </Table>
        {formulario && (
            <ModalTiempoEspecial
                config={config}
                registro={formulario.registro}
                tipos={tipos}
                onGuardar={guardarRegistro}
                onHide={()=>setformulario(null)}
            />
        )}
    </>
  )
}
