import { Card, Col, Row, Table } from 'react-bootstrap'
import React, { useEffect, useMemo, useState } from 'react';
import { TabPanel, TabView } from 'primereact/tabview'
import { Button } from 'primereact/button';
import { DataTerminologiaGasto } from './DataTerminologiaGasto';
import { onSetTerminologia } from '@/store/dataTerminologia/terminologiaSlice';
import { ModalTerminologiaGasto } from './modalTerminologiaGasto';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useTerminologiaStore } from './useTerminologiaStore';
import { ModalAgregarImgs } from './ModalAgregarImgs';

export const TerminologiasInventarioLugar = ({dataTerminologiaPorEntidad}) => {
    const { obtenerParametrosLugares, dataT } = useTerminologiaStore()
    const [isModalOpenTerminologia, setisModalOpenTerminologia] = useState(false);
    const [isModalOpenTerminologiaGasto, setisModalOpenTerminologiaGasto] = useState(false);
    const [isModalOpenAgregarImgs, setisModalOpenAgregarImgs] = useState(false)
    const [dataRow, setdataRow] = useState({})
    const dispatch = useDispatch();
    console.log({dataT});
    
    useEffect(() => {
        obtenerParametrosLugares();
    }, []);
    const test = useSelector(e => e.DATA)
    const onOpenModalAgregarImg = (row) => {
        console.log(row, "rooo");
        setdataRow(row)
        setisModalOpenAgregarImgs(true)
    }
    const onCloseModalAgregarImg = () => {
        setisModalOpenAgregarImgs(false)
    }
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
            <Table>
                
            <thead className="bg-primary">
                                                                    <tr>
                                                                        <th className='text-white p-2 py-2'>LUGAR</th>
                                                                        <th className='text-white p-2 py-2' >ORDEN</th>
                                                                        <th className='text-white p-2 py-2' ></th>
                                                                    </tr>
                                                                </thead>
                                                                <tbody>
                                                                    {
                                                                        dataT.map(d=>{
                                                                            return (
                                                                                    <tr>
                                                                                        <td>
                                                                                            <span className='fw-boldd'>{d.label_param}</span>
                                                                                        </td>
                                                                                        <td>{d.orden_param}</td>
                                                                                        <td><button onClick={()=>onOpenModalAgregarImg(d)}>AGREGAR IMAGENES</button></td>
                                                                                    </tr>
                                                                            )
                                                                        })
                                                                    }
                                                                </tbody>
            </Table>
            <ModalAgregarImgs show={isModalOpenAgregarImgs} onHide={onCloseModalAgregarImg} uidImageParam={dataRow.uid_image}/>
            <ModalTerminologiaGasto show={isModalOpenTerminologiaGasto} onHide={modalTerminologiaGastoClose} boleanActualizar={false} ></ModalTerminologiaGasto>
        </>
    );
}
