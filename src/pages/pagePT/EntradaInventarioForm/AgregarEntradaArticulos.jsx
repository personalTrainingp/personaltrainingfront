import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useEffect } from 'react'
import { useEntradaInventario } from './useEntradaInventario'
import Select from 'react-select'
import { useForm } from '@/hooks/useForm'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { PageBreadcrumb } from '@/components'
import Swal from 'sweetalert2'
import { confirmDialog } from 'primereact/confirmdialog'
const regRegistro = {
    id_item: 0,
    cantidad:  0,
    id_motivo: 0, 
    observacion: '',
    fecha_cambio: '',
}
export const AgregarEntradaArticulos = ({id_enterprice, actionKardex: action}) => {
    const { obtenerArticulosInventario, dataArticulos, postKardex } = useEntradaInventario()
    const { obtenerParametroPorEntidadyGrupo, DataGeneral } = useTerminoStore()
    const { formState, id_item, cantidad, fecha_cambio, id_motivo, observacion, onInputChange, onInputChangeReact, onResetForm } = useForm(regRegistro)
    useEffect(() => {
        obtenerArticulosInventario(id_enterprice)
        obtenerParametroPorEntidadyGrupo('kardex', action)
    }, [])
    const onCancelModal = ()=>{
        onHide()
        onResetForm()
    }

    const dataSelect = dataArticulos.find(
        (option) => option.value === id_item
    )

    const onSubmitKardex = (e)=>{   
        e.preventDefault()
        confirmDialog({
            header: 'Estas seguro de querer agregar una entrada de este articulo',
            message: <div className='fs-2 text-center d-flex align-items-center justify-content-center flex-column'>
                        <div><span className='fw-bold'>Lugar:</span> {dataSelect.lugar}</div>
                        <div><span className='fw-bold'>Producto:</span> {dataSelect.producto}</div>
                        <div><span className='fw-bold'>Costo unitario:</span> {dataSelect.costo_unitario}</div>
                        <div><span className='fw-bold'>CANTIDAD: </span>{cantidad}</div>
                        {/* <div style={{fontSize: '70px'}}>🤔</div> */}
                    </div>,
            accept: () => {
                postKardex(action, id_enterprice, formState)
            },
            reject: () => {
                // nothing to do
                console.log("nop");
                
            }
        })
        // onCancelModal()
    }

  return (
      <div>
        <PageBreadcrumb title={'ENTRADA Y SALIDA DE INVENTARIOS'}/>
        <form onSubmit={onSubmitKardex}>
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
                    options={DataGeneral}
                    onChange={(e) => onInputChangeReact(e, 'id_motivo')}
                    name="id_motivo"
                    placeholder={'Selecciona el motivo'}
                    className="react-select"
                    classNamePrefix="react-select"
                    value={DataGeneral.find(
                    	(option) => option.value === id_motivo
                    )}
                    required
                />
            </div>
            <div className='m-2'>
                <label>OBSERVACION</label>
                <textarea className='form-control' onChange={onInputChange} id="" value={observacion} name='observacion'></textarea>
            </div>
            <Button label='AGREGAR' type='submit'/>
            <Button label='cancelar' text onClick={onCancelModal}/>
        </form>
    </div>
  )
}
