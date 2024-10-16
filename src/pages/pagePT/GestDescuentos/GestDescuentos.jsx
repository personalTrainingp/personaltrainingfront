import { PageBreadcrumb } from '@/components'
import classNames from 'classnames'
import React, { useEffect, useState } from 'react'
import { Card, Dropdown, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { ModalHistorialCambioDesc } from './ModalHistorialCambioDesc'
import { ModalRegisterHistorialImp } from './ModalRegisterHistorialImp'
import { useImpuestosStore } from '@/hooks/hookApi/useImpuestosStore'
import { useSelector } from 'react-redux'

export const GestDescuentos = () => {
  const [isOpenModalHistorialCambioDesc, setIsOpenModalHistorialCambioDesc] = useState(false)
  const [isOpenModalRegisterCambioDesc, setIsOpenModalRegisterCambioDesc] = useState(false)
  const [obtenerid, setobtenerid] = useState(0)
  const {obtenerImpuesto, isLoading} = useImpuestosStore()
  const onOpenModalHistorialCambioDesc = (id)=>{
    setobtenerid(id)
    setIsOpenModalHistorialCambioDesc(true)
  }
  const onCloseModalHistorialCambioDesc = ()=>{
    setobtenerid(0)
    setIsOpenModalHistorialCambioDesc(false)
  }
  const onOpenModalRegisterCambioDesc = (id)=>{
    setobtenerid(id)
    setIsOpenModalRegisterCambioDesc(true)
  }
  const onCloseModalRegisterCambioDesc = ()=>{
    setobtenerid(0)
    setIsOpenModalRegisterCambioDesc(false)
  }
  useEffect(() => {
    obtenerImpuesto()
  }, [])
  const { dataImpuesto } = useSelector(e=>e.impuestos)
  if(isLoading){
    return (
      <>
      Cargando...
      </>
    )
  }
  return (
    <>
    <PageBreadcrumb title="Impuestos" subName="imp" />
    <Card>
              {dataImpuesto.map(e=>{
                console.log(e.tb_historial_impuestos);
                return(
                    <Card className="mb-1 shadow-none border m-4 border-gray" key={e.id}>
                          <div className="p-2">
                            <Row className="align-items-center p-2">
                              <div className="col ps-0">
                                <div to="" className="text-muted fw-bold fs-1">
                                  {e.name_impuesto}
                                </div>
                                {/* <p className="mb-0 fs-4">
                                  <span className='fw-bold'>Ultimo cambio: </span>
                                  {
                                    e.tb_historial_impuestos[e.tb_historial_impuestos.length - 1]?.multiplicador
                                  }
                                </p> */}
                              </div>
                              <div className="col-auto">
                                <Dropdown>
                                  <Dropdown.Toggle  to="" className="arrow-none card-drop" style={{backgroundColor: 'transparent', border: 'none', boxShadow: 'none'}}>
                                    
                                  <i className={classNames('mdi mdi-dots-vertical')} />
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <Dropdown.Item onClick={()=>onOpenModalHistorialCambioDesc(e.id)}>Historial de cambios</Dropdown.Item>
                                    <Dropdown.Item onClick={()=>onOpenModalRegisterCambioDesc(e.id)}>Agregar cambio</Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </div>
                            </Row>
                          </div>
                        </Card>
                )
              })
              
            }
            <ModalHistorialCambioDesc show={isOpenModalHistorialCambioDesc} onHide={onCloseModalHistorialCambioDesc} id_impuesto={obtenerid}/>
            <ModalRegisterHistorialImp show={isOpenModalRegisterCambioDesc} onHide={onCloseModalRegisterCambioDesc} id_impuesto={obtenerid}/>
      
    </Card>
    </>
  )
}
