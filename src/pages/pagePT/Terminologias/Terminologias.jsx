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
import { DataTerminologiaGasto } from './DataTerminologiaGasto';
import { ModalTerminologiaGasto } from './modalTerminologiaGasto';
import { TerminologiaGastoTabView } from './TerminologiaGastoTabView';

export const Terminologias = () => {

 
    const { terminologiaPorEntidad, seleccionarEntidad } = useTerminologiaStore();
    const [isModalOpenTerminologia, setisModalOpenTerminologia] = useState(false);
    const [isModalOpenTerminologiaGasto, setisModalOpenTerminologiaGasto] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        terminologiaPorEntidad();
    }, []);


    //console.log("data view")
    const test = useSelector(e => e.DATA)
    //console.log(test);

    let dataTerminologiaPorEntidad = test.dataView;
    //console.log(dataTerminologiaPorEntidad);
    const modalTerminologiaClose = () => {
        setisModalOpenTerminologia(false)
    }
    const modalTerminologiaGastoClose = () => {
        setisModalOpenTerminologiaGasto(false)
    }

    const modalTerminologiaOpen = (terminologiaData) => {
        dispatch(onSetTerminologia(terminologiaData));
        setisModalOpenTerminologia(true)
    };

    const modalTerminologiaGastoOpen = (terminologiaData) => {
        dispatch(onSetTerminologia(terminologiaData));
        setisModalOpenTerminologiaGasto(true)
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

                            <TabView className='px-2 mx-1 mb-1' scrollable='true'>
                                <TabPanel header={"Terminologia de gastos"}>
                                    <Col sm={12}>
                                       <TerminologiaGastoTabView dataTerminologiaPorEntidad={dataTerminologiaPorEntidad} ></TerminologiaGastoTabView>
                                    </Col>
                                
                                </TabPanel>
                               <TabPanel header={'TERMINOLOGIA DEL SISTEMAS'}>
                                <TabView>
                                        {
                                            dataTerminologiaPorEntidad?.parametros?.length > 0 &&
                                            dataTerminologiaPorEntidad?.parametros?.map((parametro, index) => {
                                                if (parametro.parametros.length === 0) {
                                                    return null;
                                                } else {
                                                    return (

                                                        <TabPanel className='px-2' key={`${parametro.entidad_param}`} header={parametro.entidad_param}>
                                                            <Col sm={4}>
                                                                <Button label='Agregar Terminologia' onClick={() => {
                                                                    modalTerminologiaOpen(parametro);
                                                                }} />
                                                            </Col>
                                                            <DataTerminologia data={parametro.parametros} />
                                                        </TabPanel>
                                                    )
                                                }
                                            })
                                        }
                                </TabView>
                               </TabPanel>
                            </TabView>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <ModalTerminologia show={isModalOpenTerminologia} onHide={modalTerminologiaClose} boleanActualizar={false} ></ModalTerminologia>
        </>
    )
}
