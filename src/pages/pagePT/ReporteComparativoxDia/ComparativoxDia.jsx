import { PageBreadcrumb } from '@/components';
import { FormatRangoFecha } from '@/components/componentesReutilizables/FormatRangoFecha';
import { FormatoDateMask } from '@/components/CurrencyMask';
import { Calendar } from 'primereact/calendar';
import React, { useState } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Sortable from 'react-sortablejs';
import SimpleBar from 'simplebar-react';
import { ComparativoxDiaBar } from './ComparativoxDiaBar';
import { ComparativaGeneral } from './ComparativaGeneral';
import { Button } from 'primereact/button';
const registerRangoFecha = {
  fec_select: new Date(),
  fec_desde: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
}
export const ComparativoxDia = () => {
  console.log(registerRangoFecha);
  
  const [rangoFechas, setrangoFechas] = useState({
    fec_desde: '',
    fec_hasta: ''
})
  
	const handleChange = (order) => {
		console.log('Order:', order);
	};
  
      // console.log(rangeDate[0]);
  const onClickFechaRange = ()=>{
      // if(dateRange.fec_desde)
      
      dispatch(setrangoFechas([rangoFechas.fec_desde, rangoFechas.fec_hasta]))
  }
	return (
		<>
			<PageBreadcrumb title="Comparativa por dia" subName="Extended UI" />
      {/* <Row className='d-flex align-items-end'>
          <Col xxl={3}>
              <label className='' style={{fontSize: '28px'}}>
                  FECHA
              </label>
              <Calendar className='' value={rangoFechas.fec_select} locale='es' name='fec_select' onChange={(e)=>setrangoFechas({fec_select: e.value})} showIcon />
          </Col>
          <Col xxl={6} className='' style={{fontSize: '25px'}}>
          <Button onClick={onClickFechaRange} className='m-0 '>actualizar</Button>
          </Col>
      </Row>  */}
			<Row>
				<Col xxl={12}>
        <Row>
              {/* <Col xxl={12} lg={12} className='mb-2'>
                  <ComparativaGeneral/>
              </Col> */}
              <br/>
        <Col xxl={12} lg={12} className=''>
          <SimpleBar style={{ maxHeight: '100%'}} scrollbarMaxSize={320}>
                  <div className='d-flex'>
                    <Col xxl={4} lg={4} className='mx-1'>
                      <Card>
                        <Card.Body>
                            <h2 className='text-center'>miercoles 18 de setiembre del 2024</h2>
                            {/* <ComparativoxDiaBar/> */}
                            <div className="table-responsive mt-4">
                              <Table className="table table-sm mb-0 font-13">
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
                              </Table>
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
