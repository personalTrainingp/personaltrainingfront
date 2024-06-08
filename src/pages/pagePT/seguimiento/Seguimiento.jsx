import { Row, Col, Card, CardTitle } from 'react-bootstrap';
import { Table, PageBreadcrumb } from '@/components';

import { useOrders } from '../hooks';
import { columns, sizePerPageList } from './ColumnsSet';
import { StatisticSeguimiento } from './StatisticSeguimiento';
import { statisticsData } from '../data';

export const Seguimiento = () => {
  const { orderList, changeOrderStatusGroup } = useOrders();
  return (
    <>
    <PageBreadcrumb title="Seguimiento" subName="Ventas" />
    <Row>
				<StatisticSeguimiento statisticsData={statisticsData} />
		</Row>
        <Row>
            <Col>
            <Card>
                <Card.Body>
                <Table
                  columns={columns}
                  data={orderList}
                  pageSize={10}
                  sizePerPageList={sizePerPageList}
                  isSortable={true}
                  pagination={true}
                  isSearchable={true}
                  theadClass="table-light"
                  searchBoxClass="mb-2"
                />
                </Card.Body>
            </Card>
            </Col>
        </Row>
    </>
  )
}
