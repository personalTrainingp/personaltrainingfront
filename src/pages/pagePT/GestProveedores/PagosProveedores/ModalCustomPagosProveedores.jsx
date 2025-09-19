import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore';
import { useForm } from '@/hooks/useForm';
import { arrayCargoEmpl, arrayEstadoContrato, arrayEstadoTask } from '@/types/type';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import Select from 'react-select';
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
    id_estado: 505
};
export const ModalCustomPagosProveedores = ({ show, onHide, id_empresa }) => {
    const [file_presupuesto, setfile_presupuesto] = useState(null);
    const [file_contrato, setfile_contrato] = useState(null);
    const [file_compromisoPago, setfile_compromisoPago] = useState(null);
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
        onInputChange,
        onInputChangeReact,
        onResetForm,
    } = useForm(registerTrabajo);
    const { postContratoProv, obtenerProveedores } = useProveedorStore()
  const { dataProveedores } = useSelector((s) => s.prov);
    const onCancelModal = () => {
        onHide();
        onResetForm()
        setfile_presupuesto(null)
        setfile_contrato(null)
    };
    const onSubmitTrabajo = (e) => {
        e.preventDefault();
        postContratoProv({...formState, id_empresa}, id_prov, file_presupuesto, file_contrato, file_compromisoPago)
        console.log({formState, id_prov, file_presupuesto, file_contrato, file_compromisoPago});
        
        onCancelModal();
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
        if(show){
            obtenerProveedores(true, true)
        }
    }, [show])
    const proveedores = dataProveedores.map(prov=>{
        return {
            label: prov.razon_social_prov,
            value: prov.id
        }
    })
    return (
        <Dialog header="Agregar Trabajos" style={{ width: '50vw' }} position='top' onHide={onHide} visible={show}>
            {id_empresa}
            <form onSubmit={onSubmitTrabajo}>
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
                            required
                        />
                </div>
                {/* <div className='mb-3'>
                    <label htmlFor="penalidad_fijo" className="form-label">
                        PRESUPUESTO*
                    </label>
                    <input
                            className="form-control bg-black text-white"
                            placeholder="file_presupuesto"
                            // value={file_presupuesto}
                            name="file_presupuesto"
                            // id="penalidad_fijo"
                            type="file"
                            onChange={(e)=>onFilePresupuestoChange(e)}
                            required
                        />
                </div> */}
                <div className='mb-3'>
                    <label htmlFor="penalidad_fijo" className="form-label">
                        CONTRATO*
                    </label>
                    <input
                            className="form-control bg-black text-white"
                            placeholder="file_contrato"
                            // value={file_presupuesto}
                            name="file_contrato"
                            // id="penalidad_fijo"
                            type="file"
                            onChange={(e)=>onFileContratoChange(e)}
                            required
                        />
                </div>
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
                        options={proveedores}
                        value={proveedores.find(
                            (option) => option.value === id_prov
                        )||0}
                        required
                    />
                </div>
                {/* <div className="mb-3">
                    <label htmlFor="cod_trabajo" className="form-label">
                        Codigo del contrato*
                    </label>
                    <input
                        className="form-control"
                        placeholder="codigo de trabajo"
                        value={cod_trabajo}
                        name="cod_trabajo"
                        id="cod_trabajo"
                        type="text"
                        onChange={onInputChange}
                        required
                    />
                </div> */}
                {/* <div className="mb-3">
                    <label htmlFor="penalidad_fijo" className="form-label">
                        Penalidad por dia*
                    </label>
                    <input
                        className="form-control"
                        placeholder="Penalidad"
                        value={penalidad_fijo}
                        name="penalidad_fijo"
                        id="penalidad_fijo"
                        type="text"
                        onChange={onInputChange}
                        required
                    />
                </div> */}
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
                        Monto*
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
