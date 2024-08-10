import { Card, Col } from 'react-bootstrap';
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
                <Col xl={3} sm={6} key={n_clientes}>
                    <Card className='rounded-4'>
                        <Card.Body className='p-0'>
                            <CardTitle
                                containerClass="d-flex justify-content-between p-3"
                                title={
                                    <>
                                        <div className="me-4">
                                            <div className="avatar-sm">
                                                <img src={`${config.API_IMG.LOGO}${statistics.tb_programa_training.tb_image.name_image}`} height={70} width={200} className='px-3'></img>
                                            </div>
                                        </div>
                                        <div className="flex-grow-2">
                                            <h5 className="mt-0 mb-1 fs-3">{n_clientes} CLIENTES</h5> 
                                            <p className="mb-0 fs-5">{(n_clientes/porcent_clientes)*100}%</p>
                                        </div>
                                    </>
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
