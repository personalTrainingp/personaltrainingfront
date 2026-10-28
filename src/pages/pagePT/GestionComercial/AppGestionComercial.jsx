import { InputButton, InputSelect } from '@/components/InputText'
import React, { useEffect, useMemo, useState } from 'react'
import { DataTableGestionComercial } from './DataTableGestionComercial'
import { ModalCustomComercial } from './ModalCustomComercial'
import { ModalComentario } from './ModalComentario'
import { ModalTareas } from './ModalTareas'
import { ModalMembresiasCliente } from './ModalMembresiasCliente'
import { ModalReporteTareas } from './ModalReporteTareas'
import { ModalProspectosRedes } from './ModalProspectosRedes'
import { ModalMensajesWsp } from './ModalMensajesWsp'
import { PageBreadcrumb } from '@/components'
import { useSelector } from 'react-redux'
import dayjs from 'dayjs'
import { ordenarEstadosComerciales, useGestionComercialStore } from './useGestionComercialStore'

export const AppGestionComercial = () => {
    const {dataView} = useSelector(e=>e.COMERCIAL)
    const { obtenerProspectosHastaAyer, prospectosHastaAyer, dataProspectosMes, descargarClientesSinProspecto } = useGestionComercialStore()
    const [isOpenModalProspectosRedes, setisOpenModalProspectosRedes] = useState(false)
    const [filtroFecha, setfiltroFecha] = useState(null)
    useEffect(() => {
      obtenerProspectosHastaAyer()
    }, [])
    const [filtroEstado, setfiltroEstado] = useState(null)
    const estadosEnData = useMemo(() => {
      const estados = new Map()
      dataView?.forEach(e=>{
        if (e.parametro_estado?.id_param) estados.set(e.parametro_estado.id_param, e.parametro_estado.label_param)
      })
      return ordenarEstadosComerciales([...estados].map(([value, label])=>({label, value})))
    }, [dataView])
    const [filtroAsesor, setfiltroAsesor] = useState(null)
    const [filtroTipo, setfiltroTipo] = useState(null)
    const asesoresEnData = useMemo(() => {
      const asesores = new Map()
      dataView?.forEach(e=>{
        const idEmpl = e.id_empl ?? e.empleado?.id_empl
        if (idEmpl) asesores.set(idEmpl, e.empleado?.nombres_apellidos_empl)
      })
      return [...asesores].map(([value, label])=>({label, value}))
    }, [dataView])
    const [isOpenModalGestionComercial, setisOpenModalGestionComercial] = useState({isOpen: false, id: 0, isCopy: false, lead: null})
    const [isOpenModalComentario, setisOpenModalComentario] = useState({isOpen: false, uid: 0})
    const [isOpenModalVista, setisOpenModalVista] = useState({isOpen: false, uid: 0})
    const [isOpenModalHistory, setisOpenModalHistory] = useState({isOpen: false, uid: 0})
    const onOpenModalGestionComercial = (id, isCopy, lead=null)=>{
        setisOpenModalGestionComercial({isOpen: true, id, isCopy, lead})
    }
    const onCloseModalGestionComercial = ()=>{
        setisOpenModalGestionComercial({isOpen: false, id: 0, isCopy: false, lead: null})
    }
    const onOpenModalComentario = (uid)=>{
        setisOpenModalComentario({isOpen: true, uid})
    }
    const onCloseModalComentario=()=>{
        setisOpenModalComentario({isOpen: false, uid: ''})
    }
    const onOpenModalVista = (uid)=>{
        setisOpenModalVista({isOpen: true, uid})
    }
    const onCloseModalVista=()=>{
        setisOpenModalVista({isOpen: false, uid: ''})
    }
    const onOpenModalHistory = (uid)=>{
        setisOpenModalHistory({isOpen: true, uid})
    }
    const onCloseModalHistory=()=>{
        setisOpenModalHistory({isOpen: false, uid: ''})
    }
    const [isOpenModalReporteTareas, setisOpenModalReporteTareas] = useState(false)
    const [isOpenModalMensajesWsp, setisOpenModalMensajesWsp] = useState(false)
    const [isOpenModalMembresias, setisOpenModalMembresias] = useState({isOpen: false, lead: null})
    const onOpenModalMembresias = (lead)=>{
        setisOpenModalMembresias({isOpen: true, lead})
    }
    const onCloseModalMembresias = ()=>{
        setisOpenModalMembresias({isOpen: false, lead: null})
    }
    const [isOpenModalTareas, setisOpenModalTareas] = useState({isOpen: false, lead: null})
    const onOpenModalTareas = (lead)=>{
        setisOpenModalTareas({isOpen: true, lead})
    }
    const onCloseModalTareas = ()=>{
        setisOpenModalTareas({isOpen: false, lead: null})
    }
  return (
    <div>
        <PageBreadcrumb title={'GESTION DE LEAD'}/>
        <div className='d-flex align-items-center gap-2 flex-wrap'>
          <InputButton label={'Agregar lead'} onClick={()=>onOpenModalGestionComercial(0, false)}/>
          <div style={{width: 260}}>
            <InputSelect
              label={''}
              placeholder={'STATUS'}
              options={estadosEnData}
              nameInput={'filtroEstado'}
              value={filtroEstado}
              onChange={(e)=>setfiltroEstado(e.target.value ?? null)}
              isClearable
            />
          </div>
          <span className='fw-bold cursor-pointer text-decoration-underline' onClick={()=>setisOpenModalProspectosRedes(true)}>
            PROSPECTOS HASTA AYER: {prospectosHastaAyer ?? '...'}
          </span>
          {
            filtroFecha &&
            <span className='badge bg-primary fs-6 cursor-pointer' onClick={()=>setfiltroFecha(null)} title='Quitar filtro de fecha'>
              FECHA: {dayjs(filtroFecha).format('DD/MM/YYYY')} <i className='mdi mdi-close'></i>
            </span>
          }
          <div style={{width: 200}}>
            <InputSelect
              label={''}
              placeholder={'TIPO'}
              options={[{label: 'PROSPECTO', value: 'PROSPECTO'}, {label: 'ACTIVO', value: 'ACTIVO'}, {label: 'INACTIVO', value: 'INACTIVO'}]}
              nameInput={'filtroTipo'}
              value={filtroTipo}
              onChange={(e)=>setfiltroTipo(e.target.value ?? null)}
              isClearable
            />
          </div>
          <div style={{width: 260}}>
            <InputSelect
              label={''}
              placeholder={'ASESOR'}
              options={asesoresEnData}
              nameInput={'filtroAsesor'}
              value={filtroAsesor}
              onChange={(e)=>setfiltroAsesor(e.target.value ?? null)}
              isClearable
            />
          </div>
          <InputButton variant={'link'} label={'Reporte'} onClick={()=>setisOpenModalReporteTareas(true)}/>
          <InputButton variant={'link'} label={'Gestionar WSP'} onClick={()=>setisOpenModalMensajesWsp(true)}/>
          <InputButton variant={'link'} label={'Descargar Excel: clientes sin prospecto'} onClick={descargarClientesSinProspecto}/>
        </div>
        <DataTableGestionComercial onOpenModalComentario={onOpenModalComentario} onOpenModalGestionComercial={onOpenModalGestionComercial} onOpenModalTareas={onOpenModalTareas} onOpenModalMembresias={onOpenModalMembresias} filtroEstado={filtroEstado} filtroAsesor={filtroAsesor} filtroFecha={filtroFecha} filtroTipo={filtroTipo}/>
        <ModalComentario onHide={onCloseModalComentario} show={isOpenModalComentario.isOpen} uid_comentario={isOpenModalComentario.uid}/>
        <ModalMembresiasCliente onHide={onCloseModalMembresias} show={isOpenModalMembresias.isOpen} lead={isOpenModalMembresias.lead}/>
        <ModalReporteTareas onHide={()=>setisOpenModalReporteTareas(false)} show={isOpenModalReporteTareas}/>
        <ModalMensajesWsp onHide={()=>setisOpenModalMensajesWsp(false)} show={isOpenModalMensajesWsp}/>
        <ModalProspectosRedes onHide={()=>setisOpenModalProspectosRedes(false)} show={isOpenModalProspectosRedes} data={dataProspectosMes} leads={dataView} filtroFecha={filtroFecha} onSelectFecha={(fecha)=>{setfiltroFecha(fecha); setisOpenModalProspectosRedes(false)}}/>
        <ModalTareas onHide={onCloseModalTareas} show={isOpenModalTareas.isOpen} lead={isOpenModalTareas.lead}/>
        <ModalCustomComercial id={isOpenModalGestionComercial.id} show={isOpenModalGestionComercial.isOpen} onHide={onCloseModalGestionComercial} isCopy={isOpenModalGestionComercial.isCopy} lead={isOpenModalGestionComercial.lead}/>
    </div>
  )
}
