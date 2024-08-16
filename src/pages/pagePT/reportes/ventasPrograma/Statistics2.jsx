import { Card, Col, Row } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { formateo_Moneda } from '@/components/CurrencyMask';

export const Statistics2 = ({statisticsData}) => {

	const formatCurrency = (value) => {
		return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
	};
  const dataTest = [
    {
      title: 'VENTA ACUMULADA ($.)',
      noOfProject: formateo_Moneda(statisticsData.ventas_acumuladas?statisticsData.ventas_acumuladas:0),
    },
    {
      title: 'VENTA ACUMULADA (S/.)',
      noOfProject: formateo_Moneda(statisticsData.ventas_acumuladas?statisticsData.ventas_acumuladas:0),
    },
    {
      title: 'TICKET MEDIO (S/.)',
      noOfProject: formateo_Moneda(statisticsData.ticket_medio?statisticsData.ticket_medio:0),
    },
    {
      title: 'CANTIDAD DE CONTRATOS',
      noOfProject: statisticsData.cantidad_contratos,
    },{
      title: 'SEMANAS VENDIDAS POR PROGRAMA',
      noOfProject: statisticsData.semanas_vendidas_programa,
    },
    {
      title: 'TICKET PROM SEMANAS',
      noOfProject: statisticsData.ticket_prom_semanas,
    },

  ];
  return (
    <>
        <Row className='d-flex justify-content-center'>
        {(dataTest || []).map((statistics, index) => {
				return (
					<Col xl={2} sm={6} key={index.toString()}>
						<Card>
							<Card.Body>
								<CardTitle
									containerClass="d-flex align-items-center justify-content-between"
									title={
										<>
											<div className="flex-grow-1" style={{height: '80px'}}>
												<h4 className="mt-0 mb-1 font-15" style={{height: '50px'}}>{statistics.title}</h4>
												<p className="mb-0">{statistics.noOfProject}</p>
											</div>
										</>
									}
								/>
							</Card.Body>  
						</Card>
					</Col>
				);
			})}
        </Row>
    </>
  )
}
