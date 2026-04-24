import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect } from 'react'
import { useGastosStore } from './useGastosStore'
import { useSelector } from 'react-redux'
import { DateMask, DateMaskStr, MaskDate, NumberFormatMoney } from '@/components/CurrencyMask'
import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'

export const DataTableGastos = ({id_empresa, onOpenModalGasto, sonCompras}) => {
    const { obtenerGastos, deleteGastoxID, loading } = useGastosStore()
    const { dataView } = useSelector(e=>e.EGRESOS)
    useEffect(() => {
        obtenerGastos(id_empresa, sonCompras)
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
        {id: 2, header: <>REGISTRO <br/> ADMINISTRATIVO </>, accessor: '', width: '200px', render:(row)=>{
            return (
                <>
                {DateMaskStr(row.fec_registro, 'dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A')}
                </>
            )
        }},
          {id: 3, header: <>DESCRIPCION</>, accessor: 'descripcion', width: '300px', render: (row)=>{
            return (
                <>
                    {row.descripcion}
                </>
            )
        }},
        {id: 4, header: <>FECHA DE <br/> COMPROBANTE</>, width: '200px',  render:(row)=>{
            return (
                <>
                {DateMaskStr(row.fecha_comprobante, 'dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A')}
                {/* <DateMask date={row.fecha_comprobante} format={'dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A'}/> */}
                </>
            )
        }},
        {id: 5, header: 'OPERACION', accessor: 'n_operacion', width: '40px'},
        {id: 6, header: <>MONTO</>, sortable, accesor: 'monto', render: (row)=>{
            return (
                <>
                {
                    row.impuesto_igv && (
                        <>
                        <div style={{width: '120px'}} className={ `${row.moneda === 'PEN'?'':'text-color-dolar'} d-flex align-items-center justify-content-center`}>
                                        {row.moneda === 'PEN' ? <SymbolSoles fontSizeS={'font-15'}/> : <SymbolDolar fontSizeS={'font-15'}/>}
                                        <NumberFormatMoney amount=
                        {row.monto - row.monto/1.18}
                                        />
                                </div>
                        </>
                    )
                }
                <div style={{width: '120px'}} className={ `${row.moneda === 'PEN'?'':'text-color-dolar'} d-flex align-items-center justify-content-center`}>
                                        {row.moneda === 'PEN' ? <SymbolSoles fontSizeS={'font-15'}/> : <SymbolDolar fontSizeS={'font-15'}/>}
                                        <NumberFormatMoney amount={row.monto}/>
                                </div>
                </>
            )
        }},
        {id: 7, header: <>FECHA <br/> PAGO</>, width: '200px', render:(row)=>{
            return (
                <>
                {DateMaskStr(row.fecha_pago, 'dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A')}
                {/* <DateMask date={row.fecha_pago} format={'dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A'}/> */}
                </>
            )
        }},
        {id: 8, header: 'COMPROBANTE', accessor: 'n_comprabante', width: '40px'},
        {id: 9, header: <>TIPO DE <br/> GASTO</>, width: '200px', accessor: 'tipo_gasto', render: (row)=>{
            return (
                <>
                    {row.tipo_gasto}
                </>
            )
        }},
        {id: 10, header: <>RUBRO</>, accessor: 'rubro', width: '200px', render: (row)=>{
            return (
                <>
                    {row.rubro}
                </>
            )
        }},
        {id: 11, header: <>GASTO</>, accessor: 'concepto', width: '200px', render: (row)=>{
            return (
                <div>
                    {row.concepto}
                </div>
            )
        }},
        {id: 12, header: <>FORMA <br/> PAGO</>, accessor: 'forma_pago', width: '200px', render: (row)=>{
            return (
                <>
                    {row.forma_pago}
                </>
            )
        }},
        {id: 13, header: <>PROVEEDOR</>, accessor: 'nombre_proveedor', width: '120px', render: (row)=>{
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

  const columnsExports = [
		{
			id: 'id',
			exportHeader: 'ID',
			exportValue: (row) => row.id,
		},
		{
			id: 'nComprobante',
			exportHeader: 'N° COMPR',
			exportValue: (row) => row.n_comprabante,
		},
		{
			id: 'nOperacion',
			exportHeader: 'Operacion',
			exportValue: (row) => row.n_operacion,
		},
		{
			id: 'fechaPago',
			exportHeader: 'FECHA DE PAGO',
			exportValue: (row) => MaskDate(row.fecha_pago, 'YYYY-MM-DD'),
		},
		{
			id: 'fechaAporte',
			exportHeader: 'FECHA COMPROBANTE',
			exportValue: (row) =>
				MaskDate(row.fecha_comprobante, 'YYYY-MM-DD'),
		},
		{
			id: 'tipo-ingreso',
			exportHeader: 'TIPO DE INGRESO',
			exportValue: (row) => row.tipo_gasto,
		},
		{
			id: 'rubro',
			exportHeader: 'RUBRO',
			exportValue: (row) => row?.rubro,
		},
		{
			id: 'concepto',
			exportHeader: 'CONCEPTO',
			exportValue: (row) => row?.concepto,
		},
		{
			id: 'MONEDA',
			exportHeader: 'MONEDA',
			exportValue: (row) => row.moneda,
		},
		{
			id: 'MONTO',
			exportHeader: 'MONTO',
			exportValue: (row) => row.monto,
		},
        {
            id: 'FORMA_DE_PAGO',
            exportHeader: 'FORMA DE PAGO',
            exportValue: (row)=>row.forma_pago
        },
        {
            id: 'DESCRIPCION',
            exportHeader: 'DESCRIPCION',
            exportValue: (row)=>row.descripcion
        },
        {
            id: 'proveedor',
            exportHeader: 'PROVEEDOR',
            exportValue: (row)=>row.nombre_proveedor
        },
  ];
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
        exportExtraColumns={columnsExports}
        responsive
    />
    </>
  )
}
