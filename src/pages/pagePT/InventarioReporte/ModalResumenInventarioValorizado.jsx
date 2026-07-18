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
          acc[label].valor_total_sumado_dolares += ((item.costo_unitario_dolares*item.cantidad)+item.mano_obra_dolares);
          acc[label].mano_obra_total_sumado_dolares += item.mano_obra_dolares;
          acc[label].mano_obra_total_sumado_soles += item.mano_obra_soles;
          acc[label].stock_final_sumado += item.stock_final;
          acc[label].stock_inicial_sumado += item.stock_inicial;
          acc[label].cantidad += item.cantidad;
          
        
        // Añadimos el item al array `items` del grupo correspondiente
        acc[label].items.push(item);
        
        return acc
    }, {}));
    groupedData = groupedData.sort((a, b) => a.orden-b.orden);
  return (
        <Row>
            <Col xs={12}>
            <Table
                                    // style={{tableLayout: 'fixed'}}
                                    className="table-centered mb-0"
                                    hover
                                    striped
                                    style={{width: '100%'}}
                                    // responsive
                                >
                                    <thead className="bg-primary">
                                        <tr>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '350px'}}>UBICACION</div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '200px'}}>CANTIDAD</div></th>
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '200px'}}></div></th> */}
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px'}}>ACTIVOS <br/> S/.</div></th>
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#1E8727'}}>ACTIVOS <br/>(+M.O) <br/><SymbolDolar/></div></th> */}
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '240px'}}><div style={{width: '240px'}}>MANO DE OBRA <br/> S/.</div></th>
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px'}}>MANO DE OBRA <br/> <SymbolDolar/> </div></th> */}
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '240px'}}><div style={{width: '240px'}}>INVERSION TOTAL <br/> S/.</div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#1E8727'}}>INVERSION <br/> TOTAL <br/><SymbolDolar/></div></th>
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div style={{width: '80px'}}>t.c</div></th> */}
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}>P.C</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            groupedData.filter(f=>f.ubicacion!=='KARAOKE').map(g=>(
                                                <tr>
                                                    <td style={{width: '30px !important'}} className='font-24 p-1 fw-bold text-primary'><div  style={{width: '350px'}}>{g.ubicacion}</div></td>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='text-end' style={{width: '140px'}}>{g.cantidad}</div></th>
                                                    <th style={{width: '30px !important'}} className='font-24 p-1 '><div className='text-end ml-3' style={{width: '140px'}}><NumberFormatMoney amount={g.valor_total_sumado_soles-g.mano_obra_total_sumado_soles}/></div></th>
                                                    {/* <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='fw-bold ml-4 text-end' style={{width: '140px', color: '#1E8727'}}><NumberFormatMoney amount={g.valor_total_sumado_dolares-g.mano_obra_total_sumado_dolares}/></div></th> */}
                                                    <th style={{width: '30px !important'}} className='font-24 p-1 '><div className='text-end ml-3' style={{width: '240px'}}><NumberFormatMoney amount={g.mano_obra_total_sumado_soles}/></div></th>
                                                    {/* <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='fw-bold ml-4 text-end' style={{width: '140px', color: '#1E8727'}}><NumberFormatMoney amount={g.mano_obra_total_sumado_dolares}/></div></th> */}
                                                    {/* <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='text-end' style={{width: '140px'}}>{g.stock_final_sumado}</div></th> */}
                                                    <th style={{width: '30px !important'}} className='font-24 p-1 '><div className='text-end ml-3' style={{width: '240px'}}><NumberFormatMoney amount={g.valor_total_sumado_soles}/></div></th>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='fw-bold ml-4 text-end' style={{width: '140px', color: '#1E8727'}}><NumberFormatMoney amount={g.valor_total_sumado_dolares}/></div></th>
                                                    {/* <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div style={{width: '80px'}}><NumberFormatMoney amount={g.valor_total_sumado_soles/g.valor_total_sumado_dolares}/></div></th> */}
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                    <tfoot className='bg-primary'>
                                    <tr>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '350px'}}>TOTAL<br/>
                                                </div>
                                            </th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div className='' style={{width: '150px'}}>
                                                {/* CANTIDAD */}
                                                <br/>
                                                ITEMS
                                                <br/>
                                                <span>
                                                    {/* <br/> */}
                                                <NumberFormatter amount={groupedData.filter(f=>f.ubicacion!=='KARAOKE').reduce((total, item) => total + (item.cantidad || 0), 0)}/>
                                                </span>
                                                </div>
                                            </th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '160px'}}>
                                                 <br/>ACTIVOS<br/> S/.
                                                {/* <br/> */}
                                                <NumberFormatMoney amount={groupedData.filter(f=>f.ubicacion!=='KARAOKE').reduce((total, item) => total + (item.valor_total_sumado_soles-item.mano_obra_total_sumado_soles || 0), 0)}/> 
                                                </div>
                                            </th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '260px'}}>
                                                <br/>
                                                MANO DE OBRA S/.
                                                <br/>
                                                <NumberFormatMoney amount={groupedData.filter(f=>f.ubicacion!=='KARAOKE').reduce((total, item) => total + (item.mano_obra_total_sumado_soles || 0), 0)}/> 
                                                </div></th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '260px'}}>
                                                <br/>
                                                INVERSION TOTAL S/.
                                                <br/>
                                                <NumberFormatMoney amount={groupedData.filter(f=>f.ubicacion!=='KARAOKE').reduce((total, item) => total + (item.valor_total_sumado_soles || 0), 0)}/> 
                                                </div></th>
                                                {/* <br/> */}
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '160px', color: '#1E8727'}}>INVERSION <br/> TOTAL <br/> <SymbolDolar/>
                                                <NumberFormatMoney amount={groupedData.filter(f=>f.ubicacion!=='KARAOKE').reduce((total, item) => total + (item.valor_total_sumado_dolares || 0), 0)}/>
                                                </div></th>
                                                {/* <br/> */}
                                        </tr>
                                    </tfoot>
                                </Table>
				</Col>
            <Col xs={12}>
            <Table
                                    // style={{tableLayout: 'fixed'}}
                                    className="table-centered mb-0"
                                    hover
                                    striped
                                    style={{width: '100%'}}
                                    // responsive
                                >
                                    <thead className="bg-primary">
                                        <tr>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '350px'}}>UBICACION</div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '200px'}}>CANTIDAD</div></th>
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '200px'}}></div></th> */}
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px'}}>ACTIVOS <br/> S/.</div></th>
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#1E8727'}}>ACTIVOS <br/>(+M.O) <br/><SymbolDolar/></div></th> */}
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '240px'}}><div style={{width: '240px'}}>MANO DE OBRA <br/> S/.</div></th>
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px'}}>MANO DE OBRA <br/> <SymbolDolar/> </div></th> */}
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '240px'}}><div style={{width: '240px'}}>INVERSION TOTAL <br/> S/.</div></th>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '140px'}}><div style={{width: '140px', color: '#1E8727'}}>INVERSION <br/> TOTAL <br/><SymbolDolar/></div></th>
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div style={{width: '80px'}}>t.c</div></th> */}
                                            {/* <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}>P.C</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            groupedData.filter(f=>f.ubicacion==='KARAOKE').map(g=>(
                                                <tr>
                                                    <td style={{width: '30px !important'}} className='font-24 p-1 fw-bold text-primary'><div  style={{width: '350px'}}>{g.ubicacion}</div></td>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='text-end' style={{width: '140px'}}>{g.cantidad}</div></th>
                                                    <th style={{width: '30px !important'}} className='font-24 p-1 '><div className='text-end ml-3' style={{width: '140px'}}><NumberFormatMoney amount={g.valor_total_sumado_soles-g.mano_obra_total_sumado_soles}/></div></th>
                                                    {/* <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='fw-bold ml-4 text-end' style={{width: '140px', color: '#1E8727'}}><NumberFormatMoney amount={g.valor_total_sumado_dolares-g.mano_obra_total_sumado_dolares}/></div></th> */}
                                                    <th style={{width: '30px !important'}} className='font-24 p-1 '><div className='text-end ml-3' style={{width: '240px'}}><NumberFormatMoney amount={g.mano_obra_total_sumado_soles}/></div></th>
                                                    {/* <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='fw-bold ml-4 text-end' style={{width: '140px', color: '#1E8727'}}><NumberFormatMoney amount={g.mano_obra_total_sumado_dolares}/></div></th> */}
                                                    {/* <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='text-end' style={{width: '140px'}}>{g.stock_final_sumado}</div></th> */}
                                                    <th style={{width: '30px !important'}} className='font-24 p-1 '><div className='text-end ml-3' style={{width: '240px'}}><NumberFormatMoney amount={g.valor_total_sumado_soles}/></div></th>
                                                    <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div className='fw-bold ml-4 text-end' style={{width: '140px', color: '#1E8727'}}><NumberFormatMoney amount={g.valor_total_sumado_dolares}/></div></th>
                                                    {/* <th style={{width: '30px !important'}} className='text-center font-24 p-1'><div style={{width: '80px'}}><NumberFormatMoney amount={g.valor_total_sumado_soles/g.valor_total_sumado_dolares}/></div></th> */}
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                    <tfoot className='bg-primary'>
                                    <tr>
                                            <th className='text-white text-center font-24 p-0' style={{margin: '0 !important', width: '20px'}}><div className='' style={{width: '350px'}}>TOTAL<br/>
                                                </div>
                                            </th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div className='' style={{width: '150px'}}>
                                                {/* CANTIDAD */}
                                                <br/>
                                                ITEMS
                                                <br/>
                                                <span>
                                                    {/* <br/> */}
                                                <NumberFormatter amount={groupedData.filter(f=>f.ubicacion==='KARAOKE').reduce((total, item) => total + (item.cantidad || 0), 0)}/>
                                                </span>
                                                </div>
                                            </th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '160px'}}>
                                                 <br/>ACTIVOS<br/> S/.
                                                {/* <br/> */}
                                                <NumberFormatMoney amount={groupedData.filter(f=>f.ubicacion==='KARAOKE').reduce((total, item) => total + (item.valor_total_sumado_soles-item.mano_obra_total_sumado_soles || 0), 0)}/> 
                                                </div>
                                            </th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '260px'}}>
                                                <br/>
                                                MANO DE OBRA S/.
                                                <br/>
                                                <NumberFormatMoney amount={groupedData.filter(f=>f.ubicacion==='KARAOKE').reduce((total, item) => total + (item.mano_obra_total_sumado_soles || 0), 0)}/> 
                                                </div></th>
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '260px'}}>
                                                <br/>
                                                INVERSION TOTAL S/.
                                                <br/>
                                                <NumberFormatMoney amount={groupedData.filter(f=>f.ubicacion==='KARAOKE').reduce((total, item) => total + (item.valor_total_sumado_soles || 0), 0)}/> 
                                                </div></th>
                                                {/* <br/> */}
                                            <th className='text-white text-right font-24 p-0' style={{margin: '0 !important', width: '10px'}}><div style={{width: '160px', color: '#1E8727'}}>INVERSION <br/> TOTAL <br/> <SymbolDolar/>
                                                <NumberFormatMoney amount={groupedData.filter(f=>f.ubicacion==='KARAOKE').reduce((total, item) => total + (item.valor_total_sumado_dolares || 0), 0)}/>
                                                </div></th>
                                                {/* <br/> */}
                                        </tr>
                                    </tfoot>
                                </Table>
				</Col>
        </Row>
  )
}



