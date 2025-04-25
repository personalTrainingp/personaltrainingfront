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
            acc[label] = { 
                ubicacion: label, 
                tb_images: item.parametro_lugar_encuentro?.tb_images, 
                orden: item.parametro_lugar_encuentro?.orden_param, 
                mano_obra_total_sumado_soles: 0,
                mano_obra_total_sumado_dolares: 0,
                valor_total_sumado_soles: 0, 
                valor_total_sumado_dolares: 0, 
                stock_final_sumado: 0, 
                stock_inicial_sumado: 0, 
                cantidad: 0, 
                items: [] 
            };
          }
          
          // Sumamos el valor_total del item actual al grupo correspondiente
          acc[label].valor_total_sumado_soles += (item.costo_unitario_soles*item.cantidad)+item.mano_obra_soles;
          acc[label].valor_total_sumado_dolares += ((item.costo_unitario_soles*item.cantidad)+item.mano_obra_soles)/3.65;
          acc[label].mano_obra_total_sumado_dolares += item.mano_obra_soles/3.65;
          acc[label].mano_obra_total_sumado_soles += item.mano_obra_soles;
          acc[label].stock_final_sumado += item.stock_final;
          acc[label].stock_inicial_sumado += item.stock_inicial;
          acc[label].cantidad += item.cantidad;
          
        
        // Añadimos el item al array `items` del grupo correspondiente
        acc[label].items.push(item);
        
        return acc
    }, {}));
    groupedData = groupedData.sort((a, b) => b.valor_total_sumado_soles-a.valor_total_sumado_soles);
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
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '200px'}}>CANTIDAD</div></th>
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '200px'}}></div></th> */}
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px'}}>ACTIVOS <br/>(+M.O) <br/> S/.</div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#1E8727'}}>ACTIVOS <br/>(+M.O) <br/><SymbolDolar/></div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px'}}>MANO DE OBRA <br/> S/.</div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px'}}>MANO DE OBRA <br/> <SymbolDolar/> </div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px'}}>INVERSION <br/> TOTAL <br/> S/.</div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#1E8727'}}>INVERSION <br/> TOTAL <br/><SymbolDolar/></div></th>
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div style={{width: '80px'}}>t.c</div></th> */}
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}>P.C</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            groupedData.map(g=>(
                                                <tr>
                                                    <td style={{width: '30px !important'}} className='font-24 p-1 fw-bold text-primary'><div  style={{width: '350px'}}>{g.ubicacion}</div></td>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='text-end' style={{width: '140px'}}>{g.cantidad}</div></th>
                                                    <th style={{width: '30px !important'}} className='font-24 p-1 '><div className='text-end ml-3' style={{width: '140px'}}><NumberFormatMoney amount={g.valor_total_sumado_soles-g.mano_obra_total_sumado_soles}/></div></th>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='fw-bold ml-4 text-end' style={{width: '140px', color: '#1E8727'}}><NumberFormatMoney amount={g.valor_total_sumado_dolares-g.mano_obra_total_sumado_dolares}/></div></th>
                                                    <th style={{width: '30px !important'}} className='font-24 p-1 '><div className='text-end ml-3' style={{width: '140px'}}><NumberFormatMoney amount={g.mano_obra_total_sumado_soles}/></div></th>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='fw-bold ml-4 text-end' style={{width: '140px', color: '#1E8727'}}><NumberFormatMoney amount={g.mano_obra_total_sumado_dolares}/></div></th>
                                                    {/* <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='text-end' style={{width: '140px'}}>{g.stock_final_sumado}</div></th> */}
                                                    <th style={{width: '30px !important'}} className='font-24 p-1 '><div className='text-end ml-3' style={{width: '140px'}}><NumberFormatMoney amount={g.valor_total_sumado_soles}/></div></th>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='fw-bold ml-4 text-end' style={{width: '140px', color: '#1E8727'}}><NumberFormatMoney amount={g.valor_total_sumado_dolares}/></div></th>
                                                    {/* <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div style={{width: '80px'}}><NumberFormatMoney amount={g.valor_total_sumado_soles/g.valor_total_sumado_dolares}/></div></th> */}
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                    <tfoot className='bg-primary'>
                                    <tr>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '350px'}}>TOTAL<br/>
                                                <br/>
                                                <span>
                                                    <br/>
                                                    T.C: 3.65
                                                </span></div></th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div className='' style={{width: '150px'}}>
                                                CANTIDAD
                                                <br/>
                                                ITEMS
                                                <br/>
                                                <span>
                                                    <br/>
                                                <NumberFormatter amount={groupedData.reduce((total, item) => total + (item.cantidad || 0), 0)}/>
                                                </span>
                                                </div>
                                            </th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '160px'}}>
                                                ACTIVOS <br/>(+M.O) <br/> S/.
                                                <br/>
                                                <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.valor_total_sumado_soles-item.mano_obra_total_sumado_soles || 0), 0)}/> 
                                                </div>
                                            </th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '160px', color: '#1E8727'}}>ACTIVOS <br/>(+M.O) <br/><SymbolDolar/>
                                            <br/>
                                            <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.valor_total_sumado_dolares-item.mano_obra_total_sumado_dolares || 0), 0)}/>
                                            </div></th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '160px'}}>MANO DE<br/> OBRA <br/> S/.
                                                <br/>
                                                <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.mano_obra_total_sumado_soles || 0), 0)}/> 
                                                </div></th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '160px', color: '#1E8727'}}>MANO DE <br/> OBRA <br/> <SymbolDolar/> 
                                                <br/>
                                                <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.mano_obra_total_sumado_dolares || 0), 0)}/>
                                            </div></th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '160px'}}>INVERSION <br/> TOTAL <br/> S/.
                                                <br/>
                                                <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.valor_total_sumado_soles || 0), 0)}/> 
                                                </div></th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '160px', color: '#1E8727'}}>INVERSION <br/> TOTAL <br/> <SymbolDolar/>
                                                <br/>
                                                <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.valor_total_sumado_dolares || 0), 0)}/>
                                                </div></th>
                                        </tr>
                                    </tfoot>
                                    {/* <tr className='bg-primary text-white'>
                                            <td className='text-white text-center font-20 p-0 fw-bold' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '350px'}}></div></td>
                                            <td className='text-white text-center font-20 p-0 fw-bold' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '200px', color: '#FFF'}}>CANTIDAD</div></td>
                                            <td className='text-white text-center font-20 p-0 fw-bold' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#FFF'}}>ACTIVOS <br/>(+M.O) <br/> S/.</div></td>
                                            <td className='text-white text-center font-20 p-0 fw-bold' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#1E8727'}}>ACTIVOS <br/>(+M.O) <br/> <SymbolDolar/></div></td>
                                            <td className='text-white text-center font-20 p-0 fw-bold' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#FFF'}}>MANO DE OBRA S/.</div></td>
                                            <td className='text-white text-center font-20 p-0 fw-bold' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#FFF'}}>MANO DE OBRA <SymbolDolar/> </div></td>
                                            <td className='text-white text-center font-20 p-0 fw-bold' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#FFF'}}>INVERSION TOTAL S/.</div></td>
                                            <td className='text-white text-center font-20 p-0 fw-bold' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#1E8727'}}>INVERSION TOTAL <SymbolDolar/></div></td>
                                        </tr> */}
                                    {/* <tr className='bg-primary text-white'>
                                                                                                                        <td>
                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            <span className='text-white fs-3 fw-bold ml-7'>
                                                                                                                            CANT.
                                                                                                                            </span>
                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            <span className='text-white fs-3 fw-bold'>
                                                                                                                            	    INVERSION S/.
                                                                                                                            </span>
                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            <span className='fw-bold ' style={{color: '#1E8727', fontSize: '25px'}}>
                                                                                                                            INVERSION $.
                                                                                                                            </span>
                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            <span className='text-white fs-3 fw-bold'>
                                                                                                                            MANO DE OBRA S/.
                                                                                                                            
                                                                                                                            </span>
                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            <span className='fw-bold ' style={{color: '#1E8727', fontSize: '25px'}}>
                                                                                                                            MANO DE OBRA $.
                                                                                                                            </span>
                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            <span className='text-white fs-3 fw-bold'>
                                                                                                                            INVERSION TOTAL S/.
                                                                                                                            </span>
                                                                                                                        </td>
                                                                                                                        <td>
                                                                                                                            <span className='fw-bold ' style={{color: '#1E8727', fontSize: '25px'}}>
                                                                                                                            INVERSION TOTAL $.
                                                                                                                            </span>
                                                                                                                        </td>
                                                                                                                    </tr> */}


                                                                                                            {/* <tr className='bg-primary text-white'>
                                                                                                                        <th>
                                                                                                                                <span className='fs-2 fw-bold' style={{color: '#1E8727', fontSize: '32px'}}>
                                                                                                                                    TC: 3.65
                                                                                                                                </span>
                                                                                                                            <br/>
                                                                                                                            <span className='text-white fs-2 fw-bold'>
                                                                                                                                TOTAL
                                                                                                                            </span>
                                                                                                                        </th>
                                                                                                                        <th className='h-0 bg-danger'>
                                                                                                                            <div className='bg-black'>
                                                                                                                                <span className='text-white fs-2 fw-bold ml-7'>
                                                                                                                                <NumberFormatter amount={groupedData.reduce((total, item) => total + (item.cantidad || 0), 0)}/>
                                                                                                                                </span>
                                                                                                                            </div>
                                                                                                                        </th>
                                                                                                                        <th>
                                                                                                                            <span className='text-white fs-2 fw-bold'>
                                                                                                                            <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.valor_total_sumado_soles-item.mano_obra_total_sumado_soles || 0), 0)}/> 
                                                                                                                            </span>
                                                                                                                        </th>
                                                                                                                        <th>
                                                                                                                            <span className='fw-bold ' style={{color: '#1E8727', fontSize: '34px'}}>
                                                                                                                            <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.valor_total_sumado_dolares-item.mano_obra_total_sumado_dolares || 0), 0)}/>
                                                                                                                            </span>
                                                                                                                        </th>
                                                                                                                        <th>
                                                                                                                            <span className='text-white fs-2 fw-bold' style={{fontSize: '34px'}}>
                                                                                                                            <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.mano_obra_total_sumado_soles || 0), 0)}/> 
                                                                                                                            </span>
                                                                                                                        </th>
                                                                                                                        <th>
                                                                                                                            <span className='fw-bold ' style={{color: '#1E8727', fontSize: '34px'}}>
                                                                                                                            <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.mano_obra_total_sumado_dolares || 0), 0)}/>
                                                                                                                            </span>
                                                                                                                        </th>
                                                                                                                        <th>
                                                                                                                            <span className='text-white fs-2 fw-bold'>
                                                                                                                            <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.valor_total_sumado_soles || 0), 0)}/> 
                                                                                                                            </span>
                                                                                                                        </th>
                                                                                                                        <th>
                                                                                                                            <span className='fw-bold ' style={{color: '#1E8727', fontSize: '34px'}}>
                                                                                                                            <NumberFormatMoney amount={groupedData.reduce((total, item) => total + (item.valor_total_sumado_dolares || 0), 0)}/>
                                                                                                                            </span>
                                                                                                                        </th>
                                                                                                                    </tr> */}
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



