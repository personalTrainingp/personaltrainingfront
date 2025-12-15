import { InputButton, InputDate, InputNumber, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { useMovimientoArticulosStore } from './useMovimientoArticulosStore'
import { TerminosOnShow } from '@/hooks/usePropiedadesStore'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
const customMovimientoArticulo={
  id_articulo: 0,
  id_motivo: 0,
  observacion: '',
  cantidad: 0,
  fechaCambio: '',
  movimiento: '',
  id_lugar_destino: 0
}
export const ModalCustomMovimientosArticulo = ({show=true, onHide, id=0, movimiento, idArticulo, idEmpresa}) => {
  const { postMovimientoArticulo, updateMovimientoArticulo, onObtenerArticuloxIDARTICULO, dataArticuloxIDARTICULO } = useMovimientoArticulosStore()
    const { formState, id_articulo, id_motivo, observacion, cantidad, fechaCambio, id_lugar_destino, id_empresa, onInputChange, onResetForm } = useForm(customMovimientoArticulo)
    const { dataEmpresas, dataKardexMovimiento } = TerminosOnShow(show)
    const { dataZonas, obtenerZonas } = useTerminoStore()   
    const onSubmitMovimientoArticulo= ()=>{
      if(id==0){
        postMovimientoArticulo({...formState, id_articulo: idArticulo}, idArticulo, movimiento, idEmpresa)
      }
      else{
        updateMovimientoArticulo(id, {...formState, id_articulo: idArticulo}, movimiento, idArticulo, idEmpresa)
      }
      onCloseModal()
    }
    const onCloseModal = ()=>{
      onHide()
      onResetForm()
    }
    useEffect(() => {
      onObtenerArticuloxIDARTICULO(idArticulo)
    }, [idArticulo])
    useEffect(() => {
      obtenerZonas(id_empresa)
    }, [id_empresa])
    
    console.log({dataArticuloxIDARTICULO});
    
  return (
    <Dialog onHide={onCloseModal} visible={show} header={`Agregar Movimiento de ${idArticulo}`}>
        <form>
          <div className='mb-2'>
            <InputSelect label={'Motivo'} nameInput={'id_motivo'} onChange={onInputChange} value={id_motivo} required options={dataKardexMovimiento.filter(e=>e.grupo===movimiento)}/>
          </div>
          {
            movimiento==='traspaso' && (
              <>
                <div className='mb-2'>
                  <InputSelect label={'Empresa'} nameInput={'id_empresa'} onChange={onInputChange} value={id_empresa} required options={dataEmpresas}/>
                </div>
                <div className='mb-2'>
                  <InputSelect label={'Lugar de destino'} nameInput={'id_motivo'} onChange={onInputChange} value={id_lugar_destino} required options={dataZonas}/>
                </div>
              </>
            )
          }
          <div className='mb-2'>
            <InputDate label={'Fecha de cambio'} nameInput={'fechaCambio'} onChange={onInputChange} value={fechaCambio} required/>
          </div>
          <div className='mb-2'>
            <InputNumber label={'Cantidad'} nameInput={'cantidad'} onChange={onInputChange} value={cantidad} required/>
          </div>
          <div className='mb-2'>
            <InputTextArea label={'observacion'} nameInput={'observacion'} onChange={onInputChange}  value={observacion}  required/>
          </div>
          <div>
            <InputButton label={'Agregar'} onClick={onSubmitMovimientoArticulo} className={''}/>
            <InputButton label={'Cancelar'} onClick={onSubmitMovimientoArticulo} className={''}/>
          </div>
        </form>
    </Dialog>
  )
}
