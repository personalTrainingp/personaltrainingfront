import { useForm } from '@/hooks/useForm'
import React, { useEffect, useState } from 'react'
import { Button, Modal, Row } from 'react-bootstrap'
import Select from 'react-select'
import { arrayServiciosFitologyTest } from '../../../types/type'
import { MoneyFormatter } from '@/components/CurrencyMask'
import { useDispatch } from 'react-redux'
import { onAddDetalleFitology } from '@/store/uiNuevaVenta/uiNuevaVenta'
const registerVentaFitology = {
    id_servicio: 0,
}
export const ModalVentaFitology = ({show, onHide, data}) => {
    const dispatch = useDispatch()
    const { formState, id_servicio, onResetForm, onInputChange, onInputChangeReact } = useForm(data?data:registerVentaFitology)
	const [fitologySelect, setFitologySelect] = useState(undefined)
    const cancelModal = () =>{
        onHide()
        onResetForm()
    }
    const submitVentaFitology = (e)=>{
        e.preventDefault()
        // label: 'LPG + LIPOLASER', value: 2, cantidad: 21, tarifa: 1334.4
        const { value, tarifa, cantidad } = fitologySelect;
        dispatch(onAddDetalleFitology(fitologySelect))
        cancelModal()
    }
    useEffect(() => {
        const selectServFit = arrayServiciosFitologyTest.find(
            o => o.value === id_servicio
        ) || 0
        setFitologySelect(selectServFit)
    }, [id_servicio])
  return (
    <Modal onHide={cancelModal} show={show}>
        <Modal.Header>
            <Modal.Title>
                Registrar venta de cita fitology
            </Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={submitVentaFitology}>
                <Row>
                    <Select
                     onChange={(e) => onInputChangeReact(e, 'id_servicio')}
                     name={'id_servicio'}
                     placeholder={'Seleccionar el servicio fitology'}
                     className="react-select"
                     classNamePrefix="react-select"
                     options={arrayServiciosFitologyTest}
                     value={arrayServiciosFitologyTest.find(o => o.value === id_servicio) || 0}
                     required
                    />
                </Row>
                {fitologySelect !== 0 && (
                    <div className='info-producto mb-2'>
                    <table>
                        <tbody>
                            <tr>
                                <td>Cantidad: </td>
                                <td>
                                    {fitologySelect?.cantidad}
                                </td>
                            </tr>
                            <tr>
                                <td>Total: </td>
                                <td>
                                    <MoneyFormatter amount={fitologySelect?.tarifa}/>
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
