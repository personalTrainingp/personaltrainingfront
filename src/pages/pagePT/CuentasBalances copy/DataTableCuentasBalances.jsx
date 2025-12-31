import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect } from 'react'
import { useCuentasBalances } from './hook/useCuentasBalances'
import { useSelector } from 'react-redux'
import { MaskDate, NumberFormatMoney } from '@/components/CurrencyMask'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'

export const DataTableCuentasBalances = ({tipo, idEmpresa, onOpenModalCustomCuentasBalances}) => {
    const { obtenerCuentasBalancesxIdEmpresaxTipo, deleteCuentaBalancexID } = useCuentasBalances()
    useEffect(() => {
        obtenerCuentasBalancesxIdEmpresaxTipo(idEmpresa, tipo)
    }, [idEmpresa, tipo])
    const { dataView } = useSelector(e=>e.CUENTASBALANCES)
        const columns = [
            { id: 'id', header: 'ID', accessor: 'id', sortable: true, width: 20, headerAlign: 'right', cellAlign: 'left' },
            { id: 'id_concepto', header: 'Concepto', render: (row)=>{
                return (
                    <>
                    {row?.concepto?.label_param}
                    </>
                )
            }},
            { id: 'monto', header: 'Monto', accessor: 'monto', sortable: true, render:(row)=>{
                return (
                    <>
                    <NumberFormatMoney amount={row.monto}/>
                    </>
                )
            } },
            { id: 'fecha_comprobante', header: 'fecha de comprobante', accessor: 'fecha_comprobante', sortable: true, render:(row)=>{
                return (
                    <>
                    {          MaskDate(row?.fecha_comprobante, 'dddd DD [ DE ]  MMMM [DEL] YYYY')
                    }
                    </>
                )
            } },
            { id: 'id_prov', header: 'proveedor', accessor: 'id_prov', sortable: true, width: 20, headerAlign: 'right', cellAlign: 'left' },
            { id: 'descripcion', header: 'descripcion', accessor: 'descripcion', sortable: true, width: 20, headerAlign: 'right', cellAlign: 'left' },
            { id: 'accion', header: '',  sortable: true, render:(row)=>{
                return (
                    <>
                        <Button icon="pi pi-pencil" rounded outlined className="mr-2" 
                        onClick={()=>onClickOpenModalCustomCuentasBalances(row.id)} 
                        />
                        <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2'
                        onClick={()=>confirmDeleteCuentasBalancesxID(row.id)} 
                        />
                    </>
                )
            }},
        ]
        const onClickOpenModalCustomCuentasBalances = (id)=>{
            onOpenModalCustomCuentasBalances(id)
        }
        const confirmDeleteCuentasBalancesxID = (id)=>{
            confirmDialog({
                  message: '¿Estas seguro de eliminar esto?',
                  accept: ()=>{
                    deleteCuentaBalancexID(id, idEmpresa, tipo)
                  }
                })
        }
        console.log({dataView});
        
  return (
    <div>
        <DataTableCR
            columns={columns}
            data={dataView}
        />
    </div>
  )
}
