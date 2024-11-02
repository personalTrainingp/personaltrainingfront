import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import { Card, Col, Row } from 'react-bootstrap'
import GestGastosFvsV from './ParamsTermGastos'
import { Button } from 'primereact/button';
import { useTerminologiaStore } from '@/hooks/hookApi/useTerminologiaStore'
import { DataTerminologia } from './DataTerminologia'
import { ModalTerminologia } from './modalTerminologia'
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

export const Terminologias = () => {

    const { terminologiaPorEntidad, dataTerminologiaPorEntidad } = useTerminologiaStore();
    console.log(dataTerminologiaPorEntidad);
    const [isModalOpenProv, setisModalOpenProv] = useState(false);
    const {terminologia} = useSelector(e=>e?.TERMINOLOGIA);
    console.log(terminologia);
    // const [selectedParametro, setSelectedParametro] = useState(null);
    // useEffect(() => {
    //     if (selectedParametro) {
            
    //     }
    // }, [selectedParametro]);
    
    useEffect(() => {
        terminologiaPorEntidad();
    }, []);

    //const {dataview} = useSelector(e=>e.DATA)

    const modalProvClose = () => {
        setisModalOpenProv(false)
        //setSelectedParametro(null);
    }
    const modalProvOpen = (terminologia) => {
        dispatch({type:'TERMINOLOGIA', payload:terminologia})

        setisModalOpenProv(true)
        //setSelectedParametro(parametro);
    }
    let count = 0;
    return (
        <>
            <PageBreadcrumb title={`Terminologias`} subName="E" />
            <Row>
                <Col xxl={1}>
                </Col>
                <Col xs={10}>
                    <Card>
                        <Card.Body>
                            <Row>

                                <Col sm={7}>
                                </Col>
                            </Row>
                            <TabView className='overflow-auto'>
                                {
                                    
                                    dataTerminologiaPorEntidad?.parametros?.map((parametro , index) => {
                                        {count++}
                                        return (

                                                <TabPanel  key={`${parametro.entidad_param}-${index}-${count}`} header={parametro.entidad_param}>
                                                    <Col sm={4}>
                                                        <Button label='Agregar Terminologia' onClick={() => modalProvOpen(parametro)} />
                                                    </Col>
                                                    <DataTerminologia  data={parametro.parametros} />
                                                </TabPanel>




                                        )
                                    })

                                }

                            </TabView>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <ModalTerminologia  show={isModalOpenProv} onHide={modalProvClose} ></ModalTerminologia>

        </>
    )
}
