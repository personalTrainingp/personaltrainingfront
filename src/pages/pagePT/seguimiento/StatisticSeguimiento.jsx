import { Card, Col, Row } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { parsePath } from 'react-router-dom';
import config from '@/config';

export const StatisticSeguimiento = ({statisticsData, data}) => {
    
  return (
    <>
        {(statisticsData).map((statistics, index) => {
            const n_clientes = statistics.todo.length
            const porcent_clientes = data.length
            return (
                <Col lg={4} sm={6} key={n_clientes}>
                    <Card className='rounded-4'>
                        <Card.Body className='p-0'>
                            <CardTitle
                                title={
                                    <Row>
                                        <Col>
                                            <div className="avatar-sm">
                                                <img src={`${config.API_IMG.LOGO}${statistics.tb_programa_training.tb_image?.name_image}`} height={60} width={170} className='px-3'></img>
                                            </div>
                                        </Col>
                                        <Col>
                                            <h5 className="mt-0 mb-1 fs-4">{n_clientes} SOCIOS</h5> 
                                            <p className="mb-0 fs-3">{((n_clientes/porcent_clientes)*100).toFixed(2)}%</p>
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
