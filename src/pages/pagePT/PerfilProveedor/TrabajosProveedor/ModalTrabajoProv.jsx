import { useForm } from '@/hooks/useForm';
import { arrayCargoEmpl } from '@/types/type';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Select from 'react-select';
const registerTrabajo = {
	id_prov: 0,
	codigo_trabajo: '',
	penalidad_fijo: '',
	fecha_inicio: new Date(),
	fecha_fin: new Date(),
	monto: 0,
	observaciones: '',
};
export const ModalTrabajoProv = ({ show, onHide }) => {
	const {
		id_prov,
		codigo_trabajo,
		penalidad_fijo,
		fecha_inicio,
		fecha_fin,
		monto,
		observaciones,
		onInputChange,
	} = useForm(registerTrabajo);
	const onCancelModal = () => {
		onHide();
	};
	const onSubmitTrabajo = () => {};
	return (
		<Dialog header="Agregar Trabajos" style={{ width: '50vw' }} position='top' onHide={onHide} visible={show}>
			<form onSubmit={onSubmitTrabajo}>
				<div className="mb-3">
					<label htmlFor="codigo_trabajo" className="form-label">
						Codigo del contrato*
					</label>
					<input
						className="form-control"
						placeholder="codigo de trabajo"
						value={codigo_trabajo}
						name="codigo_trabajo"
						id="codigo_trabajo"
						type="text"
						onChange={onInputChange}
						required
					/>
				</div>
        <div className="mb-3">
					<label htmlFor="penalidad_fijo" className="form-label">
						Penalidad*
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
					<label htmlFor="fecha_inicio" className="form-label">
						Fecha termino*
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
					<label htmlFor="fecha_inicio" className="form-label">
						Hora termino*
					</label>
					<input
						className="form-control"
						placeholder="Fecha de inicio"
						value={fecha_inicio}
						name="fecha_inicio"
						id="fecha_inicio"
						type="time"
						onChange={onInputChange}
						required
					/>
				</div>
        <div className="mb-3">
					<label htmlFor="monto" className="form-label">
						Presupuesto*
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
					<label htmlFor="observaciones" className="form-label">
						Observacion*
					</label>
					<textarea
						className="form-control"
						placeholder="..."
						value={observaciones}
						name="observaciones"
						id="observaciones"
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
