import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { TabPanel, TabView } from 'primereact/tabview';
import React from 'react'
import { Card, Col, Row, Table } from 'react-bootstrap';
// import { TableComprobante } from './TableComprobante';

const agruparPorComprobantes = (data) => {
    return data.reduce((resultado, current) => {
      // Ordenamos los comprobantes para normalizar el grupo
      const comprobantesOrdenados = [...current.comprobantes].sort((a, b) => b-a);
  
      // Buscamos si ya existe un grupo con los mismos comprobantes ordenados
      let grupo = resultado.find((item) =>
        JSON.stringify(item.comprobantes) === JSON.stringify(comprobantesOrdenados)
      );
  
      // Si no existe el grupo, lo creamos
      if (!grupo) {
        grupo = { comprobantes: comprobantesOrdenados, items: [] };
        resultado.push(grupo);
      }
  
      // Agregamos los items al grupo
      grupo.items.push(...current.items);
      return resultado;
    }, []);
  };
  
const agruparPorCliente = (ventas) => {
    return ventas.reduce((resultado, venta) => {
        // const { id_cli } = venta;
        const id_cli = venta?.id_cli;
        let grupo = resultado.find((item) => item.id_cli === id_cli);
    
        if (!grupo) {
          grupo = { id_cli, comprobantes: [], items: [] };
          resultado.push(grupo);
        }
    
        grupo.items.push(venta);
        grupo.comprobantes.push(venta?.id_tipoFactura)
        // console.log(grupo.comprobantes);
        
        return resultado;
      }, []);
  };
  const groupByIdCli = (data) => {
    return data?.reduce((acc, item) => {
      const existingGroup = acc.find(group => group.id_cli === item.id_cli);
      if (existingGroup) {
        existingGroup.items.push(item);
      } else {
        acc.push({ id_cli: item.id_cli, items: [item] });
      }
      return acc;
    }, []);
  };
export const VentasPorComprobante = ({dataGroup}) => {
    dataGroup = dataGroup.map(g=>{
        return {
            id_pgm: g.id_pgm,
            tb_venta: agruparPorComprobantes(agruparPorCliente(g.detalle_ventaMembresium.map(m=>m.tb_ventum))).find(obj => 
                obj.comprobantes.includes(701) && obj.comprobantes.includes(699)
              )||[],
            tb_image: g.tb_image
        }
    })
    // console.log(dataGroup.find(f=>f.id_pgm==2).tb_venta.items.length, "venta");
    
    // console.log(groupByIdCli(dataGroup.find(f=>f.id_pgm==2)?.tb_venta.items), "ventas");
    // console.log(dataGroup);
    
    // console.log((dataGroup), agruparPorCliente(dataGroup), 'aggg');
    
  return (
    <Row>
        <Col xxl={4}>
            <Card>
                <Card.Header className='align-self-center'>
                <img src={`https://archivosluroga.blob.core.windows.net/membresiaavatar/change-avatar.png`} width={350} height={100}/>
                    
                </Card.Header>
                <Card.Body>
                  
                                                      <Table
                                                                          // style={{tableLayout: 'fixed'}}
                                                                          className="table-centered mb-0"
                                                                          hover
                                                                          striped
                                                                          responsive
                                                                      >
                                                                          <tbody>
                                                                                      <tr>
                                                                                              <td className=''>
                                                                                                  <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRASPASOS PT QUE <br/> RENOVARON:</span></li>
                                                                                              </td>
                                                                                              <th>
                                                                                                  <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{dataGroup.find(f=>f.id_pgm==2)?.tb_venta.items ? groupByIdCli(dataGroup.find(f=>f.id_pgm==2)?.tb_venta?.items)?.length: 0}</span>
                                                                                              </th>
                                                                                      </tr>
                                                                                      
                                                                          </tbody>
                                                                      </Table>
                    {/* <div className='text-center d-flex justify-content-between'> */}
                        {/* <h1>TRASPASOS QUE RENOVARON: </h1> */}
                        {/* <h1>{}</h1> */}
                    {/* </div> */}
                </Card.Body>
            </Card>
        </Col>
        <Col xxl={4}>
            <Card>
                <Card.Header className='align-self-center'>
                <img src={`https://archivosluroga.blob.core.windows.net/membresiaavatar/fs-avatar.png`} width={180} height={100}/>
                    
                </Card.Header>
                <Card.Body>
                  
                <Table
                                                                          // style={{tableLayout: 'fixed'}}
                                                                          className="table-centered mb-0"
                                                                          hover
                                                                          striped
                                                                          responsive
                                                                      >
                                                                          <tbody>
                                                                                      <tr>
                                                                                              <td className=''>
                                                                                                  <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRASPASOS PT QUE <br/> RENOVARON:</span></li>
                                                                                              </td>
                                                                                              <th>
                                                                                                  <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{dataGroup.find(f=>f.id_pgm==3)?.tb_venta.items ? groupByIdCli(dataGroup.find(f=>f.id_pgm==3)?.tb_venta?.items)?.length: 0}</span>
                                                                                              </th>
                                                                                      </tr>
                                                                                      
                                                                          </tbody>
                                                                      </Table>
                    {/* <div className='text-center d-flex justify-content-between'>
                        <h1>TRASPASOS QUE RENOVARON: </h1>

                        <h1></h1>
                    </div> */}
                </Card.Body>
            </Card>
        </Col>
        <Col xxl={4}>
            <Card>
                <Card.Header className='align-self-center'>
                <img src={`https://archivosluroga.blob.core.windows.net/membresiaavatar/muscle-avatar.png`}  width={300} height={100}/>
                    
                </Card.Header>
                <Card.Body>
                  
                <Table
                                                                          // style={{tableLayout: 'fixed'}}
                                                                          className="table-centered mb-0"
                                                                          hover
                                                                          striped
                                                                          responsive
                                                                      >
                                                                          <tbody>
                                                                                      <tr>
                                                                                              <td className=''>
                                                                                                  <li className='d-flex flex-row justify-content-between p-2'><span className='fw-bold text-primary fs-2'>TRASPASOS PT QUE <br/> RENOVARON:</span></li>
                                                                                              </td>
                                                                                              <th>
                                                                                                  <span style={{fontSize: '40px'}} className='d-flex justify-content-end align-content-end align-items-end'>{dataGroup.find(f=>f.id_pgm==4)?.tb_venta.items ? groupByIdCli(dataGroup.find(f=>f.id_pgm==4)?.tb_venta?.items)?.length: 0}</span>
                                                                                              </th>
                                                                                      </tr>
                                                                                      
                                                                          </tbody>
                                                                      </Table>
                    {/* <div className='text-center d-flex justify-content-between'>
                        <h1>TRASPASOS QUE RENOVARON: </h1>
                        <h1>{dataGroup.find(f=>f.id_pgm==4)?.tb_venta.items ? groupByIdCli(dataGroup.find(f=>f.id_pgm==4)?.tb_venta?.items)?.length: 0}</h1>
                    </div> */}
                </Card.Body>
            </Card>
        </Col>
    </Row>
  )
}
