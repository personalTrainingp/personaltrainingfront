import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React, { useRef, useState } from 'react'
import { Col, Table, Row } from 'react-bootstrap';

export const ModalReportAsistencia = ({show, onHide, dataEmpl}) => {
  
  return (
    <Dialog
        visible={show}
        onHide={onHide}
        position='top'
        style={{width: '120rem'}}
        header='REPORTE DE ASISTENCIA'
        >
          <h4>PERIODO DESDE: 05/10/2024 </h4>
          <h4>PERIODO HASTA: 05/11/2024 </h4>
          <div>
            <Row>
              <Col xxl={12}>
              
              <h3>SEMANA 01</h3>
                <Table
                            className="table-centered table-normal mb-0"
                        >
                            <thead className="bg-primary">
                                <tr>
                                    <th className='text-white text-center p-1' rowSpan={2} colSpan={1}>FECHA</th>
                                    <th className='text-white text-center p-1' colSpan={2}>HORARIO</th>
                                    <th className='text-white text-center p-1' colSpan={2}>JORNADA REAL</th>
                                    <th className='text-white text-center p-1' colSpan={6}>HORAS</th>
                                    <th className='text-white text-center p-1' colSpan={2}>PERMISOS</th>
                                    <th className='text-white text-center p-1' colSpan={2}>SALIDAS</th>
                                    <th className='text-white text-center p-1' rowSpan={2} colSpan={1}>HORAS EXTRAS</th>
                                </tr>
                                <tr>
                                    <th className='text-white text-center p-1' colSpan={1}>ENTRADA</th>
                                    <th className='text-white text-center p-1' colSpan={1}>SALIDA</th>

                                    <th className='text-white text-center p-1' colSpan={1}>ENTRADA</th>
                                    <th className='text-white text-center p-1' colSpan={1}>SALIDA</th>

                                    <th className='text-white text-center p-1' colSpan={1}>ASIGN.</th>
                                    <th className='text-white text-center p-1' colSpan={1}>ASIST.</th>
                                    <th className='text-white text-center p-1' colSpan={1}>JORNADA</th>
                                    <th className='text-white text-center p-1' colSpan={1}>TARDANZAS</th>
                                    <th className='text-white text-center p-1' colSpan={1}>S. TEMPR.</th>
                                    <th className='text-white text-center p-1' colSpan={1}>AUSENCIA</th>

                                    <th className='text-white text-center p-1' colSpan={1}>CON SUELDO</th>
                                    <th className='text-white text-center p-1' colSpan={1}>SIN SUELDO</th>

                                    <th className='text-white text-center p-1' colSpan={1}>CON SUELDO</th>
                                    <th className='text-white text-center p-1' colSpan={1}>SIN SUELDO</th>
                                    
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <th>SABADO <br/> 05/10</th>
                                    <td>08:00 AM</td>
                                    <td>12:00 PM</td>
                                    <td>08:50 AM</td>
                                    <td>12:10 PM</td>
                                    <td>10H 0M</td>
                                    <td>08H 56M</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th>DOMINGO <br/> 06/10</th>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </tbody>
                    </Table>
                    <br/>
              </Col>
              <Col xxl={2}>
              <Table
                          className="table-centered mb-0"
                      >
                          <thead className="bg-primary">
                              <tr>
                                  <th className='text-white text-center p-1' colSpan={2}>TIEMPO NORMAL</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <th>ASISTENCIA</th>
                                  <td>194:17</td>
                              </tr>
                              <tr>
                                  <th>JORNADA</th>
                                  <td>194:17</td>
                              </tr>
                              <tr>
                                  <th>AUSENCIA</th>
                                  <td>194:17</td>
                              </tr>
                              <tr>
                                  <th>ATRASO</th>
                                  <td>194:17</td>
                              </tr>
                              <tr>
                                  <th>SALIDA TEMPRANA</th>
                                  <td>194:17</td>
                              </tr>
                          </tbody>
                </Table>
              </Col>
              <Col xxl={2}>
              <Table
                          className="table-centered mb-0"
                      >
                          <thead className="bg-primary">
                              <tr>
                                  <th className='text-white text-center p-1' colSpan={2}>TOTAL DE SALIDAS ESPECIALES</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>MARTES 03/10</td>
                                  <td>LUNES 02/10</td>
                              </tr>
                          </tbody>
                </Table>
              </Col>
              <Col xxl={2}>
              <Table
                          className="table-centered mb-0"
                      >
                          <thead className="bg-primary">
                              <tr>
                                  <th className='text-white text-center p-1' colSpan={2}>CANTIDAD</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>MARTES 03/10</td>
                                  <td>LUNES 02/10</td>
                              </tr>
                          </tbody>
                </Table>
              </Col>
              <Col xxl={6}>
              <Table
                          className="table-centered mb-0"
                      >
                          <thead className="bg-primary">
                              <tr>
                                  <th className='text-white text-center p-1' colSpan={2}>HORAS EXTRAS</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>MARTES 03/10</td>
                                  <td>LUNES 02/10</td>
                              </tr>
                          </tbody>
                </Table>
              </Col>
            </Row>
          </div>
    </Dialog>
  )
}

























