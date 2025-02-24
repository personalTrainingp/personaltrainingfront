import { Card, Col, Row } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { parsePath } from 'react-router-dom';
import config from '@/config';
import { NumberFormatter } from '@/components/CurrencyMask';

export const StatisticSeguimiento = ({statisticsData, data}) => {
    
    return (
        <>
        {(statisticsData).map((statistics, index) => {
            const n_clientes = statistics.todo.length
            const porcent_clientes = data.length

            return (
                <Col lg={4} sm={6} key={n_clientes}>
                    <Card className='rounded-4'>
                        <Card.Body className='p-0 pe-3'>
                            <CardTitle
                                title={
                                    <Row>
                                        <Col>
                                            <div className="avatar-sm">
                                                <img src={`${config.API_IMG.LOGO}${statistics.tb_programa_training.tb_image?.name_image}`} style={{width: statistics.tb_programa_training.tb_image?.width, height: 70}} className='px-3'></img>
                                            </div>
                                        </Col>
                                        <Col>
                                                <p className="mt-0 mb-1 font-24 font-bold text-end"><NumberFormatter amount={n_clientes}/> </p> 
                                                <p className="mb-0 font-24 text-end">{((n_clientes/porcent_clientes)*100).toFixed(2)}%</p>
                                        </Col>
                                    </Row>
                                }
                            />
                        </Card.Body>
                    </Card>
                </Col>
            );
        })}
    </>
  )
}
