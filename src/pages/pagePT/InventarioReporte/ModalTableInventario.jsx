import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import config from '@/config';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog'
import { Image } from 'primereact/image';
import React from 'react'

export const ModalTableInventario = ({show, onHide, data, ubicacion}) => {
    console.log(data);
    const IdBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2 fs-2">
            {rowData.id}
            </div>
        )
    }
    const itemBodyTemplate = (rowData)=>{
        return (
            <div  className="flex align-items-center gap-2 fs-2">
            {rowData.producto}
            </div>
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
            <div className="flex align-items-center gap-2 fs-2">
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <span>{rowData.descripcion}</span>
            </div>
        );
    }
    const cantidadBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-end gap-2 fs-2 justify-content-center">
                <span>{rowData.cantidad}</span>
            </div>
        );
    };
    
    const valorUnitDeprecBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2 fs-2">
                <span><NumberFormatMoney amount={rowData.costo_unitario}/></span>
            </div>
        );
    };
    const valorUnitActualBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2 fs-2">
                <span> <NumberFormatMoney amount={rowData.costo_total_soles}/></span>
            </div>
        );
    };
    
    const costoTotalDolaresBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2 fs-2">
                <span> <NumberFormatMoney amount={rowData.costo_total_dolares}/></span>
            </div>
        );
    };
    
    const imagenArtBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center">
                        <Image src={rowData.tb_images.length===0?sinImage:`${config.API_IMG.AVATAR_ARTICULO}${rowData.tb_images[rowData.tb_images.length-1]?.name_image}`} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="170" />
            </div>
        );
    };
    const observacionBodyTemplate = (rowData)=>{
        return (
            
            <div className="flex align-items-center gap-2 fs-2">
                <span>{highlightText( `${rowData.observacion}`, globalFilterValue)}</span>
            </div>
        )
    }
    console.log(data);
    
  return (
    <Dialog 
    
			contentStyle={{ height: '800px' }}
			header={<div className="text-primary">{data[0]?.parametro_nivel?.label_param && 'NIVEL'} {data[0]?.parametro_nivel?.label_param} {data[0]?.parametro_nivel?.label_param&& '-'} {ubicacion}</div>}
            footer={<div className='h2'>CANTIDAD {data.reduce((sum, item) => sum + item.cantidad, 0)}</div>}
			style={{ width: '100%', height: '100%' }}
			position="bottom"
            visible={show} onHide={onHide}>
        
			<DataTable value={data} stripedRows size='small' scrollHeight="flex">
				{/* <Column
					header="Id"
					body={IdBodyTemplate}
					style={{ width: '4rem' }}
					sortable
				></Column> */}
                <Column
					header="Foto"
					body={imagenArtBodyTemplate}
					style={{ width: '2rem' }}
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
					header="COSTO UNITARIO S/."
					body={valorUnitDeprecBodyTemplate}
					style={{ width: '4rem' }}
					sortable
				></Column>
                <Column
					header="COSTO TOTAL SOLES S/."
					body={valorUnitActualBodyTemplate}
					style={{ width: '4rem' }}
					sortable
				></Column>
                <Column
					header="COSTO TOTAL DOLARES $"
					body={costoTotalDolaresBodyTemplate}
					style={{ width: '4rem' }}
					sortable
				></Column>
			</DataTable>
            
    </Dialog>
  )
}
