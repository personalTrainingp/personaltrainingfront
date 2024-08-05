import { Row, Col, Card, CardTitle } from 'react-bootstrap';
import { Table, PageBreadcrumb } from '@/components';

import { columns, sizePerPageList } from './ColumnsSet';
import { StatisticSeguimiento } from './StatisticSeguimiento';
import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
import { useEffect } from 'react';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import {TableSeguimiento} from './TableSeguimiento';
import { useSelector } from 'react-redux';



export const Seguimiento = () => {
  const { obtenerReporteSeguimiento,agrupado_programas } = useReporteStore()
  const { dataView } = useSelector(e=>e.DATA)
  const { diasLaborables, daysUTC } = helperFunctions()
  useEffect(() => {
    obtenerReporteSeguimiento()
  }, [])
  
const statisticsData = [
	{
		title: '91 clientes',
		noOfProject: '60.67%',
		path: 'rpm50',
		w: 150,
		h: 60,
	},
	{
		title: '91 clientes',
		noOfProject: '60.67%',
		path: 'fs',
		w: 150,
		h: 60,
	},
	{
		title: '91 clientes',
		noOfProject: '60.67%',
		path: 'ms',
		w: 150,
		h: 60,
	},
	{
		title: '91 clientes',
		noOfProject: '60.67%',
		path: 'cyl',
		w: 150,
		h: 70,
	},
];
  return (
    <>
    <PageBreadcrumb title="Seguimientos" subName="Ventas" />
    <Row>
		</Row>
        <Row>
            <Col>
            <Card>
                <Card.Body>
                <TableSeguimiento dae={dataView} statisticsData={agrupado_programas} />
                </Card.Body>
            </Card>
            </Col>
        </Row>
    </>
  )
}
