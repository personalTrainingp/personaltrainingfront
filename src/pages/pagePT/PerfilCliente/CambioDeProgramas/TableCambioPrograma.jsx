import React, { useEffect } from 'react';
import { useGestionCambioProgramaStore } from './useGestionCambioProgramaStore';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import { useSelector } from 'react-redux';

export default function TableCambioPrograma() {
    const  { obtenerLosCambiosMembresia } = useGestionCambioProgramaStore()
    const {dataView} = useSelector(e=>e.CAMBIOPROGRAMA)
    useEffect(() => {
        obtenerLosCambiosMembresia();
    }, [])
    const columns = [
        {
            id: 1, header: 'Fecha de cambio', render: (row)=>{
                return (
                    <>{row.fecha_cambio}</>
                )
            }
        },
        {
            id: 1, header: 'Observacion', render: (row)=>{
                return (
                    <>{row.observacion}</>
                )
            }
        }
    ]
    return (
        <>
        {JSON.stringify(dataView, null, 2)}
            <DataTableCR
                data={dataView}
                columns={columns}
            />
        </>
    );
}


