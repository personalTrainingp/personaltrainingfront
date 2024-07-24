import { Row, Col, Card, CardTitle } from 'react-bootstrap';
import { Table, PageBreadcrumb } from '@/components';

import { columns, sizePerPageList } from './ColumnsSet';
import { StatisticSeguimiento } from './StatisticSeguimiento';
import { statisticsData } from '../data';
import { useReporteStore } from '@/hooks/hookApi/useReporteStore';
import { useEffect } from 'react';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import {TableSeguimiento} from './TableSeguimiento';
import { useSelector } from 'react-redux';



export const Seguimiento = () => {
  const { obtenerReporteSeguimiento } = useReporteStore()
  const { dataView } = useSelector(e=>e.DATA)
  const { diasLaborables, daysUTC } = helperFunctions()
  useEffect(() => {
    obtenerReporteSeguimiento()
  }, [])
  console.log(dataView);
  return (
    <>
    <PageBreadcrumb title="Seguimientos" subName="Ventas" />
    <Row>
				<StatisticSeguimiento statisticsData={statisticsData} />
		</Row>
        <Row>
            <Col>
            <Card>
                <Card.Body>
                <TableSeguimiento dae={dataView} />
                </Card.Body>
            </Card>
            </Col>
        </Row>
    </>
  )
}
