import { FileUploader } from '@/components';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone';
import { ItemClinico } from './HistClinico/ItemClinico';
import { Button } from 'primereact/button';
import { SidebarClinico } from './HistClinico/SidebarClinico';
import { ModalDieta } from './ModalDieta/ModalDieta';

export const ScreenNutricionista = () => {
    const {getRootProps, getInputProps, acceptedFiles} = useDropzone({noDrag: true});
    const [showSideBarClinico, setshowSideBarClinico] = useState(false)
    const [isOpenModalPlanAlimenticio, setisOpenModalPlanAlimenticio] = useState(false)
    const onCloseSideBarClinico = ()=>{
        setshowSideBarClinico(false)
    }
    const onOpenSideBarClinico = ()=>{
        setshowSideBarClinico(true)
    }
    const onOpenModalFilePlanAlimenticio = ()=>{
        setisOpenModalPlanAlimenticio(true)
    }
    const onCloseModalFilePlanAlimenticio = ()=>{
        setisOpenModalPlanAlimenticio(false)
    }
  return (
    <>
        <TabView>
            <TabPanel header='Planes de alimentacion'>
                <Row>
                <Col xxl={12}>
                <Row>
                    <Col>
                        <Button label="Agregar Plan" onClick={onOpenModalFilePlanAlimenticio} icon="pi pi-plus" iconPos="right"/>
                    </Col>
                </Row>
                </Col>
                <Col xxl={12}>
                </Col>
            </Row>
            </TabPanel>
            <TabPanel header='Historial clinico'>
                <Row className='mb-2'>
                    <Col xxl={5}>
                    <Button label="Agregar" onClick={onOpenSideBarClinico} icon="pi pi-plus" iconPos="right"/>
                    </Col>
                </Row>
                <ItemClinico/>
            </TabPanel>
        </TabView>
        <SidebarClinico onHide={onCloseSideBarClinico} show={showSideBarClinico}/>
        <ModalDieta onHide={onCloseModalFilePlanAlimenticio} show={isOpenModalPlanAlimenticio}/>
    </>
  )
}
