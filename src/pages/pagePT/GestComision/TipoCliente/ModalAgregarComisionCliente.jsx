import { useForm } from '@/hooks/useForm';
import { arrayCargoEmpl, arrayTipoMonto } from '@/types/type';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import React from 'react';
import { Col, Row } from 'react-bootstrap';
import Select from 'react-select';
const registerComisionxCli = {
	tipo_monto: 'POR',
	monto_fijo: 0.1,
	monto_porcentaje: 0,
};
export const ModalAgregarComisionCliente = ({ show, onHide, data, isCliente }) => {
	const {
		formState,
		tipo_monto,
		monto_porcentaje,
		monto_fijo,
		onResetForm,
		onInputChangeReact,
		onInputChange,
	} = useForm(data ? data : registerComisionxCli);
	const cancelModal = () => {
		onResetForm();
		onHide();
	};
	const submitForm = (e) => {
		e.preventDefault();
		console.log({ ...formState, tipo_comision: 'CLI', comisionar: isCliente });
	};
    const valorPorcentaje = (e)=>{
        let nuevoValor = e.value;
		if (nuevoValor > 100) {
			nuevoValor = 100;
		} else if (nuevoValor < 1) {
			nuevoValor = 1;
		}
    }

	const deleteProductDialogFooter = (
		<React.Fragment>
			<Button
				label="No"
				icon="pi pi-times"
				severity="danger"
				outlined
				onClick={cancelModal}
			/>
			<Button label="Guardar" icon="pi pi-check" severity="success" onClick={submitForm} />
		</React.Fragment>
	);
	return (
		<Dialog
			visible={show}
			onHide={cancelModal}
			style={{ width: '32rem', height: '30rem' }}
			breakpoints={{ '960px': '75vw', '641px': '90vw' }}
			header={`Agregar comision a ${isCliente}`}
			modal
			footer={deleteProductDialogFooter}
		>
			<form onSubmit={submitForm}>
				<Row>
					<Col lg={12}>
						<div className="mt-2">
							<label htmlFor="tipo_monto">Tipo Monto</label>
							<Select
								id="tipo_monto"
								name="tipo_monto"
								value={arrayTipoMonto.find((option) => option.value === tipo_monto)}
								onChange={(e) => onInputChangeReact(e, 'tipo_monto')}
								options={arrayTipoMonto}
							/>
						</div>
					</Col>
					<Col lg={12}>
						{tipo_monto === 'POR' && (
							<div className="mt-2">
								<div className="p-inputgroup flex-1">
									<span className="p-inputgroup-addon">%</span>
									<InputNumber
                                        keyfilter={/\b([1-9][0-9]?|100)\b/} validateOnly 
										placeholder=""
										min={1}
										max={99}
										value={monto_porcentaje}
										onChange={(e) => onInputChangeReact(valorPorcentaje(e), 'monto_porcentaje')}
									/>
								</div>
							</div>
						)}
						{tipo_monto === 'FIJ' && (
							<div className="mt-2">
								<div className="p-inputgroup flex-1">
									<span className="p-inputgroup-addon">S/</span>
									<InputNumber
										placeholder="0.00"
										min={10.0}
										value={monto_fijo}
										onChange={(e) => onInputChangeReact(e, 'monto_fijo')}
										minFractionDigits={2}
										maxFractionDigits={5}
									/>
								</div>
							</div>
						)}
					</Col>
				</Row>
			</form>
		</Dialog>
	);
};
