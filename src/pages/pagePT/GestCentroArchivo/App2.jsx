import { PageBreadcrumb } from '@/components'
import React, { useEffect, useMemo, useState } from 'react'
import { Button, Col, ListGroup, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { DataTableCentroArchivo } from './DataTableCentroArchivo'
import { ModalCustom } from './ModalCustom'
import { useCenterArchive } from './hook/useCenterArchive'

export const App2 = ({idEmpresa}) => {
    const [isOpenModalCustomArchivo, setisOpenModalCustomArchivo] = useState({isOpen: false, id: 0})
    const { obtenerArchivosCenter } = useCenterArchive()
    const { dataView } = useSelector(e=>e.DATA)
    const [selectedTipo, setselectedTipo] = useState(null)
    const [selectedSubtipo, setselectedSubtipo] = useState(null)
    const [tipoElegido, settipoElegido] = useState(false)
    const [subtipoElegido, setsubtipoElegido] = useState(false)

    useEffect(() => {
        obtenerArchivosCenter(idEmpresa)
    }, [idEmpresa])

    const tipos = useMemo(() => {
        const map = new Map()
        ;(dataView || []).forEach((row) => {
            const label = row?.tipo?.label_param
            if (!label) return
            const key = row?.tipo?.id_param ?? label
            if (!map.has(key)) map.set(key, { key, label })
        })
        return Array.from(map.values())
    }, [dataView])

    const subtipos = useMemo(() => {
        if (!tipoElegido) return []
        const map = new Map()
        ;(dataView || [])
            .filter((row) => !selectedTipo || (row?.tipo?.id_param ?? row?.tipo?.label_param) === selectedTipo.key)
            .forEach((row) => {
                const label = row?.subtipo?.label_param
                if (!label) return
                const key = row?.subtipo?.id_param ?? label
                if (!map.has(key)) map.set(key, { key, label })
            })
        return Array.from(map.values())
    }, [dataView, selectedTipo, tipoElegido])

    const filteredData = useMemo(() => {
        let data = dataView || []
        if (selectedTipo) {
            data = data.filter((row) => (row?.tipo?.id_param ?? row?.tipo?.label_param) === selectedTipo.key)
        }
        if (selectedSubtipo) {
            data = data.filter((row) => (row?.subtipo?.id_param ?? row?.subtipo?.label_param) === selectedSubtipo.key)
        }
        return data
    }, [dataView, selectedTipo, selectedSubtipo])

    const onClickTipo = (tipo) => {
        setselectedTipo(tipo)
        setselectedSubtipo(null)
        settipoElegido(true)
        setsubtipoElegido(false)
    }
    const onClickSubtipo = (subtipo) => {
        setselectedSubtipo(subtipo)
        setsubtipoElegido(true)
    }
    const onClickTodosTipos = () => {
        setselectedTipo(null)
        setselectedSubtipo(null)
        settipoElegido(true)
        setsubtipoElegido(false)
    }
    const onClickTodosSubtipos = () => {
        setselectedSubtipo(null)
        setsubtipoElegido(true)
    }
    const onClickLimpiarFiltro = () => {
        setselectedTipo(null)
        setselectedSubtipo(null)
        settipoElegido(false)
        setsubtipoElegido(false)
    }
    const onClickOpenModalCustomArchivo=(id=0)=>{
        setisOpenModalCustomArchivo({isOpen: true, id: id})
    }
    const onClickCloseModalCustomArchivo =()=>{
        setisOpenModalCustomArchivo({isOpen: false, id: 0})
    }
  return (
    <>
    <Button className='border-none input-buton' onClick={()=>onClickOpenModalCustomArchivo(0)}>AGREGAR ARCHIVO</Button>
    {
        (tipoElegido || subtipoElegido) && (
            <Button className='p-tabview-title' variant='link'  onClick={onClickLimpiarFiltro}>Limpiar filtro</Button>
        )
    }
    <Row className='mt-3'>
        <Col md={3}>
            <div className='fw-bold mb-2'>Tipos</div>
            <ListGroup>
                <ListGroup.Item
                    action
                    active={tipoElegido && !selectedTipo}
                    className={
                                    tipoElegido && !selectedTipo
                                        ? 'input-buton border-none'
                                        : ''
                                }
                    onClick={onClickTodosTipos}
                >
                    Todos
                </ListGroup.Item>
                {tipos.map((tipo) => (
                    <ListGroup.Item
                        key={tipo.key}
                        action
                        active={selectedTipo?.key === tipo.key}
                        className={
                                    selectedTipo?.key === tipo.key
                                        ? 'input-buton border-none'
                                        : ''
                                }
                        onClick={() => onClickTipo(tipo)}
                    >
                        {tipo.label}
                    </ListGroup.Item>
                ))}
                {tipos.length === 0 && (
                    <ListGroup.Item disabled>Sin tipos</ListGroup.Item>
                )}
            </ListGroup>
        </Col>
        {
            tipoElegido && (
                <Col md={3}>
                    <div className='fw-bold mb-2'>Subtipos</div>
                    <ListGroup>
                        <ListGroup.Item
                            action
                            active={subtipoElegido && !selectedSubtipo}
                            className={
                                    subtipoElegido && !selectedSubtipo
                                        ? 'input-buton border-none'
                                        : ''
                                }
                            onClick={onClickTodosSubtipos}
                        >
                            Todos
                        </ListGroup.Item>
                        {subtipos.map((subtipo) => (
                            <ListGroup.Item
                                key={subtipo.key}
                                action
                                className={`${selectedSubtipo?.key === subtipo.key?'input-buton border-none':''}`}
                                active={selectedSubtipo?.key === subtipo.key}
                                onClick={() => onClickSubtipo(subtipo)}
                            >
                                {subtipo.label}
                            </ListGroup.Item>
                        ))}
                        {subtipos.length === 0 && (
                            <ListGroup.Item disabled>Sin subtipos</ListGroup.Item>
                        )}
                    </ListGroup>
                </Col>
            )
        }
        <Col md={tipoElegido ? 6 : 9}>
            {
                (tipoElegido && subtipoElegido)
                    ? (
                        <DataTableCentroArchivo onClickOpenModalCustomArchivo={onClickOpenModalCustomArchivo} idEmpresa={idEmpresa} data={filteredData}/>
                    )
                    : (
                        <div className='text-center text-muted mt-4'>
                            Seleccionar el tipo y el subtipo
                        </div>
                    )
            }
        </Col>
    </Row>
    <ModalCustom id_enterprice={idEmpresa} id={isOpenModalCustomArchivo.id} onHide={onClickCloseModalCustomArchivo}  show={isOpenModalCustomArchivo.isOpen}/>
    </>
  )
}
