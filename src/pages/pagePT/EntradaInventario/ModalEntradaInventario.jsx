import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { useEntradaInventario } from './useEntradaInventario'
import Select from 'react-select'
import { useForm } from '@/hooks/useForm'
const regRegistro = {
    id_item: 0,
    cantidad:  0,
    id_motivo: 0, 
    observacion: '',
    fecha_cambio: '',
    action: 'ENTRADA'
}
export const ModalEntradaInventario = ({show, onHide}) => {
    const { obtenerArticulosInventario, dataArticulos } = useEntradaInventario()
    const { formState, id_item, cantidad, fecha_cambio, id_motivo, observacion, onInputChange, onInputChangeReact, onResetForm } = useForm(regRegistro)
    useEffect(() => {
        obtenerArticulosInventario()
    }, [])
    const onCancelModal = ()=>{
        onHide()
        onResetForm()
    }
    
  return (
    <Dialog header={'ENTRADA DE ARTICULO'} style={{width: '40rem'}} visible={show} onHide={onHide}>
        <form>
            <div className='m-2'>
                <label>ITEM</label>
                <Select
                    options={dataArticulos}
                    onChange={(e) => onInputChangeReact(e, 'id_item')}
                    name="id_item"
                    placeholder={'Selecciona el item'}
                    className="react-select"
                    classNamePrefix="react-select"
                    value={dataArticulos.find(
                    	(option) => option.value === id_item
                    )}
                    required
                />
            </div>
            <div className='m-2'>
                <label>CANTIDAD</label>
                <input type='text' name='cantidad' onChange={onInputChange} value={cantidad} className='form-control'/>
            </div>
            <div className='m-2'>
                <label>FECHA DE ENTRADA</label>
                <input type='date' name='fecha_cambio' onChange={onInputChange} value={fecha_cambio} className='form-control'/>
            </div>
            <div className='m-2'>
                <label>MOTIVO</label>
                <Select
                    options={dataArticulos}
                    onChange={(e) => onInputChangeReact(e, 'id_motivo')}
                    name="id_motivo"
                    placeholder={'Selecciona el motivo'}
                    className="react-select"
                    classNamePrefix="react-select"
                    value={dataArticulos.find(
                    	(option) => option.value === id_motivo
                    )}
                    required
                />
            </div>
            <div className='m-2'>
                <label>OBSERVACION</label>
                <textarea className='form-control' onChange={onInputChange} id="" value={observacion} name='observacion'></textarea>
            </div>
            <Button label='AGREGAR'/>
            <Button label='cancelar' text onClick={onCancelModal}/>
        </form>
    </Dialog>
  )
}
