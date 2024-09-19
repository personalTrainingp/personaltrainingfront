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
import dayjs, { utc } from 'dayjs';
import { Link } from 'react-router-dom';
import { Loading } from '@/components/Loading';

dayjs.extend(utc);
const registerCita = {
	id_cli: 0,
	id_cita_adquirida: 0,
	id_empl: 0
}
const AddEditEvent = ({show, onHide, selectDATE, tipo_serv, dataCita}) => {
	const { obtenerCitasxClientexServicio, DataCitaxCLIENTE, onPutCita, onPostCita, obtenerCitasNutricionalesxCliente, dataCitaxCliente, loading } =  useCitaStore()
	const { onDeleteCitaxId, loadingAction } = useCitaStore()
	const { formState, id_cli, id_cita_adquirida, id_empl, onInputChange, onInputChangeReact, onResetForm } = useForm(dataCita?dataCita:registerCita)
	const { obtenerParametrosClientes, DataClientes, obtenerEmpleadosPorDepartamentoNutricion, DataEmpleadosDepNutricion } = useTerminoStore()
	const [clienteSel, setclienteSel] = useState({})
	
	useEffect(() => {
		obtenerParametrosClientes()
		obtenerEmpleadosPorDepartamentoNutricion()
	}, [])
	useEffect(() => {
		if(id_cli==0) return;
		obtenerCitasNutricionalesxCliente(id_cli, new Date(selectDATE.start))
	}, [id_cli])
	
	

	// useEffect(() => {
	// 	if(id_cli==0) return;
	// 	obtenerCitasxClientexServicio(id_cli, tipo_serv)
	// }, [id_cli, tipo_serv])
	const onSubmitEv = ()=>{
		const clienteSELECT= DataClientes.find(
			(option) => option.value === id_cli
		)
		onPostCita(selectDATE, id_cli, id_cita_adquirida, tipo_serv, id_empl);
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
		if(dataCita){
			onDeleteCitaxId(dataCita.id)
		}
		// onPutCita({id: formState.id, status_cita: 501}, tipo_serv, tipo_serv);
        cancelModal()
	}
	const productDialogFooter = (
		<React.Fragment>
			<div className='d-flex justify-content-between align-items-center'>
				{id_cli!==0 && (
					<Link to={`/historial-cliente/${DataClientes.find(
						(option) => option.value === id_cli
					)?.uid}`} className='text-primary font-bold' style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer'}}>Perfil del socio</Link>
				)
				}
				<span>
					<Button label="Salir" severity="info" outlined className='border border-2 border-success m-1 text-success' icon="pi pi-times" onClick={cancelModal} />
					{
						dataCita==null?
						<Button label="Guardar"  icon="pi pi-check" className='bg-success border border-2 m-1' onClick={onSubmitEv} />
						:
						<>
							<Button label="Eliminar" icon="pi pi-check" className='bg-primary border border-2 m-1' onClick={eliminarEvento} />
							<Button label="Editar" icon="pi pi-check" className='bg-secondary border border-2 m-1' onClick={editarEvento} />
						</>
					}
				</span>
			</div>
		</React.Fragment>
	);
	console.log(loadingAction);
	
	return (
		<>
			{
				loadingAction?
				(
					<Loading show={loadingAction}/>
				)
				: 
				(
					<Dialog
					visible={show}
					style={{ width: '50rem', height: '35rem' }}
					breakpoints={{ '960px': '75vw', '641px': '90vw' }}
					header={dataCita==null?
						<> 
						<span className='shadow shadow-3 border border-3 rounded rounded-4 p-2'>
								CREAR CITA
							</span>
							<br/>
							<br/>
							<span className='font-17'>
								De: {FormatoDateMask(new Date(selectDATE.start), 'dddd D [de] MMMM [del] YYYY [a las] h:mm A')}
							</span>
							<br/>
							<span className='font-17'>
								Hasta: {FormatoDateMask(new Date(selectDATE.end), 'dddd D [de] MMMM [del] YYYY [a las] h:mm A')}
							</span>
						</>
						:
						<>
							<span className='shadow shadow-3 border border-3 rounded rounded-4 p-2'>
								Editar cita
							</span>
							<br/>
							<br/>
							<span className='font-17'>
								De: {FormatoDateMask(new Date(selectDATE.start), 'dddd D [de] MMMM [del] YYYY [a las] h:mm A')}
							</span>
							<br/>
							<span className='font-17'>
								Hasta: {FormatoDateMask(new Date(selectDATE.end), 'dddd D [de] MMMM [del] YYYY [a las] h:mm A')}
							</span>
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
											onChange={(e) => onInputChangeReact(e, 'id_cita_adquirida')}
											name="id_cita_adquirida"
											placeholder={'Selecciona la sesion'}
											className="react-select"
											classNamePrefix="react-select"
											isLoading={loading}
											options={dataCitaxCliente}
											value={dataCitaxCliente.find(
												(option) => option.value === id_cita_adquirida
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
											options={DataEmpleadosDepNutricion}
											value={DataEmpleadosDepNutricion.find((op)=>op.value===id_empl)}
											required
										/>
									</div>
								</Col>
	
							</Row>
					</Form>
				</Dialog>
				)
			}
		</>
	);
};

export default AddEditEvent;
