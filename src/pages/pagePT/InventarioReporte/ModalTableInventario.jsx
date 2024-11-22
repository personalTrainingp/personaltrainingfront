import { MoneyFormatter } from '@/components/CurrencyMask';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog'
import React from 'react'

export const ModalTableInventario = ({show, onHide, data, ubicacion}) => {
    console.log(data);
    const IdBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.id}
            </>
        )
    }
    const itemBodyTemplate = (rowData)=>{
        return (
            <>
            {rowData.producto}
            </>
        )
    }
    
    const highlightText = (text, search) => {
        if (!search) {
            return text;
        }
        if (!text) {
            return text;
        }
        const regex = new RegExp(`(${search})`, 'gi');
        return text.split(regex).map((part, index) =>
            part.toLowerCase() === search.toLowerCase() ? (
                <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
            ) : (
                part
            )
        );
    };
    
    const lugarBodyTemplate = (rowData)=>{
        return (
            <div className="gap-2">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <div>NIVEL {rowData.parametro_nivel?.label_param}</div>

                <div>{rowData.parametro_lugar_encuentro?.label_param}</div>
            </div>
        );
    }
    
    const descripcionBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <span>{rowData.descripcion}</span>
            </div>
        );
    }
    const cantidadBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-end w-50 gap-2 justify-content-center">
                <span>{rowData.cantidad}</span>
            </div>
        );
    };
    
    const valorUnitDeprecBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span><MoneyFormatter amount={rowData.valor_unitario_depreciado}/></span>
            </div>
        );
    };
    const valorUnitActualBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span> <MoneyFormatter amount={rowData.valor_unitario_actual}/></span>
            </div>
        );
    };
    
    const observacionBodyTemplate = (rowData)=>{
        return (
            
            <div className="flex align-items-center gap-2">
                <span>{highlightText( `${rowData.observacion}`, globalFilterValue)}</span>
            </div>
        )
    }
    console.log(data);
    
  return (
    <Dialog 
    
			contentStyle={{ height: '800px' }}
			header={<div className="text-primary">NIVEL {data[0]?.parametro_nivel?.label_param} - {ubicacion}</div>}
            footer={<div className='h2'>CANTIDAD {data.reduce((sum, item) => sum + item.cantidad, 0)}</div>}
			style={{ width: '100%' }}
			position="bottom"
            visible={show} onHide={onHide}>
        
			<DataTable value={data} stripedRows scrollable scrollHeight="flex">
				<Column
					header="Id"
					body={IdBodyTemplate}
					style={{ width: '4rem' }}
					sortable
				></Column>
                <Column
					header="ITEM"
					body={itemBodyTemplate}
					style={{ width: '4rem' }}
					sortable
				></Column>
                <Column
					header="CANTIDAD"
					body={cantidadBodyTemplate}
					style={{ width: '4rem' }}
					sortable
				></Column>
                <Column
					header="VALOR ACTUAL"
					body={valorUnitDeprecBodyTemplate}
					style={{ width: '4rem' }}
					sortable
				></Column>
                {/* <Column
					header="VALOR ADQUISICION"
					body={valorUnitActualBodyTemplate}
					style={{ width: '4rem' }}
					sortable
				></Column> */}
			</DataTable>
            
    </Dialog>
  )
}
