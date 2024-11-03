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
import { useDispatch } from 'react-redux';
import { onSetTerminologia } from '@/store/dataTerminologia/terminologiaSlice';

export const Terminologias = () => {

    
    const { terminologiaPorEntidad , seleccionarEntidad} = useTerminologiaStore();
    const [isModalOpenProv, setisModalOpenProv] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        terminologiaPorEntidad();
    }, []);

  
    console.log("data view")
    const test = useSelector(e=>e.DATA)
    console.log(test);

    let dataTerminologiaPorEntidad = test.dataView;

    const modalProvClose = () => {

        setisModalOpenProv(false)
        //setSelectedParametro(null);
    }
    const modalProvOpen = (terminologiaData) => {
        dispatch(onSetTerminologia(terminologiaData));


        setisModalOpenProv(true)
    };


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
                                        return (

                                                <TabPanel  key={`${parametro.entidad_param}`} header={parametro.entidad_param}>
                                                    <Col sm={4}>
                                                        <Button label='Agregar Terminologia' onClick={() => {
                                                            modalProvOpen(parametro);
                                   
                                                            }} />
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
            <ModalTerminologia  show={isModalOpenProv} onHide={modalProvClose} boleanActualizar={false} ></ModalTerminologia>
        </>
    )
}
