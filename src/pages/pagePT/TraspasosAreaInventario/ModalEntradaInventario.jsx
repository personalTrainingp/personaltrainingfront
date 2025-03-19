import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import React, { useEffect, useState } from 'react'
import { useEntradaInventario } from './useEntradaInventario'
import Select, { components } from 'react-select'
import { useForm } from '@/hooks/useForm'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
import { Col, Row } from 'react-bootstrap'
import { OrderList } from 'primereact/orderlist'
import { ComponenteDataViewSelect } from '@/components/componentDataViewSelect/ComponenteDataViewSelect';
const regRegistro = {
    id_item: 0,
    cantidad:  0,
    id_motivo: 0, 
    observacion: '',
    fecha_cambio: '',
}
export const ModalEntradaInventario = ({action, id_enterprice, show, onHide}) => {
    const { obtenerArticulosInventario, dataArticulos, postKardex } = useEntradaInventario()
    const { obtenerParametroPorEntidadyGrupo, DataGeneral, dataZonas, obtenerZonas } = useTerminoStore()
    const { formState, id_item, cantidad, fecha_cambio, id_motivo, observacion, onInputChange, onInputChangeReact, onResetForm } = useForm(regRegistro)
    const [selectedValue, setSelectedValue] = useState(null);
    useEffect(() => {
        obtenerArticulosInventario(id_enterprice)
        obtenerParametroPorEntidadyGrupo('kardex', action)
        obtenerZonas(id_enterprice)
    }, [])
    const onCancelModal = ()=>{
        onHide()
        onResetForm()
    }

    const onSubmitKardex = (e)=>{
        e.preventDefault()
        postKardex(action, id_enterprice, {...formState, id_item: selectedValue})
        onCancelModal()
    }

// Componente para personalizar cómo se muestran las opciones en el menú desplegable
const CustomOption = (props) => {
    return (
      <components.Option {...props}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={props.data.image}
            alt={props.data.label}
            style={{ width: '84px', marginRight: '8px' }}
          />
          <span>{props.data.label}</span>
          <small style={{ color: '#888', marginLeft: '8px' }}>
            ({props.data.category} - ${props.data.price})
          </small>
        </div>
      </components.Option>
    );
  };
  // Componente para personalizar cómo se muestra el valor seleccionado (cuando está cerrado el dropdown)
const CustomSingleValue = (props) => {
    return (
      <components.SingleValue {...props}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img
            src={props.data.image}
            alt={props.data.label}
            style={{ width: '84px', marginRight: '8px' }}
          />
          <span>{props.data.label}</span>
        </div>
      </components.SingleValue>
    );
  };
  
  return (
    <Dialog header={'SALIDA DE ARTICULO'} style={{width: '100rem'}} visible={show} onHide={onHide}>
        <form onSubmit={onSubmitKardex}>
        <Row>
            <Col lg={6}>
                <ComponenteDataViewSelect name={'id_item'} options={dataArticulos} onChange={(newValue) => setSelectedValue(newValue)} value={selectedValue}/>
            </Col>
            <Col lg={6}>
                <div className='m-2'>
                    <label>CANTIDAD</label>
                    <input type='text' name='cantidad' onChange={onInputChange} value={cantidad} className='form-control'/>
                </div>
                <div className='m-2'>
                    <label>FECHA DE TRASPASO</label>
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
            </Col>
        </Row>
            <Button label='AGREGAR' type='submit'/>
            <Button label='cancelar' text onClick={onCancelModal}/>
        </form>
    </Dialog>
  )
}
