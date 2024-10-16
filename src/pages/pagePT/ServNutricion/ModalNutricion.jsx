import { useForm } from '@/hooks/useForm';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog'
import React from 'react'
const registerNutricion = {
    nombre_cita: '',
    cantidad: 0,
    
}
export const ModalNutricion = ({show, onHide, data}) => {
    
    const { onResetForm } = useForm(registerNutricion)
    
    const cancelModal = ()=>{
        onHide()
        onResetForm()
    }
    const submitServicio = ()=>{
        
    }
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" outlined onClick={cancelModal} />
            <Button label="Guardar" icon="pi pi-check" onClick={submitServicio} />
        </React.Fragment>
    );
  return (
    
    <Dialog visible={show} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Crear Servicio" modal className="p-fluid" footer={productDialogFooter} onHide={cancelModal}>
    
        <div className="p-field">
            <label htmlFor="nombre_cita">Nombre Cita</label>
            <input type="text" id="nombre_cita" name="nombre_cita" className="p-inputtext" />
        </div>
    </Dialog>
  )
}
