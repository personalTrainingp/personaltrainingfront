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



export const Seguimiento = () => {
//   const { obtenerReporteSeguimiento,agrupado_programas } = useReporteStore()
//   const { dataView } = useSelector(e=>e.DATA)
//   const { diasLaborables, daysUTC } = helperFunctions()
//   useEffect(() => {
//     obtenerReporteSeguimiento()
//   }, [])
  
  return (
		<>
			<PageBreadcrumb title="Seguimiento" subName="Ventas" />
			<Row></Row>
			<Row>
				<Col>
					<Card>
						<Card.Body>
							<TabView>
								<TabPanel header="CHANGE">
									<Row>
										<Col lg={6} className='border-right-2 border-primary'>
											<h3 className='text-primary'>SOCIOS ACTIVOS</h3>
											<TableSeguimientoTODO classNameFechaVenc={'text-primary fw-bold fs-3'} id_empresa={598} labelFechaVenc={''} labelSesiones={'sesiones'} labelSesionesPendientes={'Sesiones pendientes'} isClienteActive={true}/>
										</Col>
										<Col lg={6} className='border-left-2 border-primary'>
											<h3 className='text-primary'>SOCIOS INACTIVOS</h3>
											<TableSeguimientoTODO classNameFechaVenc={'t'} id_empresa={598} labelFechaVenc={'Fecha de vencimiento'} labelSesiones={'dias'} labelSesionesPendientes={'Dias vencidos'} isClienteActive={false}/>
											{/* <TableSeguimiento id_empresa={598} SeguimientoClienteActivos={false} /> */}
										</Col>
									</Row>
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
