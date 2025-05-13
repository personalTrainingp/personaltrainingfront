import { Row, Col, Card, CardTitle } from 'react-bootstrap';
import { Table, PageBreadcrumb } from '@/components';

import { columns, sizePerPageList } from './ColumnsSet';
import { StatisticSeguimiento } from './StatisticSeguimiento';
import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
import { useEffect } from 'react';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import {TableSeguimiento} from './TableSeguimiento';
import { useSelector } from 'react-redux';
import { TabPanel, TabView } from 'primereact/tabview';
import { TableSeguimientoTODO } from './TableSeguimientoTODO';
import SimpleBar from 'simplebar-react';



export const Seguimiento = () => {
//   const { obtenerReporteSeguimiento,agrupado_programas } = useReporteStore()
//   const { dataView } = useSelector(e=>e.DATA)
//   const { diasLaborables, daysUTC } = helperFunctions()
//   useEffect(() => {
//     obtenerReporteSeguimiento()
//   }, [])
//RENOVACIONES HASTA EL 4 MES 
//REINSCRIPCIONES 4MESES Y UN DIA
  
  return (
		<>
			<PageBreadcrumb title="ACTIVOS - RENOVACIONES - REINSCRIPCIONES" subName="Ventas" />
			<Row></Row>
			<Row>
				<Col>
					<Card>
						<Card.Body>
							<TabView>
								<TabPanel header="CHANGE">
									<SimpleBar
											style={{
											  maxWidth: '100%',        // ancho total
											  overflowX: 'auto',       // scroll horizontal
											  overflowY: 'hidden'      // sin scroll vertical
											}}
											autoHide={false}
											forceVisible="x"           // fuerza siempre visible el scrollbar X
										  >
											{/* Row de Bootstrap como flex, pero sin wrap */}
											<Row
											  style={{
												display: 'flex',
												flexWrap: 'nowrap',     // sin saltos de línea
												gap: '1rem'             // espacio entre columnas (puedes usar gx-3)
											  }}
											>
												<Col lg={6} className='border-right-2 border-primary'>
													{/* <h3 className='text-primary'>SOCIOS ACTIVOS</h3> */}
													<TableSeguimientoTODO h3Title={<span className='text-primary'>SOCIOS ACTIVOS</span>} classNameFechaVenc={'text-primary fw-bold fs-3'} id_empresa={598} labelFechaVenc={''} labelSesiones={'sesiones'} labelSesionesPendientes={'Sesiones pendientes'} isClienteActive={true}/>
												</Col>
												<Col lg={6} className='border-left-2 border-primary'>
													{/* <h3 className='text-primary'>RENOVACIONES PENDIENTES TOTAL</h3> */}
													<TableSeguimientoTODO h3Title={<span className='text-primary'>RENOVACIONES VENCIDAS</span>} classNameFechaVenc={'t'} id_empresa={598} labelFechaVenc={'Fecha de vencimiento'} labelSesiones={'dias'} labelSesionesPendientes={'Dias vencidos'} clasific={'reno'} isClienteActive={false}/>
													{/* <TableSeguimiento id_empresa={598} SeguimientoClienteActivos={false} /> */}
												</Col>
												<Col lg={6} className='border-left-2 border-primary'>
													<TableSeguimientoTODO h3Title={<span className='text-primary'>REINSCRIPCIONES VENCIDAS</span>} classNameFechaVenc={'t'} id_empresa={598} labelFechaVenc={'Fecha de vencimiento'} labelSesiones={'dias'} labelSesionesPendientes={'Dias vencidos'} clasific={'rei'} isClienteActive={false}/>
													{/* <TableSeguimiento id_empresa={598} SeguimientoClienteActivos={false} /> */}
												</Col>
											</Row>
										  </SimpleBar>
									{/* <Row>
										<Col lg={6} className='border-right-2 border-primary'>
											<h3 className='text-primary'>SOCIOS ACTIVOS</h3>
											<TableSeguimientoTODO classNameFechaVenc={'text-primary fw-bold fs-3'} id_empresa={598} labelFechaVenc={''} labelSesiones={'sesiones'} labelSesionesPendientes={'Sesiones pendientes'} isClienteActive={true}/>
										</Col>
										<Col lg={6} className='border-left-2 border-primary'>
											<h3 className='text-primary'>SOCIOS INACTIVOS</h3>
											<TableSeguimientoTODO classNameFechaVenc={'t'} id_empresa={598} labelFechaVenc={'Fecha de vencimiento'} labelSesiones={'dias'} labelSesionesPendientes={'Dias vencidos'} isClienteActive={false}/>
										</Col>
									</Row> */}
								</TabPanel>
								<TabPanel header="HISTORICO">
									<Row>
										<Col lg={6} className='border-right-2 border-primary'>
											<h3 className='text-primary'>SOCIOS ACTIVOS</h3>
											<TableSeguimientoTODO id_empresa={0}/>
										</Col>
										<Col lg={6} className='border-left-2 border-primary'>
											<h3 className='text-primary'>SOCIOS INACTIVOS</h3>
											<TableSeguimientoTODO id_empresa={0} labelSesionesPendientes={'dias vencidos'} isClienteActive={false}/>
											{/* <TableSeguimiento SeguimientoClienteActivos={false} id_empresa={0} /> */}
										</Col>
									</Row>
								</TabPanel>
							</TabView>
						</Card.Body>
					</Card>
				</Col>
			</Row>
		</>
  );
}
