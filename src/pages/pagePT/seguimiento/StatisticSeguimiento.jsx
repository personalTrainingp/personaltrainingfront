import { Card, Col } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { parsePath } from 'react-router-dom';

export const StatisticSeguimiento = ({statisticsData}) => {
  return (
    <>
        {(statisticsData || []).map((statistics, index) => {
            return (
                <Col xl={3} sm={6} key={index.toString()}>
                    <Card className='rounded-4 bg-black'>
                        <Card.Body className='p-0'>
                            <CardTitle
                                containerClass="d-flex justify-content-between p-3"
                                title={
                                    <>
                                        <div className="me-4">
                                            <div className="avatar-sm">
                                                <img src={statistics.path} height={statistics.h} width={statistics.w} className='px-3'></img>
                                            </div>
                                        </div>
                                        <div className="flex-grow-2">
                                            <h5 className="mt-0 mb-1 text-white fs-3">{statistics.title}</h5>
                                            <p className="mb-0 text-white fs-5">{statistics.noOfProject}</p>
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
