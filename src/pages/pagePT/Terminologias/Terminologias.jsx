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

export const Terminologias = () => {

    
    const { terminologiaPorEntidad , seleccionarEntidad} = useTerminologiaStore();
    const [isModalOpenProv, setisModalOpenProv] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        terminologiaPorEntidad();
    }, []);

  
    //console.log("data view")
    const test = useSelector(e=>e.DATA)
    //console.log(test);

    let dataTerminologiaPorEntidad = test.dataView;
    console.log(dataTerminologiaPorEntidad);
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
  
                            <TabView className='px-2 mx-1 mb-1'  scrollable='true'>
                                {
                                    
                                    dataTerminologiaPorEntidad?.parametros?.length > 0 && 
                                    dataTerminologiaPorEntidad?.parametros?.map((parametro , index) => {
                                        console.log(dataTerminologiaPorEntidad);
                                        if (parametro.parametros.length === 0) {
                                            return null;
                                            
                                        }else{
                                            return (

                                                <TabPanel className='px-2'   key={`${parametro.entidad_param}`} header={parametro.entidad_param}>
                                                    <Col  sm={4}>
                                                        <Button label='Agregar Terminologia' onClick={() => {
                                                            modalProvOpen(parametro);
                                   
                                                            }} />
                                                    </Col>
                                                    <DataTerminologia  data={parametro.parametros} />
                                                </TabPanel>
                                            )
                                        }
                                    })

                                }

                                {
                                    dataTerminologiaPorEntidad?.parametrosGasto?.length > 0 && 
                                    dataTerminologiaPorEntidad?.parametrosGasto?.map((parametro , index) => {
                                        if (parametro.parametros.length === 0) {
                                            return null;
                                            //`${parametro.empresa} + ${index}`
                                        }else{
                                            console.log(parametro);

                                            return (
                                                <TabPanel  key={`${parametro.empresa}`} header={ parametro.empresa == '0' ? 'PT' : parametro.empresa == '598' ? 'Change' : parametro.empresa == '599' ? "Circus" : ""}>
                                                    <Col sm={4}>
                                                        <Button label='Agregar Terminologia' onClick={() => {
                                                            modalProvOpen(parametro);
                                   
                                                            }} />
                                                    </Col>
                                                    <DataTerminologiaGasto  data={parametro.parametros} />
                                                </TabPanel>
                                            )
                                        }
                   
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
