import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore';
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { useForm } from '@/hooks/useForm';
import { arrayCargoEmpl, arrayEmpresaFinan, arrayEstadoContrato, arrayEstadoTask } from '@/types/type';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { usePagoProveedoresStore } from './usePagoProveedoresStore';
import { NumberFormatMoney } from '@/components/CurrencyMask';
const registerTrabajo = {
    id_prov: 0,
    cod_trabajo: '',
    penalidad_fijo: 0,
    penalidad_porcentaje: 0,
    fecha_inicio: new Date(),
    fecha_fin: new Date(),
    estado_contrato: 505,
    monto_contrato: 0,
    observacion: '',
    id_estado: 505,
    mano_obra_soles: 0,
    mano_obra_dolares: 0,
    id_empresa: 0,
    id_zona: 0,
    hora_fin: '12:00'
};
export const ModalCustomPagosProveedores = ({ show, onHide, id_empresa1, id=0, isCopy=false }) => {
    const [file_presupuesto, setfile_presupuesto] = useState(null);
    const [file_contrato, setfile_contrato] = useState(null);
    const [file_compromisoPago, setfile_compromisoPago] = useState(null);
    const { postContratoProv, obtenerProveedores, obtenerParametrosProveedor } = useProveedorStore()
    const { obtenerContratoxId, dataContrato, updateContratoxId } = usePagoProveedoresStore()

    const {
        formState,
        cod_trabajo,
        penalidad_fijo,
        fecha_inicio,
        fecha_fin,
        hora_fin,
        monto_contrato,
        estado_contrato,
        observacion,
        id_prov,
        id_empresa,
        mano_obra_soles,
        mano_obra_dolares,
        id_zona,
        onInputChange,
        onInputChangeReact,
        onResetForm,
    } = useForm(id==0?registerTrabajo:dataContrato);
    const { obtenerZonas, dataZonas } =  useTerminoStore()
  const { dataProveedores, dataProvCOMBO } = useSelector((s) => s.prov);
  useEffect(() => {
    if(id!==0){
        obtenerContratoxId(id)
    }
  }, [id, show])
  
    const onCancelModal = () => {
        onHide();
        onResetForm()
        setfile_presupuesto(null)
        setfile_contrato(null)
    };
    const onSubmitTrabajo = (e) => {
        e.preventDefault();
        if(id==0){
            postContratoProv({...formState}, id_prov, file_presupuesto, file_contrato, file_compromisoPago)
            onCancelModal();
            return;
        }else{
            if(isCopy){
                const {id, ...value} = formState;
            postContratoProv({...value}, id_prov, file_presupuesto, file_contrato, file_compromisoPago)
            onCancelModal();
            return;
            }else{
                updateContratoxId(id, {...formState}, id_empresa)
                onCancelModal();
                return;
            }
        }
    };
    const onFileCompromisoPagoChange = (e)=>{
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setfile_compromisoPago(formData);
        // reader.readAsDataURL(file);
    }
    const onFilePresupuestoChange = (e)=>{
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setfile_presupuesto(formData);
        // reader.readAsDataURL(file);
    }
    const onFileContratoChange = (e)=>{
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);
        setfile_contrato(formData);
        // reader.readAsDataURL(file);
    }
    useEffect(() => {
        if( id_empresa){
            obtenerParametrosProveedor(id_empresa1??id_empresa)
            obtenerZonas(id_empresa)
        }
    }, [show, id_empresa, id_empresa1])
    
    const proveedores = dataProveedores.map(prov=>{
        return {
            label: prov.razon_social_prov,
            value: prov.id
        }
    })
    return (
        <Dialog header={id==0?`Agregar Trabajos`:`EDITAR TRABAJO ${id}`} style={{ width: '50vw' }} position='top' onHide={onHide} visible={show}>
            <form onSubmit={onSubmitTrabajo}>
                {
                    id==0?(
                        <>
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
                        </>
                    ): (
                        <>
                        </>
                    )
                }
                <div className="mb-3">
                    <label htmlFor="id_prov" className="font-bold">
                        Proveedor*
                    </label>
                    <Select
                        onChange={(e) => onInputChangeReact(e, 'id_prov')}
                        name="id_prov"
                        placeholder={'Seleccionar el proveedor'}
                        className="react-select"
                        classNamePrefix="react-select"
                        options={dataProvCOMBO}
                        value={dataProvCOMBO.find(
                            (option) => option.value === id_prov
                        )||0}
                        required
                    />
                </div>
                <div className="mb-3">
                            <label htmlFor="id_empresa" className="font-bold">
                                EMPRESA*
                            </label>
                            <Select
                                onChange={(e) => onInputChangeReact(e, 'id_empresa')}
                                name="id_empresa"
                                placeholder={'Seleccionar la empresa'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={arrayEmpresaFinan}
                                value={arrayEmpresaFinan.find(
                                    (option) => option.value === id_empresa
                                )||0}
                                required
                            />
                        </div>
                <div className="mb-3">
                            <label htmlFor="id_zona" className="font-bold">
                                ZONA*
                            </label>
                            <Select
                                onChange={(e) => onInputChangeReact(e, 'id_zona')}
                                name="id_zona"
                                placeholder={'Seleccionar la zona'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={[{value: 0, label: 'EN BLANCO'}, ...dataZonas]}
                                value={[{value: 0, label: 'EN BLANCO'}, ...dataZonas].find(
                                    (option) => option.value === id_zona
                                )||0}
                                required
                            />
                        </div>
                <div className="mb-3">
                            <label htmlFor="estado_contrato" className="font-bold">
                                Estado*
                            </label>
                            <Select
                                onChange={(e) => onInputChangeReact(e, 'estado_contrato')}
                                name="estado_contrato"
                                placeholder={'Seleccionar el estado'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={arrayEstadoContrato}
                                value={arrayEstadoContrato.find(
                                    (option) => option.value === estado_contrato
                                )||0}
                                required
                            />
                        </div>
        <div className="mb-3">
                    <label htmlFor="fecha_inicio" className="form-label">
                        Fecha inicio*
                    </label>
                    <input
                        className="form-control"
                        placeholder="Fecha de inicio"
                        value={fecha_inicio}
                        name="fecha_inicio"
                        id="fecha_inicio"
                        type="date"
                        onChange={onInputChange}
                        required
                    />
                </div>
        <div className="mb-3">
                    <label htmlFor="fecha_fin" className="form-label">
                        Fecha termino*
                    </label>
                    <input
                        className="form-control"
                        placeholder="Fecha FIN"
                        value={fecha_fin}
                        name="fecha_fin"
                        id="fecha_fin"
                        type="date"
                        onChange={onInputChange}
                        required
                    />
                </div>
        <div className="mb-3">
                    <label htmlFor="hora_fin" className="form-label">
                        Hora termino*
                    </label>
                    <input
                        className="form-control"
                        placeholder="Hora de termino"
                        value={hora_fin}
                        name="hora_fin"
                        id="hora_fin"
                        type="time"
                        onChange={onInputChange}
                        required
                    />
                </div>
        <div className="mb-3">
                    <label htmlFor="monto_contrato" className="form-label">
                        Mano de obra en soles*
                    </label>
                    <input
                        className="form-control"
                        placeholder="Presupuesto"
                        value={monto_contrato}
                        name="monto_contrato"
                        id="monto_contrato"
                        type="text"
                        onChange={onInputChange}
                        required
                    />
                </div>
                <div className="mb-3">
					<label htmlFor="mano_obra_dolares" className="form-label">
						MANO DE OBRA EN DOLARES*
					</label>
					<input
						className="form-control"
						placeholder="mano de obra en dolares"
						value={mano_obra_dolares}
						name="mano_obra_dolares"
						id="mano_obra_dolares"
						type="text"
						onChange={onInputChange}
						required
					/>
				</div>
                <div className="mb-3">
                    <label htmlFor="observacion" className="form-label">
                        Observacion*
                    </label>
                    <textarea
                        className="form-control"
                        placeholder="..."
                        value={observacion}
                        name="observacion"
                        id="observacion"
                        onChange={onInputChange}
                        required
                    />
                </div>
        <div className='mb-3'>
          <Row>
            <Col xxl={3}>
            <Button type="submit">Agregar</Button>
            </Col>
            
            <Col lg={3}>
                <Button label="Cancelar" icon="pi pi-times" outlined onClick={onCancelModal} />
            </Col>
          </Row>
        </div>
            </form>
        </Dialog>
    );
};
