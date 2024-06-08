import { Button, Card, Col, Row } from 'react-bootstrap'
import { PageBreadcrumb, Table } from '@/components'
import { columns, sizePerPageList } from './ColumnsSet';
import { asesores } from './data';

const VentasAsesor = () => {
  return (
    <>
    <PageBreadcrumb title={'Ventas por asesor'} subName={'*'} />
    
			<Row>
				<Col xs={12}>
					<Card>
						<Card.Body>
							<Table
								columns={columns}
								data={asesores}
								pageSize={10}
								sizePerPageList={sizePerPageList}
								isSortable={true}
								pagination={true}
								isSelectable={true}
								isSearchable={true}
								tableClass="table-striped"
								theadClass="table-light"
								searchBoxClass="mt-2 mb-3"
							/>
						</Card.Body>
					</Card>
				</Col>
			</Row>
    </>
  )
}

export {VentasAsesor}