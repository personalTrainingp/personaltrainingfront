import { FileUploader } from '@/components';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { useDropzone } from 'react-dropzone';
import { ItemClinico } from './HistClinico/ItemClinico';
import { Button } from 'primereact/button';
import { SidebarClinico } from './HistClinico/SidebarClinico';
import { ModalDieta } from './ModalDieta/ModalDieta';
import { ItemDieta } from './ModalDieta/ItemDieta';
import { useNutricionCliente } from '@/hooks/hookApi/useNutricionCliente';
import { useSelector } from 'react-redux';
import { confirmDialog } from 'primereact/confirmdialog';

export const ScreenNutricionista = ({id_cli, dataCli}) => {
    const {getRootProps, getInputProps, acceptedFiles} = useDropzone({noDrag: true});
    const [showSideBarClinico, setshowSideBarClinico] = useState(false)
    const [isOpenModalPlanAlimenticio, setisOpenModalPlanAlimenticio] = useState(false)
    
  const { obtenerDietasxCliente, EliminarDietaxID, isLoading, obtenerHistClinico  } = useNutricionCliente()
  
  const { status, userCliente, dataNutricion_DIETA, dataNutricion_HISTORIAL_CLINICO } = useSelector(e=>e.authClient)
    useEffect(() => {
        obtenerDietasxCliente(id_cli)
        obtenerHistClinico(id_cli)
    }, [])
    
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
    const onDeleteDieta = (id)=>{
        confirmDialog({
            header: 'Confirmar eliminación',
            message: '¿Está seguro de eliminar este plan alimenticio?',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                EliminarDietaxID(id, id_cli)
            },
            reject: () => {
                // nothing to do
            }
        })
    }
  return (
    <>
        {
            
        }
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
                {
                    dataNutricion_DIETA.map(d=>{
                        return(
                        <ItemDieta  key={d.id} url={d.tb_image.name_image} onDeleteDieta={()=>onDeleteDieta(d.id)} id_dieta_cli={d.id} nombre_dieta={d.nombre_dieta} descripcion_dieta={d.descripcion_dieta}/>
                        )
                    })
                }
                </Col>
            </Row>
            </TabPanel>
            <TabPanel header='Historial clinico'>
                <Row className='mb-2'>
                    <Col xxl={5}>
                    <Button label="Agregar" onClick={onOpenSideBarClinico} icon="pi pi-plus" iconPos="right"/>
                    </Col>
                </Row>
                {
                    dataNutricion_HISTORIAL_CLINICO.map(h=>{
                        return(
                            <ItemClinico onUpdateHClinico={()=>onUpdateHClinico(h.id)} url={h?.tb_image?.name_image} fec_created={h.createdAt}/>
                        )
                    })
                }
            </TabPanel>
        </TabView>
        <SidebarClinico onHide={onCloseSideBarClinico} show={showSideBarClinico} dataCli={dataCli}/>
        <ModalDieta onHide={onCloseModalFilePlanAlimenticio} id_cli={id_cli} show={isOpenModalPlanAlimenticio}/>
    </>
  )
}
