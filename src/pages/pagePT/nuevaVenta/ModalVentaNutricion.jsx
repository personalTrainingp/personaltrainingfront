import { MoneyFormatter } from '@/components/CurrencyMask'
import { useForm } from '@/hooks/useForm'
import { onAddOneNutricion } from '@/store/uiNuevaVenta/uiNuevaVenta'
import { arrayServiciosNutricionalesTest } from '@/types/type'
import React, { useEffect, useState } from 'react'
import { Button, Modal, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import Select from 'react-select'
const registerVentaNutricion = {
    id_servicio: 0,
}
export const ModalVentaNutricion = ({show, onHide, data}) => {
    const dispatch = useDispatch()
    const { formState, id_servicio, onResetForm, onInputChange, onInputChangeReact } = useForm(data?data:registerVentaNutricion)
	const [NutricionSelect, setNutricionSelect] = useState(undefined)
    const cancelModal = () =>{
        onHide()
        onResetForm()
    }
    const submitVentaNutricion = (e)=>{
        e.preventDefault()
        dispatch(onAddOneNutricion(NutricionSelect))
        cancelModal()
    }
    useEffect(() => {
        const selectServFit = arrayServiciosNutricionalesTest.find(
            o => o.value === id_servicio
        ) || 0
        setNutricionSelect(selectServFit)
    }, [id_servicio])
  return (
    <Modal show={show} onHide={cancelModal}>
        <Modal.Header>
            <Modal.Title>Registrar venta de nutricion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={submitVentaNutricion}>
                <Row>
                <Select
                     onChange={(e) => onInputChangeReact(e, 'id_servicio')}
                     name={'id_servicio'}
                     placeholder={'Seleccionar el servicio nutricion'}
                     className="react-select"
                     classNamePrefix="react-select"
                     options={arrayServiciosNutricionalesTest}
                     value={arrayServiciosNutricionalesTest.find(o => o.value === id_servicio) || 0}
                     required
                    />
                </Row>
                {NutricionSelect !== 0 && (
                    <div className='info-producto mb-2'>
                    <table>
                        <tbody>
                            <tr>
                                <td>Cantidad: </td>
                                <td>
                                    {NutricionSelect?.cantidad}
                                </td>
                            </tr>
                            <tr>
                                <td>Total: </td>
                                <td>
                                    <MoneyFormatter amount={NutricionSelect?.tarifa}/>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                )
                }
                <Button type='submit'>Agregar venta</Button>
            </form>
        </Modal.Body>
    </Modal>
  )
}
