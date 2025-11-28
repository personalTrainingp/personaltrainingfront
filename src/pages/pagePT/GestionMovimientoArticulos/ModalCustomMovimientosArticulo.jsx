import { InputDate, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { Dialog } from 'primereact/dialog'
import React from 'react'
const customMovimientoArticulo={
  id_articulo: 0,
  id_motivo: 0,
  observacion: '',
  cantidad: 0,
  fecha_cambio: '',
  movimiento: '',
  id_lugar_movimiento: 0
}
export const ModalCustomMovimientosArticulo = ({show=true, onHide, id=0, movimiento}) => {
    const { formState, id_articulo, id_motivo, observacion, cantidad, fecha_cambio, movimiento, id_lugar_movimiento, onInputChange } = useForm(customMovimientoArticulo)
  return (
    <Dialog onHide={onHide} visible={show} header={'Agregar Mo'}>
        <form>
          <div className='mb-2'>
            <InputSelect label={'Articulo'} nameInput={'id_articulo'} onChange={onInputChange} value={id_articulo} required options={[]}/>
          </div>
          <div className='mb-2'>
            <InputSelect label={'Motivo'} nameInput={'id_motivo'} onChange={onInputChange} value={id_motivo} required options={[]}/>
          </div>
          <div className='mb-2'>
            <InputSelect label={'Lugar de destino'} nameInput={'id_motivo'} onChange={onInputChange} value={id_lugar_movimiento} required options={[]}/>
          </div>
          <div className='mb-2'>
            <InputDate label={'Fecha de cambio'} nameInput={'fecha_cambio'} onChange={onInputChange} value={fecha_cambio} required/>
          </div>
          <div className='mb-2'>
            <InputDate label={'Cantidad'} nameInput={'cantidad'} onChange={onInputChange} value={cantidad} required/>
          </div>
          <div className='mb-2'>
            <InputTextArea label={'observacion'} nameInput={'observacion'} onChange={onInputChange}  value={observacion}  required/>
          </div>
        </form>
    </Dialog>
  )
}
