import { PageBreadcrumb } from '@/components'
import React, { useEffect, useMemo, useState } from 'react'
import { Button, Col, ListGroup, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { DataTableCentroArchivo } from './DataTableCentroArchivo'
import { ModalCustom } from './ModalCustom'
import { useCenterArchive } from './hook/useCenterArchive'

// soloLectura: vista para todos los usuarios (sidebar), con los documentos de todas las
// empresas y sin agregar, editar ni eliminar
export const App2 = ({idEmpresa, soloLectura = false}) => {
    const [isOpenModalCustomArchivo, setisOpenModalCustomArchivo] = useState({isOpen: false, id: 0})
    const { obtenerArchivosCenter, obtenerArchivosCenterTodos } = useCenterArchive()
    const { dataView: dataTodos } = useSelector(e=>e.DATA)
    const { moduloActual } = useSelector(e=>e.rutas)
    // en solo lectura cada modulo ve solo sus documentos (nombre_modulo = modulo actual)
    const dataView = useMemo(() => {
        if (!soloLectura) return dataTodos
        const modulo = moduloActual?.name?.trim().toUpperCase()
        if (!modulo) return []
        return (dataTodos || []).filter(row => row?.nombre_modulo?.trim().toUpperCase() === modulo)
    }, [dataTodos, soloLectura, moduloActual])
    const [selectedTipo, setselectedTipo] = useState(null)
    const [selectedSubtipo, setselectedSubtipo] = useState(null)
    const [tipoElegido, settipoElegido] = useState(false)
    const [subtipoElegido, setsubtipoElegido] = useState(false)

    // al cambiar de modulo, sus tipos y subtipos son otros: se limpian los filtros
    useEffect(() => {
        if (soloLectura) onClickLimpiarFiltro()
    }, [moduloActual?.key])

    useEffect(() => {
        if (soloLectura) obtenerArchivosCenterTodos()
        else obtenerArchivosCenter(idEmpresa)
    }, [idEmpresa, soloLectura])

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
    {
        !soloLectura && (
            <Button className='border-none input-buton' onClick={()=>onClickOpenModalCustomArchivo(0)}>AGREGAR ARCHIVO</Button>
        )
    }
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
                        <DataTableCentroArchivo onClickOpenModalCustomArchivo={onClickOpenModalCustomArchivo} idEmpresa={idEmpresa} data={filteredData} soloLectura={soloLectura}/>
                    )
                    : (
                        <div className='text-center text-muted mt-4'>
                            Seleccionar el tipo y el subtipo
                        </div>
                    )
            }
        </Col>
    </Row>
    {
        !soloLectura && (
            <ModalCustom id_enterprice={idEmpresa} id={isOpenModalCustomArchivo.id} onHide={onClickCloseModalCustomArchivo}  show={isOpenModalCustomArchivo.isOpen}/>
        )
    }
    </>
  )
}
