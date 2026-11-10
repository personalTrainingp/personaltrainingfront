import React, { useEffect, useState } from 'react'
import { PTApi } from '@/common'
import config from '@/config'
import { PageBreadcrumb } from '@/components'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { Button } from 'primereact/button'
import dayjs from 'dayjs'
import { MESES } from '../GestionMetas/meses'
import { SelectorTexto } from '../GestionComercial/ModalReporteTareas'

const ANIO_INICIAL = 2024

// Pantalla solo de vista: datos de ejemplo, solo la foto viene de gestion de clientes. Editar y eliminar aun no hacen nada
// busqueda: palabras que debe tener el nombre del cliente ('betanc' cubre Betancout y Betancourt)
const dataFake = [
  { id: 1, nombre: 'Mayra Couto', busqueda: ['mayra', 'couto'], foto: null, n_seguidores: 850000, contrato: 1, acuerdo: '3 reels y 12 historias mensuales', status: 'CUMPLIO' },
  { id: 2, nombre: 'Karina Betancout', busqueda: ['karina', 'betanc'], foto: null, n_seguidores: 320000, contrato: 0, acuerdo: '3 reels y 12 historias mensuales', status: 'LE FALTA 2' },
  { id: 3, nombre: 'Ursula Boza', busqueda: ['ursula', 'boza'], foto: null, n_seguidores: 610000, contrato: 1, acuerdo: '3 reels y 12 historias mensuales', status: 'LE FALTA 1' },
  { id: 4, nombre: 'Fabiana Valcarcel', busqueda: ['fabiana', 'valcarcel'], foto: null, n_seguidores: 450000, contrato: 1, acuerdo: '3 reels y 12 historias mensuales', status: 'LE FALTA 3' },
  { id: 5, nombre: 'Olenka Monteza', busqueda: ['olenka', 'monteza'], foto: null, n_seguidores: 280000, contrato: 1, acuerdo: '3 reels y 12 historias mensuales', status: 'CUMPLIO' },
]

const iniciales = (nombre)=>nombre.split(' ').map(p=>p[0]).join('').slice(0, 2).toUpperCase()
const normalizar = (texto)=>(texto ?? '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Foto vigente del cliente (la ultima de tb_images, igual que el perfil). Un mismo nombre puede
// tener varios registros: se recorren del mas reciente al mas antiguo hasta encontrar uno con foto
const obtenerFotoCliente = async (influencer, clientes)=>{
  const coincidencias = clientes.filter(c=>influencer.busqueda.every(p=>normalizar(c.nombres_apellidos_cli).includes(p)))
  for (const cliente of coincidencias) {
    const { data } = await PTApi.get(`/usuario/get-cliente/${cliente.uid}`)
    const nameImage = data.cliente?.tb_images?.at(-1)?.name_image
    if (nameImage) return `${config.API_IMG.AVATAR_CLI}${nameImage}`
  }
  return null
}

const columns = [
  {
    id: 'foto', header: 'FOTO', cellAlign: 'center', render: (row)=>(
      row.foto
        ? <img src={row.foto} alt={row.nombre} className='rounded-circle' style={{ width: 100, height: 100, objectFit: 'cover' }}/>
        : <div className='rounded-circle bg-secondary text-white fw-bold d-inline-flex align-items-center justify-content-center' style={{ width: 100, height: 100 }}>{iniciales(row.nombre)}</div>
    )
  },
  { id: 'nombre', header: 'NOMBRE', render: (row)=>row.nombre },
  { id: 'n_seguidores', header: 'N° SEGUIDORES', cellAlign: 'right', render: (row)=>row.n_seguidores.toLocaleString('es-PE') },
  {
    id: 'contrato', header: 'CONTRATO', cellAlign: 'center', render: (row)=>(
      <span className={`badge ${row.contrato ? 'bg-success' : 'bg-danger'}`}>{row.contrato ? 'SI' : 'NO'}</span>
    )
  },
  { id: 'acuerdo', header: 'ACUERDO', render: (row)=>row.acuerdo },
  { id: 'status', header: 'STATUS', render: (row)=>row.status },
  {
    id: 'acciones', header: 'ACCIONES', cellAlign: 'center', render: ()=>(
      <div className='d-flex justify-content-center gap-2'>
        <Button icon='pi pi-pencil' rounded outlined aria-label='Editar'/>
        <Button icon='pi pi-trash' rounded outlined severity='danger' aria-label='Eliminar'/>
      </div>
    )
  },
]

export const AppStatusInfluencer = () => {
  const [dataInfluencers, setdataInfluencers] = useState(dataFake)
  // Solo de vista: los datos son de ejemplo y aun no se filtran por mes y año
  const [mes, setmes] = useState(()=>dayjs().month() + 1)
  const [anio, setanio] = useState(()=>dayjs().year())
  const anios = Array.from({length: dayjs().year() - ANIO_INICIAL + 1}, (_, i)=>ANIO_INICIAL + i)
  useEffect(() => {
    const cargarFotos = async()=>{
      try {
        const { data } = await PTApi.get('/usuario/get-clientes/598')
        const fotos = await Promise.all(dataFake.map(i=>obtenerFotoCliente(i, data.clientes)))
        setdataInfluencers(dataFake.map((i, idx)=>({...i, foto: fotos[idx]})))
      } catch (error) {
        console.log(error)
      }
    }
    cargarFotos()
  }, [])
  return (
    <>
      <PageBreadcrumb title={'STATUS INFLUENCER'}/>
      <div className='d-flex align-items-center gap-3 flex-wrap mb-3'>
        <SelectorTexto id='statusInfluencerMes' valor={mes} onChange={setmes} opciones={MESES.map((nombre, i)=>({value: i + 1, label: nombre}))}/>
        <SelectorTexto id='statusInfluencerAnio' valor={anio} onChange={setanio} opciones={anios.map(a=>({value: a, label: a}))}/>
      </div>
      <DataTableCR columns={columns} data={dataInfluencers} exportable={false}/>
    </>
  )
}
