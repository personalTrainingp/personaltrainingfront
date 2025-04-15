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
import { TerminologiaGastoTabView } from './TerminologiaGastoTabView';
import { TerminologiasInventarioLugar } from './TerminologiasInventarioLugar';
import { TerminologiaSistemas } from './TerminologiaSistemas';

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
                                        <TabView>
                                            <TabPanel header='HISTORICO'>
                                                <TerminologiaGastoTabView id_empresa={0}/>
                                            </TabPanel>
                                            <TabPanel header='RAL'>
                                                <TerminologiaGastoTabView id_empresa={600}/>
                                            </TabPanel>
                                            <TabPanel header='CHANGE'>
                                                <TerminologiaGastoTabView id_empresa={598}/>
                                            </TabPanel>
                                            <TabPanel header='CIRCUS'>
                                                <TerminologiaGastoTabView id_empresa={599}/>
                                            </TabPanel>
                                            <TabPanel header='SAN EXPEDITO'>
                                                <TerminologiaGastoTabView id_empresa={601}/>
                                            </TabPanel>
                                        </TabView>
                                    </Col>
                                </TabPanel>
                               <TabPanel header={'TERMINOLOGIA DEL SISTEMAS'}>
                                    <TerminologiaSistemas/>
                               </TabPanel>
                               <TabPanel header={'TERMINOLOGIAS DEL INVENTARIO (LUGAR)'}>
                                    <Col sm={12}>
                                        <TerminologiasInventarioLugar dataTerminologiaPorEntidad={dataTerminologiaPorEntidad}/>
                                    </Col>
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



