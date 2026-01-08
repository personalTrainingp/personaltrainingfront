import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { DateMask, MaskDate, NumberFormatMoney } from '@/components/CurrencyMask'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { useHistCamInventario } from './hook/useHistCamInventario'

export const DataTableCuentasBalances = ({idEmpresa, onOpenModalCustom}) => {
    const { obtenerArticulosHistorialxIdEmpresa } = useHistCamInventario()
    useEffect(() => {
        obtenerArticulosHistorialxIdEmpresa(idEmpresa)
    }, [idEmpresa])
    const { dataView } = useSelector(e=>e.HISTORIALCAMBIOS)
    console.log({dataView});
    
        const columns = [
            { id: 'id', header: 'ID', accessor: 'id_hc', sortable: true, width: 20, headerAlign: 'right', cellAlign: 'left', render:(row)=>{
                return (
                    <div className='' style={{width: '40px'}}>
                    {row.id_hc}
                    </div>
                )
            } },
            { id: 'item', header: 'Item', render: (row)=>{
                return (
                    <>
                    {row?.producto}
                    </>
                )
            }},
            { id: 'descrip', header: 'Descripcion', render: (row)=>{
                return (
                    <>
                    {row?.descripcion}
                    </>
                )
            }},
            { id: 'costo_total_dolares', header: 'costo total dolares', render: (row)=>{
                return (
                    <>
                    {row?.costo_total_dolares}
                    </>
                )
            }},
            { id: 'costo_total_soles', header: 'costo total soles', render: (row)=>{
                return (
                    <>
                    {row?.costo_total_soles}
                    </>
                )
            }},
            { id: 'mano_obra_soles', header: 'mano obra soles', render: (row)=>{
                return (
                    <>
                    {row?.mano_obra_soles}
                    </>
                )
            }},
            { id: 'mano_obra_dolares', header: 'mano obra dolares', render: (row)=>{
                return (
                    <>
                    {row?.mano_obra_dolares}
                    </>
                )
            }},
            { id: 'updated', header: 'hora actualizada', render: (row)=>{
                return (
                    <>
                    <DateMask date={row.updatedAt} format={'dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A'}/>
                    </>
                )
            }},
            { id: 'accion', header: 'accion', render: (row)=>{
                return (
                    <>
                    {row?.id_accion}
                    </>
                )
            }},
        ]
        // const onClickOpenModalCustomCuentasBalances = (id)=>{
        //     onOpenModalCustomCuentasBalances(id)
        // }
        // const confirmDeleteCuentasBalancesxID = (id)=>{
        //     confirmDialog({
        //           message: '¿Estas seguro de eliminar esto?',
        //           accept: ()=>{
        //             deleteCuentaBalancexID(id, idEmpresa, tipo)
        //           }
        //         })
        // }
        // console.log({dataView});
        
  return (
    <div>
        <DataTableCR
            columns={columns}
            data={dataView}
        />
    </div>
  )
}
