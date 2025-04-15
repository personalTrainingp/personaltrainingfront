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

export const TerminologiaGastoTabView = ({ dataTerminologiaPorEntidad, id_empresa, parametro }) => {

    const { terminologiaPorEntidad } = useTerminologiaStore();
    const [isModalOpenTerminologia, setisModalOpenTerminologia] = useState(false);
    const [isModalOpenTerminologiaGasto, setisModalOpenTerminologiaGasto] = useState(false);
    // CONSuseSelector(e=>e.DATA)
    const dispatch = useDispatch();
    useEffect(() => {
        terminologiaPorEntidad(id_empresa);
    }, [id_empresa]);

    const { dataView } = useSelector(e => e.DATA)
    console.log(dataView, "testtt");
    
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
    // console.log({dataTerminologiaPorEntidad});
    
    return (
        <>
            <Card>
                <Card.Body>
                    {/* {
                        dataView.map(d=>{
                            console.log(d, "dam");
                            
                            return (
                                <>
                                </>
                            )
                        })
                    } */}
                    
                    <Col sm={4}>
                                        <Button label='Agregar Terminologia' onClick={() => {
                                            modalTerminologiaGastoOpen(dataView);
                                        }} />
                                    </Col>
                                    <DataTerminologiaGasto id_empresa={id_empresa} data={dataView} />
                </Card.Body>
            </Card>
            <ModalTerminologiaGasto id_empresa={id_empresa} show={isModalOpenTerminologiaGasto} onHide={modalTerminologiaGastoClose} boleanActualizar={false} ></ModalTerminologiaGasto>
        </>
    );

}