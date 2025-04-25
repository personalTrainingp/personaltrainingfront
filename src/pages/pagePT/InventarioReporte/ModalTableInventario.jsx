import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import config from '@/config';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog'
import { Image } from 'primereact/image';
import React from 'react'
import sinImage from '@/assets/images/imageBlanck.jpg'
export const ModalTableInventario = ({show, onHide, data, ubicacion}) => {
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
            <div className="text-primary fw-bold flex align-items-end gap-2 fs-2 justify-content-center">
                <span>{rowData.cantidad}</span>
            </div>
        );
    };
    
    const valorUnitDeprecBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2 fs-2">
                <span><NumberFormatMoney amount={rowData.costo_unitario_soles}/></span>
            </div>
        );
    };
    const valorUnitActualBodyTemplate = (rowData) => {
        const costo_total_soles = (rowData.costo_unitario_soles*rowData.cantidad)+rowData.mano_obra_soles
        return (
            <div className="flex align-items-center gap-2 fs-2">
                <span> <NumberFormatMoney amount={costo_total_soles}/></span>
            </div>
        );
    };
    
    const costoTotalDolaresBodyTemplate = (rowData) => {
        const costo_total_dolares = (rowData.costo_total_dolares*rowData.cantidad)+rowData.mano_obra_dolares
        return (
            <div className="flex align-items-center gap-2 fs-2 fw-bold text-color-dolar">
                <span> <NumberFormatMoney amount={costo_total_dolares}/></span>
            </div>
        );
    };
    const numeradorBodyTemplate = (rowData, { rowIndex })=>{
        return(
            <div className="flex align-items-center gap-2 fs-2">
                <span>{rowIndex + 1}</span>
            </div>
        )
    }
    const imagenArtBodyTemplate = (rowData, { rowIndex }) => {
        
        return (
            <>
            <div className="flex align-items-center">
            <Image src={rowData.tb_images.length===0?sinImage:`${config.API_IMG.AVATAR_ARTICULO}${rowData.tb_images?.name_image}`} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="170" />
                        {/* <Image src={rowData.tb_images?.length===0?sinImage:`${config.API_IMG.AVATAR_ARTICULO}${rowData.tb_images[rowData.tb_images.length-1]?.name_image}`} className='rounded-circle' indicatorIcon={<i className="pi pi-search"></i>} alt="Image" preview width="170" /> */}
            </div>
            </>
        );
    };
    const costoManoObraBodyTemplate = (rowData)=>{
        
        return (
            
            <div className="d-flex gap-2 fs-2" >
                <div className={`text-right ${rowData.mano_obra_soles===NaN?'text-primary':''} `} style={{marginLeft: '30px'}}>
                    <NumberFormatMoney amount={rowData.mano_obra_soles}/>
                </div>
            </div>
        )
    }
    const costoManoObraDolaresBodyTemplate = (rowData) =>{
        console.log(rowData);
        
        return (
            <div className='fs-2'>
            {(rowData.mano_obra_dolares).toFixed(2)}
            </div>
        )
    }
    const observacionBodyTemplate = (rowData)=>{
        return (
            
            <div className="flex align-items-center gap-2 fs-2">
                <span>{highlightText( `${rowData.observacion}`, globalFilterValue)}</span>
            </div>
        )
    }
  return (
    <Dialog 
    
			contentStyle={{ height: '800px' }}
			header={<div className="text-primary fs-1">INVENTARIO  <span className=''>{data[0]?.parametro_nivel?.label_param && 'NIVEL'} {data[0]?.parametro_nivel?.label_param} {data[0]?.parametro_nivel?.label_param&& '-'} {ubicacion}</span> / CANTIDAD DE ARTICULOS {data.reduce((sum, item) => sum + item.cantidad, 0)}</div>}
            // footer={<div className='h2'>COSTO TOTAL SOLES <NumberFormatMoney amount={data.reduce((sum, item) => sum + item.costo_total_soles, 0)}/> / COSTO TOTAL DOLARES <NumberFormatMoney amount={data.reduce((sum, item) => sum + item.costo_total_dolares, 0)}/></div>}
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
					header=""
					body={numeradorBodyTemplate}
					style={{ width: '2rem' }}
				></Column>
                <Column
					header={<span className='fs-2'>Foto</span>}
					body={imagenArtBodyTemplate}
					style={{ width: '2rem' }}
                    footer={<div className='fs-2 text-primary'>TOTAL</div>}
					sortable
				></Column>
                <Column
					header={<span className='fs-2'>ITEM</span>}
					body={itemBodyTemplate}
					style={{ width: '4rem' }}
					sortable
				></Column>
                <Column
					header={<span className='fs-2'>CANTIDAD ARTICULOS</span>}
					body={cantidadBodyTemplate}
					style={{ width: '4rem' }}
					sortable
				></Column>
                <Column
					header={<span className='fs-2'>COSTO UNITARIO S/.</span>}
					body={valorUnitDeprecBodyTemplate}
					style={{ width: '4rem' }}
					sortable
				></Column>
                <Column
					header={<span className='fs-2'>COSTO MANO DE OBRA S/.</span>}
					body={costoManoObraBodyTemplate}
					style={{ width: '4rem' }}
                    // footer={<div className='fs-2 text-primary'><SymbolSoles numero={<NumberFormatMoney amount={data.reduce((sum, item) => sum + item.costo_total_soles, 0)}/>}/></div>}
					sortable
				></Column>
                <Column
					header={<span className='fs-2'>COSTO MANO DE OBRA $</span>}
					body={costoManoObraDolaresBodyTemplate}
					style={{ width: '4rem' }}
                    footer={<div className='fs-2 text-color-dolar'>$. <NumberFormatMoney amount={data.reduce((sum, item) => sum + item.costo_total_dolares, 0)}/></div>}
					sortable
				></Column>
                <Column
					header={<span className='fs-2'>COSTO TOTAL SOLES S/.</span>}
					body={valorUnitActualBodyTemplate}
					style={{ width: '4rem' }}
                    footer={<div className='fs-2 text-primary'><SymbolSoles numero={<NumberFormatMoney amount={data.reduce((sum, item) => sum + item.costo_total_soles, 0)}/>}/></div>}
					sortable
				></Column>
                {/* <Column
					header={<span className='fs-2'>TC</span>}
					body={tcBodyTemplate}
					style={{ width: '4rem' }}
                    footer={<div className='fs-2 text-primary'><SymbolSoles numero={<NumberFormatMoney amount={data.reduce((sum, item) => sum + item.costo_total_soles, 0)}/>}/></div>}
					sortable
				></Column> */}
                <Column
					header={<span className='fs-2 text-color-dolar'>COSTO TOTAL DOLARES $</span>}
					body={costoTotalDolaresBodyTemplate}
                    footer={<div className='fs-2 text-color-dolar'>$. <NumberFormatMoney amount={data.reduce((sum, item) => sum + item.costo_total_dolares, 0)}/></div>}
					style={{ width: '4rem' }}
					sortable
				></Column>
			</DataTable>
            
    </Dialog>
  )
}
