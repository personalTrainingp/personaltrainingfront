import React, { useEffect, useState } from 'react'
import { Alert, Button, Form, Modal, Spinner, Table } from 'react-bootstrap'
import dayjs from 'dayjs'
import { useMensajesWspStore } from '../GestionMensajesWsp/useMensajesWspStore'

// Los mensajes nuevos llegan por el webhook: se refresca la lista cada 15 s
const INTERVALO_REFRESCO = 15000

// Chats de WhatsApp (nombre, numero, ultimo mensaje) para que cada asesor tome los suyos como lead
export const ModalMensajesWsp = ({show, onHide}) => {
  const { dataChats, isLoadingChats, error, obtenerChats, agregarAMiLead } = useMensajesWspStore()
  const [busqueda, setbusqueda] = useState('')
  const [chatGuardando, setchatGuardando] = useState(null)
  const [errorAccion, seterrorAccion] = useState('')

  useEffect(() => {
    if (!show) return
    const timer = setTimeout(() => obtenerChats(busqueda), 400)
    const intervalo = setInterval(() => obtenerChats(busqueda, true), INTERVALO_REFRESCO)
    return () => {
      clearTimeout(timer)
      clearInterval(intervalo)
    }
  }, [show, busqueda])

  const onAgregarAMiLead = async (chat) => {
    seterrorAccion('')
    setchatGuardando(chat)
    const resultado = await agregarAMiLead(chat)
    setchatGuardando(null)
    if (!resultado.ok) {
      seterrorAccion(resultado.msg)
      obtenerChats(busqueda, true)
    }
  }

  return (
    <Modal show={show} onHide={onHide} size='xl'>
        <Modal.Header closeButton>
            <Modal.Title>
                MENSAJES DE WHATSAPP
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form.Control className='mb-3' placeholder='Buscar por nombre o número' value={busqueda} onChange={(e)=>setbusqueda(e.target.value)} style={{maxWidth: 320}}/>
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
                  {dataChats.length === 0 && (
                    <tr>
                      <td colSpan={4} className='text-center text-muted'>No hay mensajes</td>
                    </tr>
                  )}
                  {dataChats.map((c) => (
                    <tr key={c.chat}>
                      <td>{c.nombre || '-'}</td>
                      <td className='text-nowrap'>{c.chat}</td>
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
                          <Button size='sm' disabled={chatGuardando === c.chat} onClick={()=>onAgregarAMiLead(c.chat)}>
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
  )
}
