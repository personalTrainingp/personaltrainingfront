import { Modal, Row, Col } from 'react-bootstrap';
import { Form, SelectInput, TextInput } from '@/components';
import { useAddEditEvent } from './hooks';
import { useForm } from '@/hooks/useForm';
import Select from 'react-select'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCitaStore } from '@/hooks/hookApi/useCitaStore';
import { arrayCitasTest, arrayEstados } from '@/types/type';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const registerCita = {
	id_cli: 0,
	id_detallecita: 0,
}
const AddEditEvent = ({show, onHide, selectDATE, tipo_serv, dataCita}) => {
	const { obtenerCitasxCliente, DataCitaxCLIENTE, onPutCita } =  useCitaStore()
	const { formState, id_cli, id_detallecita, onInputChange, onInputChangeReact, onResetForm } = useForm(dataCita?dataCita:registerCita)
	const { obtenerParametrosClientes, DataClientes } = useTerminoStore()
	
	const { onPostCita } = useCitaStore()
	
	useEffect(() => {
		obtenerParametrosClientes()
	}, [])
	useEffect(() => {
		if(id_cli==0) return;
	//   obtenerCitasxCliente(id_cli)
	}, [id_cli])
	
	const onSubmitEv = ()=>{
		onPostCita(formState, selectDATE);
		cancelModal()
	}
	const cancelModal = ()=>{
        onResetForm()
        onHide()
    }
	const editarEvento = ()=>{
		onPutCita(formState);
        cancelModal()
	}
	const eliminarEvento = ()=>{
		onPutCita({status_cita: 501});
        cancelModal()
	}
	const productDialogFooter = (
		<React.Fragment>
			<Button label="Cancelar" icon="pi pi-times" outlined onClick={cancelModal} />
			{
				dataCita==null?
                <Button label="Guardar" icon="pi pi-check" className='bg-success' onClick={onSubmitEv} />
                :
				<>
					<Button label="Editar" icon="pi pi-check" onClick={editarEvento} />
					<Button label="Eliminar" icon="pi pi-check" className='bg-danger' onClick={eliminarEvento} />
				</>
			}
		</React.Fragment>
	);
	return (
		<>
			<Dialog
				visible={show}
				style={{ width: '50rem' }}
				breakpoints={{ '960px': '75vw', '641px': '90vw' }}
				header={dataCita==null?
					<> Crear cita: {new Date(selectDATE.start).toLocaleDateString()} {new Date(selectDATE.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
					hasta {new Date(selectDATE.end).toLocaleDateString()} {new Date(selectDATE.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
					</>
					:
					<> Editar cita: 
						{new Date(selectDATE.start).toLocaleDateString()} {new Date(selectDATE.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
					hasta {new Date(selectDATE.end).toLocaleDateString()} {new Date(selectDATE.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
					</>}
				modal
				className="p-fluid"
				footer={productDialogFooter}
				onHide={cancelModal}
			>
				<Form onSubmit={onSubmitEv}>
						<Row>
							<Col sm={12}>
								<div className='m-2'>
									<label>Cliente:</label>
									<Select
										onChange={(e) => onInputChangeReact(e, 'id_cli')}
										name="id_cli"
										placeholder={'Selecciona el cliente'}
										className="react-select"
										classNamePrefix="react-select"
										options={DataClientes}
										value={DataClientes.find(
											(option) => option.value === id_cli
										)}
										required
									/>
								</div>
							</Col>
							<Col sm={12}>
								<div className='m-2'>
									<label>Citas que compro el cliente:</label>
									<Select
										onChange={(e) => onInputChangeReact(e, 'id_detallecita')}
										name="id_detallecita"
										placeholder={'Selecciona el cliente'}
										className="react-select"
										classNamePrefix="react-select"
										options={arrayCitasTest}
										value={arrayCitasTest.find(
											(option) => option.value === id_detallecita
										)}
										required
									/>
								</div>
							</Col>
						</Row>
					</Form>

			</Dialog>
			{/* <Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
				<Modal.Header className="pb-2 px-4 border-bottom-0" closeButton>
					<Modal.Title>
						{
							dataCita==null?
							<h5> Crear cita: {new Date(selectDATE.start).toLocaleDateString()} {new Date(selectDATE.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
							hasta {new Date(selectDATE.end).toLocaleDateString()} {new Date(selectDATE.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
							</h5>
							:
							<h5> Editar cita: 
								{new Date(selectDATE.start).toLocaleDateString()} {new Date(selectDATE.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
							hasta {new Date(selectDATE.end).toLocaleDateString()} {new Date(selectDATE.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
							</h5>
						}
						
					</Modal.Title>
				</Modal.Header>
				<Modal.Body className="px-4 pb-4 pt-0">
					<Form onSubmit={onSubmitEv}>
						<Row>
							<Col sm={12}>
								<div className='m-2'>
									<label>Cliente:</label>
									<Select
										onChange={(e) => onInputChangeReact(e, 'id_cli')}
										name="id_cli"
										placeholder={'Selecciona el cliente'}
										className="react-select"
										classNamePrefix="react-select"
										options={DataClientes}
										value={DataClientes.find(
											(option) => option.value === id_cli
										)}
										required
									/>
								</div>
							</Col>
							<Col sm={12}>
								<div className='m-2'>
									<label>Citas que compro el cliente:</label>
									<Select
										onChange={(e) => onInputChangeReact(e, 'id_detallecita')}
										name="id_detallecita"
										placeholder={'Selecciona el cliente'}
										className="react-select"
										classNamePrefix="react-select"
										options={arrayCitasTest}
										value={arrayCitasTest.find(
											(option) => option.value === id_detallecita
										)}
										required
									/>
								</div>
							</Col>

						</Row>

						<Row>
							<Col xs={8} className="text-end">
								<Button className="btn btn-light me-1" onClick={onHide}>
									Cerrar
								</Button>
								{dataCita==null && (
									<Button variant="success" type="submit" className="btn btn-success">
										Guardar cita
									</Button>
								)
								}
								{
									dataCita!=null && (
										<>
											<Button variant="success" type="submit" className="btn btn-success">
												Editar cita
											</Button>
											<Button variant="danger" type="submit" className="btn btn-success">
												Eliminar cita
											</Button>
										</>
									)
								}
							</Col>
						</Row>
					</Form>
				</Modal.Body>
			</Modal> */}
		</>
	);
};

export default AddEditEvent;
