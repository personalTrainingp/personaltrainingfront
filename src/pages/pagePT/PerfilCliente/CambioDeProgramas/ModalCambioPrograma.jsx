import { InputDate, InputSelect, InputText } from '@/components/InputText'
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
    const { formState, id_cli, id_venta, observacion, id_pgm, id_motivo, fecha_cambio, id_horario, onInputChange, onInputChangeReact, onResetForm } = useForm(registerCambioPrograma)
    const {obtenerParametrosClientes, DataClientes, obtenerParametrosVendedores, DataVendedores} = useTerminoStore()
        const { startRegisterProgramaTraining, startObtenerTBProgramaPT } = useProgramaTrainingStore();
        const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
	let { datapgmPT } = useSelector((e) => e.programaPT);
    useEffect(() => {
        obtenerParametrosClientes()
        startObtenerTBProgramaPT()
        obtenerParametroPorEntidadyGrupo('cambio_pgm', 'motivo')
    }, [])
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
            <InputSelect label={'Cliente'} nameInput={'id_cli'} onChange={onInputChange} required options={DataClientes} value={id_cli}/>
            <InputDate label={'Fecha en la que se cambio de programa'} nameInput={'fecha_cambio'} onChange={onInputChange} required value={fecha_cambio}/>
            <InputSelect label={'Programa'} nameInput={'id_pgm'} onChange={onInputChange} required value={id_pgm} options={datapgmPT}/>
            <InputSelect label={'Horario'} nameInput={'id_horario'} onChange={onInputChange} required value={id_horario} options={datapgmPT}/>
            <InputSelect label={'Motivo'} nameInput={'id_motivo'} onChange={onInputChange} required value={id_motivo} options={DataGeneral}/>
        <div className='mb-2'>
            <label>OBSERVACION:</label>
            <textarea
            className='form-control'
            name='observacion'
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
