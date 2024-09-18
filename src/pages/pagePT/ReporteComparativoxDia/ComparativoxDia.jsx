import { PageBreadcrumb } from '@/components';
import { FormatRangoFecha } from '@/components/componentesReutilizables/FormatRangoFecha';
import { FormatoDateMask } from '@/components/CurrencyMask';
import { Calendar } from 'primereact/calendar';
import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sortable from 'react-sortablejs';
import SimpleBar from 'simplebar-react';
import { ComparativoxDiaBar } from './ComparativoxDiaBar';
import { ComparativaGeneral } from './ComparativaGeneral';

export const ComparativoxDia = () => {

  const [rangoFechas, setrangoFechas] = useState(new Date())
  
	const handleChange = (order) => {
		console.log('Order:', order);
	};
	return (
		<>
			<PageBreadcrumb title="Comparativa por dia" subName="Extended UI" />

			<Row>
				<Col xxl={12}>
					<h1 className="text-center">COMPARATIVA POR PROGRAMAS
          </h1>
          <div className='my-2 text-center'>
            <Calendar style={{height: '45px'}} value={rangoFechas} onChange={(e)=>setrangoFechas(e.value)} placeholder='dd-mm-yyyy' locale='es' showIcon/>
            <span className='m-2 font-24'>
              <strong>
                {FormatoDateMask(rangoFechas, "dddd D [de] MMMM [del] YYYY ")} 
              </strong>
            </span>
          </div>
				</Col>
				<Col xxl={12}>
        <Row>
              <Col xxl={12} lg={12} className='mb-2'>
                  <ComparativaGeneral/>
              </Col>
        <Col xxl={12} lg={12} className=''>
          <SimpleBar style={{ maxHeight: '100%'}} scrollbarMaxSize={320}>
                  <div className='d-flex'>
                    <Col xxl={4} lg={4} className='mx-1'>
                      <Card>
                        <Card.Body>
                            <h5 className='text-center'>Mes Actual: miercoles 18 de setiembre del 2024</h5>
                            <ComparativoxDiaBar/>
                            <div className="table-responsive mt-4">
                              <table className="table table-sm mb-0 font-13">
                                <thead>
                                  <tr>
                                    <th>PROGRAMAS</th>
                                    <th>CANTIDAD</th>
                                    <th>MONTO</th>
                                    <th>TICKET MEDIO</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>CHANGE 45</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                  <tr>
                                    <td>FS 45</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                  <tr>
                                    <td>MUSCLE</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                  <tr>
                                    <td>TOTAL</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col xxl={4} lg={4} className='mx-1'>
                      <Card>
                        <Card.Body>
                            <h5 className='text-center'>Mes Anterior: domingo 18 de agosto del 2024</h5>
                            <ComparativoxDiaBar/>
                            <div className="table-responsive mt-4">
                              <table className="table table-sm mb-0 font-13">
                                <thead>
                                  <tr>
                                    <th>PROGRAMAS</th>
                                    <th>CANTIDAD</th>
                                    <th>MONTO</th>
                                    <th>TICKET MEDIO</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>CHANGE 45</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                  <tr>
                                    <td>FS 45</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                  <tr>
                                    <td>MUSCLE</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                  <tr>
                                    <td>TOTAL</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col xxl={4} lg={4} className='mx-1'>
                      <Card>
                        <Card.Body>
                            <h5 className='text-center'>Personalizado: Lunes 18 de marzo del 2024</h5>
                            <ComparativoxDiaBar/>
                            <div className="table-responsive mt-4">
                              <table className="table table-sm mb-0 font-13">
                                <thead>
                                  <tr>
                                    <th>PROGRAMAS</th>
                                    <th>CANTIDAD</th>
                                    <th>MONTO</th>
                                    <th>TICKET MEDIO</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>CHANGE 45</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                  <tr>
                                    <td>FS 45</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                  <tr>
                                    <td>MUSCLE</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                  <tr>
                                    <td>TOTAL</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col xxl={4} lg={4} className='mx-1'>
                      <Card>
                        <Card.Body>
                            <h5 className='text-center'>Personalizado: Viernes 18 de octubre del 2024</h5>
                            <ComparativoxDiaBar/>
                            <div className="table-responsive mt-4">
                              <table className="table table-sm mb-0 font-13">
                                <thead>
                                  <tr>
                                    <th>PROGRAMAS</th>
                                    <th>CANTIDAD</th>
                                    <th>MONTO</th>
                                    <th>TICKET MEDIO</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>CHANGE 45</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                  <tr>
                                    <td>FS 45</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                  <tr>
                                    <td>MUSCLE</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                  <tr>
                                    <td>TOTAL</td>
                                    <td>5</td>
                                    <td>S/. 7,094.00</td>
                                    <td>S/. 1,418.80</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </div>
          </SimpleBar>
        </Col>
        </Row>
				</Col>
			</Row>
		</>
	);
};
