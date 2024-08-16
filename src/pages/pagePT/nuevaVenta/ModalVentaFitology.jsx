import { useForm } from '@/hooks/useForm'
import React, { useEffect, useState } from 'react'
import { Modal, Row } from 'react-bootstrap'
import Select from 'react-select'
import { arrayServiciosFitologyTest } from '../../../types/type'
import { MoneyFormatter } from '@/components/CurrencyMask'
import { useDispatch } from 'react-redux'
import { onAddDetalleFitology } from '@/store/uiNuevaVenta/uiNuevaVenta'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore'
const registerVentaFitology = {
    id_servicio: 0,
}
export const ModalVentaFitology = ({show, onHide, data}) => {
    const dispatch = useDispatch()
    const { formState, id_servicio, onResetForm, onInputChange, onInputChangeReact } = useForm(data?data:registerVentaFitology)
	const [fitologySelect, setFitologySelect] = useState(undefined)
    const { obtenerPaqueteDeServicioParaVender, paquetesDeServicios } = useTerminoStore()
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
        obtenerPaqueteDeServicioParaVender('FITOL')
    }, [])
    
    useEffect(() => {
        const selectServFit = paquetesDeServicios.find(
            o => o.value === id_servicio
        ) || 0
        setFitologySelect(selectServFit)
    }, [id_servicio])
    const productoDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined />
            <Button label="Agregar venta" icon="pi pi-check" onClick={submitVentaFitology}/>
        </React.Fragment>
    )
  return (
    <Dialog
    visible={show}
            style={{ width: '50rem', height: '500px' }}
            breakpoints={{ '960px': '75vw', '641px': '90vw' }}
            header="VENDER CITAS FITOLOGY"
            modal
            className="p-fluid"
            footer={productoDialogFooter}
            onHide={cancelModal}
    >
        <form onSubmit={submitVentaFitology}>
                 <Row>
                     <Select
                      onChange={(e) => onInputChangeReact(e, 'id_servicio')}
                      name={'id_servicio'}
                      placeholder={'Seleccionar el servicio fitology'}
                      className="react-select"
                      classNamePrefix="react-select"
                      options={paquetesDeServicios}
                      value={paquetesDeServicios.find(o => o.value === id_servicio) || 0}
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
                 {/* <Button type='submit'>Agregar venta</Button> */}
             </form>
    </Dialog>
  )
}