// import { Button } from 'primereact/button';
// import { Dialog } from 'primereact/dialog'
// import React, { useRef, useState } from 'react'
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { ColumnGroup } from 'primereact/columngroup';
// import { Row } from 'primereact/row';

// export const ModalReportAsistencia = ({show, onHide, dataEmpl}) => {
//   const stepperRef = useRef(null);
//   const [sales] = useState([
//     { product: 'Bamboo Watch', lastYearSale: 51, thisYearSale: 40, lastYearProfit: 54406, thisYearProfit: 43342 },
//     { product: 'Black Watch', lastYearSale: 83, thisYearSale: 9, lastYearProfit: 423132, thisYearProfit: 312122 },
//     { product: 'Blue Band', lastYearSale: 38, thisYearSale: 5, lastYearProfit: 12321, thisYearProfit: 8500 },
//     { product: 'Blue T-Shirt', lastYearSale: 49, thisYearSale: 22, lastYearProfit: 745232, thisYearProfit: 65323 },
//     { product: 'Brown Purse', lastYearSale: 17, thisYearSale: 79, lastYearProfit: 643242, thisYearProfit: 500332 },
//     { product: 'Chakra Bracelet', lastYearSale: 52, thisYearSale: 65, lastYearProfit: 421132, thisYearProfit: 150005 },
//     { product: 'Galaxy Earrings', lastYearSale: 82, thisYearSale: 12, lastYearProfit: 131211, thisYearProfit: 100214 },
//     { product: 'Game Controller', lastYearSale: 44, thisYearSale: 45, lastYearProfit: 66442, thisYearProfit: 53322 },
//     { product: 'Gaming Set', lastYearSale: 90, thisYearSale: 56, lastYearProfit: 765442, thisYearProfit: 296232 },
//     { product: 'Gold Phone Case', lastYearSale: 75, thisYearSale: 54, lastYearProfit: 21212, thisYearProfit: 12533 }
// ]);

// const lastYearSaleBodyTemplate = (rowData) => {
//     return `${rowData.lastYearSale}%`;
// };

// const thisYearSaleBodyTemplate = (rowData) => {
//     return `${rowData.thisYearSale}%`;
// };

// const formatCurrency = (value) => {
//     return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
// };

// const lastYearTotal = () => {
//     let total = 0;

//     for (let sale of sales) {
//         total += sale.lastYearProfit;
//     }

//     return formatCurrency(total);
// };

// const thisYearTotal = () => {
//     let total = 0;

//     for (let sale of sales) {
//         total += sale.thisYearProfit;
//     }

//     return formatCurrency(total);
// };

// const headerGroup = (
//     <ColumnGroup>
//         <Row>
//             <Column header="FECHA" rowSpan={2} colSpan={1} />
//             <Column header="Horario" colSpan={2} />
//             <Column header="Jornada real" colSpan={2} />
//             <Column header="Horas" colSpan={6} />
//             <Column header="Permisos y salidas" colSpan={3} />
//             <Column header="Horas extras" colSpan={1} rowSpan={2}/>
//             <Column header="Horas falta" colSpan={1} rowSpan={2}/>
//             <Column header="tipo de evento" colSpan={2} rowSpan={2}/>
//         </Row>
//         <Row>
//             <Column header="ENTRADA" colSpan={1} />
//             <Column header="SALIDA" colSpan={1} />
//             <Column header="ENTRADA" colSpan={1} />
//             <Column header="SALIDA" colSpan={1} />
//             <Column header="ASIGN." colSpan={1} />
//             <Column header="ASIST." colSpan={1} />
//             <Column header="JORNADA" colSpan={1} />
//             <Column header="ATRASO" colSpan={1} />
//             <Column header="S. TEMP." colSpan={1} />
//             <Column header="AUSENC." colSpan={1} />
//             <Column header="S.J.T" colSpan={1} />
//             <Column header="S.J.N.T" colSpan={1} />
//             <Column header="S.N.J" colSpan={1} />
//             {/* <Column header="" colSpan={1} /> */}
//         </Row>
//     </ColumnGroup>
// );

// const footerGroup = (
//     <ColumnGroup>
//         <Row>
//             <Column footer="Totals:" colSpan={3} footerStyle={{ textAlign: 'right' }} />
//             <Column footer={lastYearTotal} />
//             <Column footer={thisYearTotal} />
//         </Row>
//     </ColumnGroup>
// );
//   return (
//     <Dialog
//         visible={show}
//         onHide={onHide}
//         position='top'
//         style={{width: '110rem', borderRadius: '0 !important'}}
//         header='REPORTE DE ASISTENCIA'
//         >
//           <h4>PERIODO DESDE: 05/10/2024 </h4>
//           <h4>PERIODO HASTA: 05/11/2024 </h4>
//           <div className="card">
//             <DataTable value={sales} headerColumnGroup={headerGroup} tableStyle={{ minWidth: '50rem' }}>
//                 <Column field="product" />
//                 <Column field="lastYearSale" body={lastYearSaleBodyTemplate} />
//                 <Column field="thisYearSale" body={thisYearSaleBodyTemplate} />
//                 <Column field="thisYearSale" body={thisYearSaleBodyTemplate} />
//             </DataTable>
//         </div>
//     </Dialog>
//   )
// }
