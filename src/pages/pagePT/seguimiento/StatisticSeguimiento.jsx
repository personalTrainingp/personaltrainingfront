import { Card, Col, Row } from 'react-bootstrap';
import classNames from 'classnames';
import { CardTitle } from '@/components';
import { parsePath } from 'react-router-dom';
import config from '@/config';
import { NumberFormatter } from '@/components/CurrencyMask';
import { useMemo, useState } from 'react';

export const StatisticSeguimiento = ({h3Title, text_search, statisticsData, data, dataFiltered=[]}) => {
    console.log({dataFiltered, statisticsData});
    const stat = (statisticsData).map((statistics, index) => {
        const n_clientes = statistics.todo.length
        const porcent_clientes = data.length
        return {
            n_clientes,
            porcent_clientes,
        }
    })
      // 1) Total de clientes pendientes (suma de todos los statistics.todo.length)
        const totalClientesPendientes = useMemo(
            () => statisticsData.reduce((sum, stat) => sum + stat.todo.length, 0),
            [statisticsData]
        )
        
      // 2) Total de clientes pendientes (suma de todos los statistics.todo.length)
      const totalClientesPendientesxFilter = useMemo(
        () => dataFiltered.reduce((sum, stat) => sum + stat.todo.length, 0),
        [dataFiltered]
    )


    return (
        <>
        <div className='fs-2 fw-bold text-primary'>{h3Title} <span className='fs-1 text-black'>TOTAL {totalClientesPendientes}</span></div>
        {(statisticsData).map((statistics, index) => {
            const n_clientes = statistics.todo.length
            const porcent_clientes = data.length

            return (
                <>
                <Col lg={4} sm={6} key={n_clientes}>
                    <Card className='rounded-4'>
                        <Card.Body className='p-0 pe-3'>
                            <CardTitle
                                title={
                                    <Row>
                                        <Col>
                                            <div className="avatar-sm">
                                                <img src={`${config.API_IMG.LOGO}${statistics.tb_programa_training.tb_image?.name_image}`} style={{width: statistics.tb_programa_training.tb_image?.width, height: 50}} className='px-3'></img>
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
                </>
            );
        })}
        <div className='fs-2 fw-bold text-primary'>{h3Title}  <span className='fs-1 text-black'>{text_search} {totalClientesPendientesxFilter}</span></div>
        {(dataFiltered).map((statistics, index) => {
            const n_clientes = statistics.todo.length
            const porcent_clientes = data.length

            return (
                <>
                <Col lg={4} sm={6} key={n_clientes}>
                    <Card className='rounded-4'>
                        <Card.Body className='p-0 pe-3'>
                            <CardTitle
                                title={
                                    <Row>
                                        <Col>
                                            <div className="avatar-sm">
                                                <img src={`${config.API_IMG.LOGO}${statistics.tb_programa_training.tb_image?.name_image}`} style={{width: statistics.tb_programa_training.tb_image?.width, height: 50}} className='px-3'></img>
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
                </>
            );
        })}
    </>
  )
}
