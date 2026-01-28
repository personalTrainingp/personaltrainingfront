import { InputButton, InputDate, InputFile, InputNumber, InputSelect, InputText, InputTextArea } from '@/components/InputText'
import { useForm } from '@/hooks/useForm'
import { TerminosOnShow } from '@/hooks/usePropiedadesStore'
import { arrayEmpresaFinan, arrayMonedas } from '@/types/type'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import { useContratosProveedores } from './useContratosProveedores'
import { useSelector } from 'react-redux'
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore'
const customContratosProveedores={
    id_prov: 0, 
    fecha_inicio: '', 
    fecha_fin: '', 
    hora_fin: '', 
    monto_contrato: 0.00, 
    estado_contrato: 0, 
    id_empresa: 0, 
    mano_obra_soles: 0.00, 
    mano_obra_dolares: 0.00, 
    tipo_moneda: 'PEN',
    id_zona: 0,
    observacion: ''
}
export const ModalCustomProveedores = ({show=false, onHide, id=0, id_empresa1, isCopy=false}) => {
    const [file_contrato, setfile_contrato] = useState(null);
    const [file_compromisoPago, setfile_compromisoPago] = useState(null);
    const { onPostContratosProveedores, obtenerContratosProveedoresxID, dataContratoProveedor, onUpdateContratosProveedoresxID } = useContratosProveedores()
    const { formState, 
            id_prov, 
            fecha_inicio, 
            fecha_fin, 
            hora_fin, 
            observacion, 
            estado_contrato, 
            tipo_moneda,
            uid_contrato, uid_compromisoPago, mano_obra_soles, id_empresa, monto_contrato, mano_obra_dolares, id_zona, onInputChange, onResetForm  } = useForm(dataContratoProveedor)
    const { dataEmpresas, dataZonasxEmpresa, obtenerZonasxEmpresa, dataEstadoContrato } = TerminosOnShow(show)
        const { obtenerParametrosProveedor } = useProveedorStore()
  const { dataProvCOMBO } = useSelector((s) => s.prov);
    useEffect(() => {
        if(id!==0){
            obtenerContratosProveedoresxID(id)
        }
    }, [id, show]) 
    useEffect(() => {
        if(id_empresa){
            obtenerZonasxEmpresa(id_empresa)
            obtenerParametrosProveedor(id_empresa)
        }
    }, [id_empresa])
    const onSubmitCustomProveedores = ()=>{
        if(id==0 || isCopy){
            onPostContratosProveedores(formState, id_empresa1, file_compromisoPago, file_contrato)
            cancelarModal()
            return;
        }else{
            onUpdateContratosProveedoresxID(id, id_empresa1, formState, file_compromisoPago, file_contrato)
            cancelarModal()
            return;
        }
    }
    const cancelarModal = ()=>{
        onResetForm()
        setfile_compromisoPago(null)
        setfile_contrato(null)
        onHide()
    }
    const onFileContratoChange = (e)=>{
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setfile_contrato(formData);
        // reader.readAsDataURL(file);
    }
    const onFileCompromisoPagoChange = (e)=>{
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setfile_compromisoPago(formData);
        // reader.readAsDataURL(file);
    }
  return (
    <Dialog onHide={()=>cancelarModal()} visible={show} header={`${id==0?'AGREGAR CONTRATO':'ACTUALIZAR CONTRATO'}`} style={{width: '40rem'}}>
        <form>
            <div className='mb-3'>
                    <label htmlFor="penalidad_fijo" className="form-label">
                        COMPROMISO PAGO*
                    </label>
                    <input
                            className="form-control bg-black text-white"
                            placeholder="file_compromisoPago"
                            // value={file_presupuesto}
                            name="file_compromisoPago"
                            // id="penalidad_fijo"
                            type="file"
                            onChange={(e)=>onFileCompromisoPagoChange(e)}
                        />
                </div>
                <div className='mb-3'>
                    <label htmlFor="penalidad_fijo" className="form-label">
                        CONTRATO / PRESUPUESTO*
                    </label>
                    <input
                            className="form-control bg-black text-white"
                            placeholder="file_contrato"
                            // value={file_presupuesto}
                            name="file_contrato"
                            // id="penalidad_fijo"
                            type="file"
                            onChange={(e)=>onFileContratoChange(e)}
                        />
                </div>
            <div className='mb-3'>
                <InputSelect label={'Estado'} options={dataEstadoContrato} nameInput={'estado_contrato'} onChange={onInputChange} value={estado_contrato}  />
            </div>
            <div className='mb-3'>
                <InputSelect label={'Empresa'} options={dataEmpresas} nameInput={'id_empresa'} onChange={onInputChange} value={id_empresa}  />
            </div>
            <div className='mb-3'>
                <InputSelect label={'Proveedor'} nameInput={'id_prov'} options={dataProvCOMBO} onChange={onInputChange} value={id_prov}  />
            </div>
            <div className='mb-3'>
                <InputSelect label={'Zona'} nameInput={'id_zona'} options={dataZonasxEmpresa} onChange={onInputChange} value={id_zona}  />
            </div>
            <div className='mb-3'>
                <InputDate label={'Fecha de inicio'} nameInput={'fecha_inicio'} onChange={onInputChange} value={fecha_inicio} />
            </div>
            <div className='mb-3'>
                <InputDate label={'Fecha de fin'} nameInput={'fecha_fin'} onChange={onInputChange} value={fecha_fin} />
            </div>
            <div className='mb-3'>
                <InputDate label={'hora fin'} type='time' nameInput={'hora_fin'} onChange={onInputChange} value={hora_fin} />
            </div>
            <div className='mb-3'>
                <InputTextArea label={'OBSERVACION'} nameInput={'observacion'} onChange={onInputChange} value={observacion} />
            </div>
            <div className='mb-3'>
                <InputNumber label={'Monto de compra de activos'} nameInput={'mano_obra_soles'} onChange={onInputChange} value={mano_obra_soles} />
            </div>
            <div className='mb-3'>
                <InputSelect label={'TIPO DE MONEDA'} nameInput={'tipo_moneda'} options={arrayMonedas} onChange={onInputChange} value={tipo_moneda}  />
            </div>
            <div className='mb-3'>
                <InputNumber label={'MANO DE OBRA EN SOLES'} nameInput={'monto_contrato'} onChange={onInputChange} value={monto_contrato} />
            </div>
            <div className='mb-3'>
                <InputNumber label={'MANO DE OBRA EN DOLARES'} nameInput={'mano_obra_dolares'} onChange={onInputChange} value={mano_obra_dolares} />
            </div>
            <div className='mb-3'>
                <InputButton label={'AGREGAR'} onClick={onSubmitCustomProveedores}/>
            </div>
        </form>
    </Dialog>
  )
}
