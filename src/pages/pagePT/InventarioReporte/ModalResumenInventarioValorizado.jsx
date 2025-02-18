import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog'
import React from 'react'
import { Col, Row, Table } from 'react-bootstrap';

export const ModalResumenInventarioValorizado = ({show, onHide, data, label_empresa}) => {
    let groupedData = Object.values(data.reduce((acc, item) => {
        const label = item.parametro_lugar_encuentro?.label_param;
        
        // Si no existe el grupo, lo inicializamos con el formato deseado y la suma en 0
        // if (!acc[label]) {
        //   acc[label] = { ubicacion: label, orden: item.parametro_lugar_encuentro?.orden_param, valor_total_sumado: 0, items: [] };
        // }
        
        // Sumamos el valor_total del item actual al grupo correspondiente
        // acc[label].valor_total_sumado += item.costo_total_soles;

        // Si no existe el grupo, lo inicializamos con el formato deseado y la suma en 0
        if (!acc[label]) {
            acc[label] = { ubicacion: label, tb_images: item.parametro_lugar_encuentro?.tb_images, orden: item.parametro_lugar_encuentro?.orden_param, valor_total_sumado_soles: 0, valor_total_sumado_dolares: 0, cantidad_sumado: 0, items: [] };
          }
          
          // Sumamos el valor_total del item actual al grupo correspondiente
          acc[label].valor_total_sumado_soles += item.costo_total_soles;
          acc[label].valor_total_sumado_dolares += item.costo_total_dolares;
          acc[label].cantidad_sumado += item.cantidad;
          
        
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
        <Row>
            <Col xs={12}>
            <Table
                                    // style={{tableLayout: 'fixed'}}
                                    className="table-centered mb-0"
                                    hover
                                    striped
                                    // responsive
                                >
                                    <thead className="bg-primary">
                                        <tr>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '350px'}}>UBICACION</div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '200px'}}>CANTIDAD DE ITEMS</div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px'}}>INVERSION S/</div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#1E8727'}}>INVERSION <SymbolDolar/></div></th>
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div style={{width: '80px'}}>t.c</div></th> */}
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}>P.C</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            groupedData.map(g=>(
                                                <tr>
                                                    <td style={{width: '30px !important'}} className='font-24 p-1 fw-bold text-primary'><div  style={{width: '350px'}}>{g.ubicacion}</div></td>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='text-end' style={{width: '140px'}}>{g.cantidad_sumado}</div></th>
                                                    <th style={{width: '30px !important'}} className='font-24 p-1 '><div className='text-end ml-3' style={{width: '140px'}}><NumberFormatMoney amount={g.valor_total_sumado_soles}/></div></th>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='fw-bold ml-4 text-end' style={{width: '140px', color: '#1E8727'}}><NumberFormatMoney amount={g.valor_total_sumado_dolares}/></div></th>
                                                    {/* <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div style={{width: '80px'}}><NumberFormatMoney amount={g.valor_total_sumado_soles/g.valor_total_sumado_dolares}/></div></th> */}
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                    
                                                                                                            <tr className='bg-primary text-white'>
                                                                                                                        <td>
                                                                                                                            <span className='text-white fs-2 fw-bold'>
                                                                                                                                TOTAL
                                                                                                                            </span>
                                                                                                                            
                                                                                                                            <br/>
                                                                                                                                <span className='text-white fs-2 fw-bold'>
                                                                                                                                    {/* TC: 3.74 */}
                                                                                                                                </span>
                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            <span className='text-white fs-2 fw-bold ml-7'>
                                                                                                                            {/* <SymbolDolar numero={}/>  */}
                                                                                                                            <NumberFormatter amount={groupedData.reduce((total, item) => total + (item.cantidad_sumado || 0), 0)}/>
                                                                                                                            </span>
                                                                                                                            
                                                                                                                            <br/>
                                                                                                                                <span className='text-white fs-2 fw-bold'>
                                                                                                                                    {/* TC: 3.74 */}
                                                                                                                                </span>
                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            <span className='text-white fs-2 fw-bold'>
                                                                                                                            {/* <SymbolDolar numero={}/>  */}
                                                                                                                            <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.valor_total_sumado_soles || 0), 0)}/> 
                                                                                                                            </span>
                                                                                                                                <br/>
                                                                                                                                <span className='text-white fs-2 fw-bold'>
                                                                                                                                    {/* TC: 3.74 */}
                                                                                                                                </span>
                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            <span className='fw-bold ' style={{color: '#1E8727', fontSize: '34px'}}>
                                                                                                                            <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.valor_total_sumado_dolares || 0), 0)}/>
                                                                                                                            </span>
                                                                                                                                <br/>
                                                                                                                                <span className='fs-2 fw-bold' style={{color: '#1E8727', fontSize: '32px'}}>
                                                                                                                                    TC: 3.74
                                                                                                                                </span>
                                                                                                                        </td>
                                                                                                                        {/* <td>
                                                                                                                        </td> */}
                                                                                                                    </tr>
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
  )
}



