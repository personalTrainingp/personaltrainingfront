import { PTApi } from '@/common'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import React, { useEffect, useState } from 'react'
import { Col, Form, Row, Table } from 'react-bootstrap'
import Swal from 'sweetalert2'

// terminologias de sistema que usa el centro de archivo (las mismas del modal "Agregar documento":
// Tipo = grupo 'categoria', Sub tipo = grupo 'sub-tipo-archivo'). Ojo: 'tipo-archivo' es otro grupo
// (DOC, URL...) compartido con otros modulos, no se usa aqui.
const ENTIDAD = 'centro-archivo'
const GRUPOS = [
    { grupo: 'categoria', titulo: 'TIPOS' },
    { grupo: 'sub-tipo-archivo', titulo: 'SUBTIPOS' },
]

const sinOrden = (o) => o === null || o === undefined || o === '' || isNaN(Number(o))
const porOrden = (a, b) => {
    if (sinOrden(a.orden_param) !== sinOrden(b.orden_param)) return sinOrden(a.orden_param) ? 1 : -1
    const d = Number(a.orden_param) - Number(b.orden_param)
    return d || String(a.label_param).localeCompare(String(b.label_param))
}

// registra el ORDEN (orden_param) de los tipos y subtipos del centro de archivo
export const ModalOrdenTerminologia = ({ show, onHide, onGuardado }) => {
    const [terminos, setterminos] = useState({}) // { grupo: [rows] }
    const [ordenes, setordenes] = useState({}) // { id_param: valor editado }
    const [cargando, setcargando] = useState(false)
    const [guardando, setguardando] = useState(false)

    const obtenerTerminos = async () => {
        setcargando(true)
        try {
            const resultados = await Promise.all(
                GRUPOS.map(({ grupo }) => PTApi.get(`/terminologia/term1/${ENTIDAD}/${grupo}`))
            )
            const data = {}
            GRUPOS.forEach(({ grupo }, i) => {
                data[grupo] = [...(resultados[i].data?.terminologia || [])].sort(porOrden)
            })
            setterminos(data)
        } catch (error) {
            console.log(error)
        }
        setcargando(false)
    }

    useEffect(() => {
        if (show) {
            setordenes({})
            obtenerTerminos()
        }
    }, [show])

    const valorOrden = (row) => ordenes[row.id_param] ?? row.orden_param ?? ''

    const onChangeOrden = (id, value) => setordenes((prev) => ({ ...prev, [id]: value }))

    const onGuardar = async () => {
        const filas = Object.values(terminos).flat()
        const cambios = filas.filter(
            (row) => ordenes[row.id_param] !== undefined && String(ordenes[row.id_param]) !== String(row.orden_param ?? '')
        )
        if (cambios.length === 0) {
            onHide()
            return
        }
        setguardando(true)
        try {
            await Promise.all(
                cambios.map((row) =>
                    PTApi.put(`/terminologia/term1/id/${row.id_param}`, {
                        ...row,
                        orden_param: ordenes[row.id_param] === '' ? null : Number(ordenes[row.id_param]),
                    })
                )
            )
            Swal.fire({ icon: 'success', title: 'Orden registrado', showConfirmButton: false, timer: 1500 })
            onGuardado?.()
            onHide()
        } catch (error) {
            console.log(error)
            Swal.fire({ icon: 'error', title: 'No se pudo registrar el orden', showConfirmButton: false, timer: 3000 })
            obtenerTerminos()
        }
        setguardando(false)
    }

    const footer = (
        <div>
            <Button label="SALIR" text onClick={onHide} disabled={guardando} />
            <Button label="GUARDAR ORDEN" icon="pi pi-save" onClick={onGuardar} loading={guardando} disabled={cargando} />
        </div>
    )

    return (
        <Dialog header="Registrar orden de terminologías" style={{ width: '50rem' }} breakpoints={{ '768px': '95vw' }} visible={show} onHide={onHide} footer={footer}>
            {cargando ? (
                <div className="text-center text-muted my-4">Cargando...</div>
            ) : (
                <Row>
                    {GRUPOS.map(({ grupo, titulo }) => (
                        <Col md={6} key={grupo}>
                            <div className="fw-bold mb-2">{titulo}</div>
                            <Table size="sm" bordered striped>
                                <thead>
                                    <tr>
                                        <th>NOMBRE</th>
                                        <th style={{ width: '6rem' }}>ORDEN</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(terminos[grupo] || []).map((row) => (
                                        <tr key={row.id_param}>
                                            <td className="align-middle">{row.label_param}</td>
                                            <td>
                                                <Form.Control
                                                    type="number"
                                                    size="sm"
                                                    value={valorOrden(row)}
                                                    onChange={(e) => onChangeOrden(row.id_param, e.target.value)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                    {(terminos[grupo] || []).length === 0 && (
                                        <tr>
                                            <td colSpan={2} className="text-center text-muted">Sin terminologías</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                    ))}
                </Row>
            )}
        </Dialog>
    )
}
