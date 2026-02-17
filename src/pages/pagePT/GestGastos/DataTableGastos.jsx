import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect } from 'react'
import { useGastosStore } from './useGastosStore'
import { useSelector } from 'react-redux'
import { DateMask, DateMaskStr, DateMaskStr2, MaskDate, NumberFormatMoney } from '@/components/CurrencyMask'
import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'

export const DataTableGastos = ({id_empresa, onOpenModalGasto}) => {
    const { obtenerGastos, deleteGastoxID, loading } = useGastosStore()
    const { dataView } = useSelector(e=>e.EGRESOS)
    useEffect(() => {
        obtenerGastos(id_empresa)
    }, [id_empresa])
    const sortable=true;
    
    const columns = [
        {id: 1, header: 'ID', sortable, accessor: 'id', width: '100px', render:(row)=>{
            return (
                <div style={{width: '100%'}}>
                {row.id}
                </div>
            )
        }},
        {id: 2, header: 'COMPROBANTE', accessor: 'n_comprabante', width: '40px'},
        {id: 3, header: 'OPERACION', accessor: 'n_operacion', width: '40px'},
        {id: 4, header: <>FECHA <br/> REGISTRO</>, accessor: '', width: '200px', render:(row)=>{
            return (
                <>
                <DateMask date={row.fec_registro} format={'dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A'}/>
                </>
            )
        },  exportHeader: 'fecha de registro',
  exportValue: (row) => MaskDate(row.fec_registro, 'DD-MM-YYYY')},
        {id: 5, header: <>FECHA <br/> PAGO</>, width: '200px', render:(row)=>{
            return (
                <>
                <DateMask date={row.fecha_pago} format={'dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A'}/>
                </>
            )
        },  exportHeader: 'fecha de pago',
  exportValue: (row) => MaskDate(row.fecha_pago, 'DD-MM-YYYY')},
        {id: 6, header: <>FECHA DE <br/> COMPROBANTE</>, width: '200px',  render:(row)=>{
            return (
                <>
                <DateMask date={row.fecha_comprobante} format={'dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A'}/>
                </>
            )
        },  exportHeader: 'fecha de comprobante',
  exportValue: (row) => MaskDate(row.fecha_comprobante, 'DD-MM-YYYY')},
        {id: 7, header: <>TIPO DE <br/> GASTO</>, width: '200px', accessor: 'tipo_gasto', render: (row)=>{
            return (
                <>
                    {row.tipo_gasto}
                </>
            )
        }},
        {id: 8, header: <>RUBRO</>, accessor: 'rubro', width: '200px', render: (row)=>{
            return (
                <>
                    {row.rubro}
                </>
            )
        }},
        {id: 9, header: <>GASTO</>, accessor: 'concepto', width: '200px', render: (row)=>{
            return (
                <>
                    {row.concepto}
                </>
            )
        }},
        {id: 10, header: <>MONTO</>, sortable, accesor: 'monto', render: (row)=>{
            return (
                <>
                <div className={row.moneda === 'PEN'?'':'text-success fw-bold'}>
                                        {row.moneda === 'PEN' ? <SymbolSoles fontSizeS={'font-15'}/> : <SymbolDolar fontSizeS={'font-15'}/>}
                                        {
                                            <NumberFormatMoney amount={row.monto}/>
                                        }
                                </div>
                </>
            )
        },  exportHeader: 'Monto',
  exportValue: (row) => `${row.moneda} ${row.monto}`},
        {id: 11, header: <>FORMA <br/> PAGO</>, accessor: 'forma_pago', width: '200px', render: (row)=>{
            return (
                <>
                    {row.forma_pago}
                </>
            )
        }},
        {id: 12, header: <>DESCRIPCION</>, accessor: 'descripcion', width: '900px', render: (row)=>{
            return (
                <>
                    {row.descripcion}
                </>
            )
        }},
        {id: 13, header: <>PROVEEDOR</>, accessor: 'nombre_proveedor', render: (row)=>{
            return (
                <>
                    {row.nombre_proveedor}
                </>
            )
        }},
        {id: 14, header: <>ACTION</>, render: (row)=>{
            return (
                <>
                <Button icon="pi pi-pencil" rounded outlined className="mr-2" 
                                onClick={()=>onClickEditModalEgresos(row.id)} 
                                />
                                <Button icon="pi pi-trash" rounded outlined severity="danger"  className='mr-2'
                                onClick={()=>confirmDeleteGastoxID(row.id)} 
                                />
                                <Button icon="pi pi-copy" rounded outlined severity="danger" 
                                onClick={()=>onClickCopyModalEgresos(row.id)} 
                                />
                </>
            )
        }},
    ]
    const onClickEditModalEgresos=(id)=>{
        onOpenModalGasto(id, false)
    }
    const confirmDeleteGastoxID=(id)=>{
        confirmDialog({
            message: `Quieres eliminar el item ${id}`,
            accept: ()=>{
                deleteGastoxID(id, id_empresa)
            }
        })
    }
    const onClickCopyModalEgresos=(id)=>{
        onOpenModalGasto(id, true)
    }
  return (
    <>
    <DataTableCR
        columns={columns}
        data={dataView}
        loading={loading}
        responsive
    />
    </>
  )
}
