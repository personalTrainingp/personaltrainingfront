import { Card, Col, Row } from 'react-bootstrap'
import React, { useEffect, useMemo, useState } from 'react';
import { TabPanel, TabView } from 'primereact/tabview'
import { Button } from 'primereact/button';
import { DataTerminologiaGasto } from './DataTerminologiaGasto';
import { useTerminologiaStore } from '@/hooks/hookApi/useTerminologiaStore'
import { onSetTerminologia } from '@/store/dataTerminologia/terminologiaSlice';
import { ModalTerminologiaGasto } from './modalTerminologiaGasto';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

export const TerminologiasInventarioLugar = ({dataTerminologiaPorEntidad}) => {

    const { terminologiaPorEntidad, seleccionarEntidad } = useTerminologiaStore();
    const [isModalOpenTerminologia, setisModalOpenTerminologia] = useState(false);
    const [isModalOpenTerminologiaGasto, setisModalOpenTerminologiaGasto] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        terminologiaPorEntidad();
    }, []);

    const test = useSelector(e => e.DATA)

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
            <Card>
                <Card.Body>

                    <TabView className='px-2 mx-1 mb-1' scrollable='true'>
                        {
                            dataTerminologiaPorEntidad?.parametrosGasto?.length > 0 &&
                            dataTerminologiaPorEntidad?.parametrosGasto?.map((parametro, index) => {
                                if (parametro.parametros.length === 0) {
                                    return null;
                                    //`${parametro.empresa} + ${index}`
                                } else {
                                    return (
                                        <TabPanel key={`${parametro.empresa}`} className={''} header={parametro.empresa == '0' ? 'HISTORICO' : parametro.empresa == '598' ? 'Change' : parametro.empresa == '599' ? "Circus" : parametro.empresa == '600' ? "RAL" : ""}>
                                            <Col sm={4}>
                                                <Button label='Agregar Terminologia' onClick={() => {
                                                    modalTerminologiaGastoOpen(parametro);
                                                }} />
                                            </Col>
                                            <DataTerminologiaGasto data={parametro.parametros} />
                                        </TabPanel>
                                    )
                                }
                            })
                        }

                    </TabView>
                </Card.Body>
            </Card>
            <ModalTerminologiaGasto show={isModalOpenTerminologiaGasto} onHide={modalTerminologiaGastoClose} boleanActualizar={false} ></ModalTerminologiaGasto>
        </>
    );
}
