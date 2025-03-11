import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { useForm } from '@/hooks/useForm'
import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import Select from 'react-select'
const registerCambioPrograma = {
    id_pgm: 0, 
    id_venta: 0,
    id_cli: 0,
    fecha_cambio: new Date(),
    id_motivo: 0,
    observacion: ''
}
export const ModalCambioPrograma = ({show, onHide}) => {
    const { formState, id_cli, id_venta, observacion, id_pgm, id_motivo, fecha_cambio, onInputChange, onInputChangeReact, onResetForm } = useForm(registerCambioPrograma)
    const {obtenerParametrosClientes, DataClientes, obtenerParametrosVendedores, DataVendedores} = useTerminoStore()
        const { startRegisterProgramaTraining, startObtenerTBProgramaPT } = useProgramaTrainingStore();
        const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
	let { datapgmPT } = useSelector((e) => e.programaPT);
    useEffect(() => {
        obtenerParametrosClientes()
        startObtenerTBProgramaPT()
        obtenerParametroPorEntidadyGrupo('cambio_pgm', 'motivo')
    }, [])
    console.log({datapgmPT});
    
    datapgmPT = datapgmPT.map(f=>{
        return{
            value: f.id_pgm,
            label: f.name_pgm
        }
    })
    
    const onCancelarCambioPrograma = ()=>{
        onHide()
        onResetForm()
    }
    const onSubmitCambioPrograma = ()=>{
        console.log();
        
    }
  return (
    <Dialog style={{width: '50rem'}} visible={show} onHide={onCancelarCambioPrograma} header={'AGREGAR CAMBIO DE PROGRAMA'}>
        <form onSubmit={onSubmitCambioPrograma}>
        <div className='mb-2'>
            <label>Cliente:</label>
            <Select
                onChange={(e) => {
                return onInputChangeReact(e, 'id_cli')
                }}
                name={'id_cli'}
                placeholder={'Seleccionar el cliente'}
                className="react-select"
                options={DataClientes}
                value={DataClientes.find(e=>e.value===id_cli) || 0}
                classNamePrefix="react-select"
                required
            ></Select>
        </div>
        <div className='mb-2'>
            <label>Fecha en la que se cambio de programa:</label>
            <input
                type='date'
                className='form-control'
                value={fecha_cambio}
                name='fecha_cambio'
                onChange={onInputChange}
                />
        </div>
        <div className='mb-2'>
            <label>Programa:</label>
            <Select
                onChange={(e) => {
                return onInputChangeReact(e, 'id_cli')
                }}
                name={'id_cli'}
                placeholder={'Seleccionar el programa'}
                className="react-select"
                options={datapgmPT}
                value={datapgmPT.find(e=>e.value===id_pgm) || 0}
                classNamePrefix="react-select"
                required
            ></Select>
        </div>
        <div className='mb-2'>
            <label>Horario:</label>
            <Select
                onChange={(e) => {
                return onInputChangeReact(e, 'id_cli')
                }}
                name={'id_cli'}
                placeholder={'Seleccionar el horario'}
                className="react-select"
                options={datapgmPT}
                value={datapgmPT.find(e=>e.value===id_pgm) || 0}
                classNamePrefix="react-select"
                required
            ></Select>
        </div>
        <div className='mb-2'>
            <label>MOTIVO:</label>
            <Select
                onChange={(e) => {
                return onInputChangeReact(e, 'id_cli')
                }}
                name={'id_cli'}
                placeholder={'Seleccionar el programa'}
                className="react-select"
                options={DataGeneral}
                value={DataGeneral.find(e=>e.value===id_motivo) || 0}
                classNamePrefix="react-select"
                required
            ></Select>
        </div>
        <div className='mb-2'>
            <label>OBSERVACION:</label>
            <textarea
            className='form-control'
            value={observacion}
            onChange={onInputChange}
            />
        </div>
        <Button label='GUARDAR' type='submit'/> 
        <Button label='CANCELAR' text onClick={onCancelarCambioPrograma}/>
        </form>
    </Dialog>
  )
}
