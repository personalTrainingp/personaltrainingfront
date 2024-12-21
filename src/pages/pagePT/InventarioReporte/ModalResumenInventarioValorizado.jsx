import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Col, Row, Table } from 'react-bootstrap';

export const ModalResumenInventarioValorizado = ({show, onHide, data, label_empresa}) => {
    let groupedData = Object.values(data.reduce((acc, item) => {
        const label = item.parametro_lugar_encuentro?.label_param;
        
        // Si no existe el grupo, lo inicializamos con el formato deseado y la suma en 0
        if (!acc[label]) {
          acc[label] = { ubicacion: label, orden: item.parametro_lugar_encuentro?.orden_param, valor_total_sumado: 0, items: [] };
        }
        
        // Sumamos el valor_total del item actual al grupo correspondiente
        acc[label].valor_total_sumado += item.valor_total;
        
        // Añadimos el item al array `items` del grupo correspondiente
        acc[label].items.push(item);
        
        return acc
    }, {}));
    groupedData = groupedData.sort((a, b) => a.orden-b.orden);
    const cantidadItemsBodyTemplate = (rowData)=>{
        return (
            <div className=''>{rowData.items.length}</div>
        )
    }
    const valorTotalEnSolesTemplate = (rowData)=>{
        return (
            <><NumberFormatMoney amount={rowData.valor_total_sumado}/></>
        )
    }
    const ubicacionBodyTemplate = (rowData)=>{
        return (
            <div className='text-primary'>
            {rowData.ubicacion}
            </div>
        )
    }
    const totalSumaValor = groupedData.reduce((acc, curr) => acc + curr.valor_total_sumado, 0);
    const totalSumaItems = groupedData.reduce((acc, curr) => acc + curr.items.length, 0);
    // groupedData = groupedData.push({ubicacion: 'TOTAL'})
    console.log(groupedData);
  return (
    <Dialog footer={<>
    <div className='fw-bold fs-3'>
                    <span className=''>TOTAL DE ITEMS: </span><span>{totalSumaItems}</span>
                </div>
                <div className='fw-bold fs-3'>
                    <span className=''>VALOR TOTAL <SymbolSoles isbottom={false}/>: </span><span><NumberFormatMoney amount={totalSumaValor}/></span>
                </div>
                <div className='fw-bold fs-3'>
                    <span className=''>VALOR TOTAL $: </span><span><NumberFormatMoney amount={totalSumaValor/3.73}/></span>
                </div>
    </>} style={{width: '80rem'}} header={<>CUADRO RESUMEN / {label_empresa}</>} visible={show} onHide={onHide}>
        <Row>
            <Col xs={12}>
            <Table
                                    // style={{tableLayout: 'fixed'}}
                                    className="table-centered mb-0"
                                    hover
                                    striped
                                    responsive
                                >
                                    <thead className="bg-primary">
                                        <tr>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '350px'}}>UBICACION</div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '200px'}}>CANTIDAD DE ITEMS</div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div style={{width: '80px'}}>INVERSION <SymbolSoles isbottom={false}/></div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div style={{width: '80px'}}>INVERSION $.</div></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            groupedData.map(g=>(
                                                <tr>
                                                    <td style={{width: '30px !important'}} className='text-center font-24 p-1 fw-bold text-primary'><div  style={{width: '350px'}}>{g.ubicacion}</div></td>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='' style={{width: '200px'}}>{g.items.length}</div></th>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div style={{width: '80px'}}><NumberFormatMoney amount={g.valor_total_sumado}/></div></th>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div style={{width: '80px'}}><NumberFormatMoney amount={g.valor_total_sumado/3.73}/></div></th>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </Table>
							{/* <DataTable 
							size='small' 
							value={groupedData} 
							paginator 
							rows={10} 
							paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
							// rowsPerPageOptions={[10, 25, 50, 100, 250]} 
							dataKey="id"
							// selection={selectedCustomers}
							// onSelectionChange={(e) => setselectedCustomers(e.value)}
                            emptyMessage="INVENTARIO no encontrados."
							showGridlines 
                            width={'40rem'}
							// loading={loading} 
							stripedRows
							scrollable
							// onValueChange={valueFiltered}
							>
								<Column header={<div className='fs-4'>UBICACION</div>} body={ubicacionBodyTemplate} sortable style={{ minwidth: '1rem' }} filter/>
								<Column header={<div className='fs-4 text-center'>CANTIDAD DE ITEMS</div>} body={cantidadItemsBodyTemplate} sortable style={{ minwidth: '10rem' }} filter/>
								<Column header={<div className='fs-4'>INVERSION <SymbolSoles isbottom={false}/></div>} body={valorTotalEnSolesTemplate} sortable style={{ minwidth: '8rem' }} filter/>
							</DataTable> */}
				</Col>
        </Row>
    </Dialog>
  )
}




function agruparDataxLugar(dataV) {
    
    const groupedData = Object.values(dataV.reduce((acc, item) => {
        const label = item.parametro_lugar_encuentro?.label_param;
      
        // Si no existe el grupo, lo inicializamos con el formato deseado y la suma en 0
        if (!acc[label]) {
          acc[label] = { ubicacion: label, orden: item.parametro_lugar_encuentro?.orden_param, valor_total_sumado: 0, items: [] };
        }
        
        // Sumamos el valor_total del item actual al grupo correspondiente
        acc[label].valor_total_sumado += item.valor_total;
        
        // Añadimos el item al array `items` del grupo correspondiente
        acc[label].items.push(item);
        
        return acc;
      }, {}));
      
      // Convertimos valor_total_sumado a cadena con dos decimales
      groupedData.forEach(group => {
        group.valor_total_sumado = group.valor_total_sumado.toFixed(2);
      });
      return groupedData.sort((a, b) => a.orden-b.orden);
}