import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { useParientesStore } from './useParientesStore'
import { useSelector } from 'react-redux'
import { confirmDialog } from 'primereact/confirmdialog'

export const DataTable = ({onOpenModalCustomPariente, uid_contactoEmergencia, entidad}) => {
    const { obtenerParientesxUidLocation, onDeleteParientexId } = useParientesStore()
    useEffect(() => {
        obtenerParientesxUidLocation(uid_contactoEmergencia, entidad)
    }, [])
    const { dataView } = useSelector(e=>e.DATA)
    const onDeleteContactoEmergencia = (id)=>{
        confirmDialog({
            header: 'Confirmar eliminación',
            message: '¿Está seguro de eliminar este contacto?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                onDeleteParientexId(id, uid_contactoEmergencia, entidad)
            },
            reject: () => {
                // nothing to do
            }
        })
    }
  return (
    <div>
        <Table>
            <thead>
                <tr>
                    <th>PARIENTE</th>
                    <th>NOMBRE DEL PARIENTE</th>
                    <th>telefono</th>
                    <th>email</th>
                    <th>obsevacion</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    dataView.map(d=>{
                        return (
                            <tr>
                                <td>{d?.tipo_pariente?.label_param}</td>
                                <td>{d?.nombres}</td>
                                <td>{d?.telefono}</td>
                                <td>{d?.email}</td>
                                <td>{d?.comentario}</td>
                                <td>
                                    <div onClick={()=>onOpenModalCustomPariente(d.id)}>
                                        <i className='pi pi-pencil'></i>
                                    </div>
                                    <div onClick={()=>onDeleteContactoEmergencia(d.id)}>
                                        <i className='pi pi-trash'></i>
                                    </div>
                                </td>
                            </tr>
                        )
                    })
                }

            </tbody>
        </Table>
    </div>
  )
}
