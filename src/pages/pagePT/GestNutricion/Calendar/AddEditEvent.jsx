import { Modal, Row, Col } from 'react-bootstrap';
import { Form, SelectInput, TextInput } from '@/components';
import { useAddEditEvent } from './hooks';
import { useForm } from '@/hooks/useForm';
import Select from 'react-select'
import { useTerminoStore } from '@/hooks/hookApi/useTerminoStore';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCitaStore } from '@/hooks/hookApi/useCitaStore';
import { arrayCitasTest, arrayEstados, arrayPersonalTest } from '@/types/type';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { DateMask, FormatoDateMask } from '@/components/CurrencyMask';
import dayjs from 'dayjs';

const registerCita = {
	id_cli: 0,
	id_detallecita: 0,
	id_empl: 0
}
const AddEditEvent = ({show, onHide, selectDATE, tipo_serv, dataCita}) => {
	const {  daysUTC } = helperFunctions()
	const { obtenerCitasxClientexServicio, DataCitaxCLIENTE, onPutCita, onPostCita } =  useCitaStore()
	const { formState, id_cli, id_detallecita, id_empl, onInputChange, onInputChangeReact, onResetForm } = useForm(dataCita?dataCita:registerCita)
	const { obtenerParametrosClientes, DataClientes } = useTerminoStore()
	
	
	useEffect(() => {
		obtenerParametrosClientes()
	}, [])

	useEffect(() => {
		if(id_cli==0) return;
		obtenerCitasxClientexServicio(id_cli, tipo_serv)
	}, [id_cli, tipo_serv])
	const onSubmitEv = ()=>{
		const clienteSELECT= DataClientes.find(
			(option) => option.value === id_cli
		)
		onPostCita(selectDATE, id_cli, id_detallecita, tipo_serv);
		cancelModal()
	}
	const cancelModal = ()=>{
        onResetForm()
        onHide()
    }
	const editarEvento = ()=>{
		onPutCita(formState, tipo_serv);
        cancelModal()
	}
	const eliminarEvento = ()=>{
		onPutCita({id: formState.id, status_cita: 501}, tipo_serv, tipo_serv);
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
				style={{ width: '50rem', height: '35rem' }}
				breakpoints={{ '960px': '75vw', '641px': '90vw' }}
				header={dataCita==null?
					<> Crear cita: {new Date(selectDATE.start).toLocaleDateString()} {new Date(selectDATE.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
					hasta {new Date(selectDATE.end).toLocaleDateString()} {new Date(selectDATE.end).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: true})}
					{/* {FormatoDateMask(new Date(selectDATE.start), "D [de] MMMM [de] YYYY [a las] h:mm A")} */}
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
									<label>Socio:</label>
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
									<label>Sesiones disponible:</label>
									<Select
										onChange={(e) => onInputChangeReact(e, 'id_detallecita')}
										name="id_detallecita"
										placeholder={'Selecciona la sesion'}
										className="react-select"
										classNamePrefix="react-select"
										options={DataCitaxCLIENTE}
										value={DataCitaxCLIENTE.find(
											(option) => option.value === id_detallecita
										)}
										required
									/>
								</div>
							</Col>
							<Col sm={12}>
								<div className='m-2'>
									<label>{tipo_serv=='FITOL'?'Personal para el tratamiento estetico':'Nutricionista'}:</label>
									<Select
										onChange={(e) => onInputChangeReact(e, 'id_empl')}
										name="id_empl"
										placeholder={'Seleccionar...'}
										className="react-select"
										classNamePrefix="react-select"
										options={arrayPersonalTest}
										value={arrayPersonalTest.find((op)=>op.value===id_empl)}
										required
									/>
								</div>
							</Col>

						</Row>
					</Form>
			</Dialog>
		</>
	);
};

export default AddEditEvent;
