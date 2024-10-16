import { Modal, Row, Col, Button } from 'react-bootstrap';
import { Form, SelectInput, TextInput } from '@/components';
import { useAddEditEvent } from './hooks';
import { useForm } from '@/hooks/useForm';
import Select from 'react-select'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCitaStore } from '@/hooks/hookApi/useCitaStore';
import { arrayCitasTest, arrayEstados } from '@/types/type';

const registerCita = {
	id_cli: 0,
	id_detallecita: 0,
}
const AddEditEvent = ({show, onHide, selectDATE}) => {
	const { formState, id_cli, id_detallecita, onInputChange, onInputChangeReact, onResetForm } = useForm(registerCita)
	const { obtenerParametrosClientes, DataClientes } = useTerminoStore()
	const { obtenerCitasxCliente, DataCitaxCLIENTE } =  useCitaStore()
	
	const { onPostCita } = useCitaStore()
	useEffect(() => {
		obtenerParametrosClientes()
	}, [])
	useEffect(() => {
		console.log("aquii");
		if(id_cli==0) return;
	  obtenerCitasxCliente(id_cli)
	}, [id_cli])
	
	const onSubmitEv = ()=>{
		onPostCita(formState, selectDATE);
		cancelModal()
	}
	const cancelModal = ()=>{
        onResetForm()
        onHide()
    }
	return (
		<Modal show={show} onHide={onHide} backdrop="static" keyboard={false}>
			<Modal.Header className="pb-2 px-4 border-bottom-0" closeButton>
				<Modal.Title>
					<h5> Agendar cita: {new Date(selectDATE.start).toLocaleDateString()} {new Date(selectDATE.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
						hasta {new Date(selectDATE.end).toLocaleDateString()} {new Date(selectDATE.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
					</h5>
				</Modal.Title>
			</Modal.Header>
			<Modal.Body className="px-4 pb-4 pt-0">
				<Form onSubmit={onSubmitEv}>
					<Row>
						<Col sm={12}>
							<div className='m-2'>
								<label>SOCIO:</label>
								<Select
									onChange={(e) => onInputChangeReact(e, 'id_cli')}
									name="id_cli"
									placeholder={'Selecciona el socio'}
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
								<label>SESIONES PENDIENTES:</label>
								<Select
									onChange={(e) => onInputChangeReact(e, 'id_detallecita')}
									name="id_detallecita"
									placeholder={'SELECCIONAR LAS SESIONES'}
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
							<Button variant="success" type="submit" className="btn btn-success">
								Guardar
							</Button>
						</Col>
					</Row>
				</Form>
			</Modal.Body>
		</Modal>
	);
};

export default AddEditEvent;
