import { Card, Col, Row } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { formateo_Moneda, NumberFormatter } from '@/components/CurrencyMask';

export const Statistics2 = ({statisticsData, id_programa}) => {
  
	const formatCurrency = (value) => {
		return value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });
	};
  const dataTest = [
    {
      title: 'VENTA ACUMULADA (S/.)',
      noOfProject: formateo_Moneda(statisticsData.ventas_acumuladas?statisticsData.ventas_acumuladas:0),
    },
    {
      title: 'VENTA ACUMULADA ($.)',
      noOfProject: 0,
    },
    {
      title: 'CANTIDAD DE CONTRATOS',
      noOfProject: <NumberFormatter amount={statisticsData.cantidad_contratos}/> ,
    },
    {
      title: 'TICKET MEDIO (S/.)',
      noOfProject: formateo_Moneda(statisticsData.ticket_medio?statisticsData.ticket_medio:0),
    },
    {
      title: `SEMANAS VENDIDAS ${id_programa!=0?'POR PROGRAMA':''}`,
      noOfProject: <NumberFormatter amount={statisticsData.semanas_vendidas_programa} splitCaracter={'.'}/>,
    },
    {
      title: `SESIONES VENDIDAS ${id_programa!=0?`POR PROGRAMA`:''}`,
      noOfProject: <NumberFormatter amount={statisticsData.semanas_vendidas_programa*5} splitCaracter={'.'}/>,
    },
    {
      title: `TICKET POR SESION ${id_programa!=0?`POR PROGRAMA`:''}`,
      noOfProject: <NumberFormatter amount={(statisticsData.ventas_acumuladas)/(statisticsData.semanas_vendidas_programa*5)} splitCaracter={','}/>,
    },
    {
      title: 'TICKET PROM SEMANAS',
      noOfProject: <NumberFormatter amount={statisticsData.ticket_prom_semanas} splitCaracter={','}/>,
    },

  ];
  return (
    <>
        <Row className='d-flex justify-content-center'>
        {(dataTest || []).map((statistics, index) => {
				return (
					<Col xl={4} sm={6} key={index.toString()}>
						<Card>
							<Card.Body>
								<CardTitle
									containerClass="d-flex align-items-center justify-content-between"
									title={
										<>
											<div className="flex-grow-1" style={{height: '80px'}}>
												<h4 className="mt-0 mb-1 font-15" style={{height: '50px'}}>{statistics.title}</h4>
												<p className="mb-0 font-20">{statistics.noOfProject}</p>
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
