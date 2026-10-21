import React, { useEffect, useMemo, useState } from 'react'
import { Alert, Button, Form, Modal, Spinner, Table } from 'react-bootstrap'
import dayjs from 'dayjs'
import { useSelector } from 'react-redux'
import { useMensajesWspStore } from '../GestionMensajesWsp/useMensajesWspStore'
import { normalizarCelular } from './ModalCustomComercial'
import { useGestionComercialStore } from './useGestionComercialStore'

// Los mensajes nuevos llegan por el webhook: se refresca la lista cada 15 s
const INTERVALO_REFRESCO = 15000
// Si el cliente usa nombre de usuario de WhatsApp, Meta puede no enviar su número: el chat es su ID (ej. PE.1349...)
const esNumero = (chat) => /^\d+$/.test(chat)

// Chats de WhatsApp (nombre, numero, ultimo mensaje) para que cada asesor tome los suyos como lead
export const ModalMensajesWsp = ({show, onHide}) => {
  const { dataChats, isLoadingChats, error, obtenerChats, agregarAMiLead } = useMensajesWspStore()
  const [busqueda, setbusqueda] = useState('')
  const [chatGuardando, setchatGuardando] = useState(null)
  const [errorAccion, seterrorAccion] = useState('')
  const [soloNuevos, setsoloNuevos] = useState(true)
  const {dataView} = useSelector(e=>e.COMERCIAL)
  // Celulares que ya estan registrados como lead
  const celularesLeads = useMemo(() => new Set((dataView ?? []).map(e=>normalizarCelular(e.celular)).filter(cel=>cel.length===9)), [dataView])
  // Solo nuevos: oculta los chats cuyo numero ya esta registrado como lead
  const chatsVisibles = useMemo(() => {
    if (!soloNuevos) return dataChats
    return dataChats.filter(c=>!esNumero(c.chat) || !celularesLeads.has(normalizarCelular(c.chat)))
  }, [dataChats, celularesLeads, soloNuevos])

  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => obtenerChats(busqueda), 400)
    const intervalo = setInterval(() => obtenerChats(busqueda, true), INTERVALO_REFRESCO)
    return () => {
      clearTimeout(timer)
      clearInterval(intervalo)
    }
  }, [show, busqueda])

  const { obtenerGestionComercial } = useGestionComercialStore()

  // El back registra el chat como lead del usuario (sin formulario) y lo marca como suyo
  const onAgregarAMiLead = async (c) => {
    seterrorAccion('')
    setchatGuardando(c.chat)
    const resultado = await agregarAMiLead(c.chat)
    setchatGuardando(null)
    if (!resultado.ok) {
      seterrorAccion(resultado.msg)
      obtenerChats(busqueda, true)
      return
    }
    // se cierra para ver el lead nuevo en la tabla
    await obtenerGestionComercial()
    onHide()
  }

  return (
    <>
    <Modal show={show} onHide={onHide} size='xl'>
        <Modal.Header closeButton>
            <Modal.Title>
                MENSAJES DE WHATSAPP
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='d-flex align-items-center gap-3 mb-3 flex-wrap'>
              <Form.Control placeholder='Buscar por nombre o número' value={busqueda} onChange={(e)=>setbusqueda(e.target.value)} style={{maxWidth: 320}}/>
              <Form.Check type='switch' id='wsp-solo-nuevos' label='Solo números nuevos' checked={soloNuevos} onChange={(e)=>setsoloNuevos(e.target.checked)}/>
            </div>
            {(error || errorAccion) && <Alert variant='danger'>{error || errorAccion}</Alert>}
            {isLoadingChats ? (
              <div className='text-center p-4'>
                <Spinner animation='border'/>
              </div>
            ) : (
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Número</th>
                    <th>Último mensaje</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {chatsVisibles.length === 0 && (
                    <tr>
                      <td colSpan={4} className='text-center text-muted'>{soloNuevos && dataChats.length > 0 ? 'No hay números nuevos' : 'No hay mensajes'}</td>
                    </tr>
                  )}
                  {chatsVisibles.map((c) => (
                    <tr key={c.chat}>
                      <td>{c.nombre || '-'}</td>
                      <td className='text-nowrap'>{esNumero(c.chat) ? c.chat : <span className='text-muted'>Sin número</span>}</td>
                      <td>
                        <div className='text-truncate' style={{maxWidth: 420}} title={c.body}>
                          {c.enviado_por_mi ? 'Tú: ' : ''}{c.body}
                        </div>
                        <small className='text-muted'>{dayjs(c.fecha).format('DD/MM/YYYY HH:mm')}</small>
                      </td>
                      <td className='text-nowrap'>
                        {c.gestionadoPor ? (
                          <span className='badge bg-success fs-6'>Lead del {c.gestionadoPor}</span>
                        ) : (
                          <Button size='sm' disabled={chatGuardando === c.chat} onClick={()=>onAgregarAMiLead(c)}>
                            {chatGuardando === c.chat ? <Spinner animation='border' size='sm'/> : 'Agregar a mi lead'}
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
        </Modal.Body>
    </Modal>
    </>
  )
}
