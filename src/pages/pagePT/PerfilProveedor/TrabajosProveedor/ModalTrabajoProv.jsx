import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore';
import { useForm } from '@/hooks/useForm';
import { arrayCargoEmpl } from '@/types/type';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
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
};
export const ModalTrabajoProv = ({ show, onHide, id_prov }) => {
	const {
		formState,
		cod_trabajo,
		penalidad_fijo,
		fecha_inicio,
		fecha_fin,
		hora_fin,
		monto,
		observacion,
		onInputChange,
		onResetForm,
	} = useForm(registerTrabajo);
	const { postContratoProv } = useProveedorStore()
	const onCancelModal = () => {
		onHide();
		onResetForm()
	};
	const onSubmitTrabajo = (e) => {
		e.preventDefault();
		postContratoProv(formState, id_prov)
		onCancelModal();
	};
	return (
		<Dialog header="Agregar Trabajos" style={{ width: '50vw' }} position='top' onHide={onHide} visible={show}>
			<form onSubmit={onSubmitTrabajo}>
				<div className="mb-3">
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
				</div>
        		<div className="mb-3">
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
				</div>
				{/* <div className="field">
                            <label htmlFor="id_forma_pago" className="font-bold">
                                Estado*
                            </label>
                            <Select
                                onChange={(e) => onInputChangeReact(e, 'id_forma_pago')}
                                name="id_forma_pago"
                                placeholder={'Seleccionar la forma de aporte'}
                                className="react-select"
                                classNamePrefix="react-select"
                                options={DataFormaPago}
                                value={DataFormaPago.find(
                                    (option) => option.value === id_forma_pago
                                )||0}
                                
                                required
							/>
                        </div> */}
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
						placeholder="Fecha de inicio"
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
					<label htmlFor="monto" className="form-label">
						Monto*
					</label>
					<input
						className="form-control"
						placeholder="Presupuesto"
						value={monto}
						name="monto"
						id="monto"
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
