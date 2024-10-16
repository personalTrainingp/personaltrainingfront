import { arrayEstados, arrayrelacionPariente } from '@/types/type';
import React, { useEffect } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Select from 'react-select'
import DataTable from 'react-data-table-component';
import { useForm } from '@/hooks/useForm';
import { useDispatch } from 'react-redux';
import { onDataErrors_PUSH, onDataErrors_RESET, onOneDelete_CE, onOnePush_CE, onSetUsuario_CE } from '@/store/usuario/usuarioSlice';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const regContactoEmergencia = {
    nombresCompletos_emerg: '',
    tel_emerg: '',
    relacion_emerg: 0
}
export const LayoutInfoContacEmergencia = ({}) => {
	const dispatch = useDispatch()
	const { dataContactsEmerg, dataErrors } = useSelector(e=>e.usuario)
    const { 
        nombresCompletos_emerg,
        tel_emerg,
        relacion_emerg,
        formState: formState_CE,
        onInputChange: onInputChange_CE,
        onInputChangeReact: onInputChangeReact_CE,
		onResetForm
     }  =useForm(regContactoEmergencia)
	 useEffect(() => {
		dispatch(onSetUsuario_CE(formState_CE))
	 }, [formState_CE])

	 const onSubmit_CE = ()=>{
		dispatch(onDataErrors_RESET())
		if(formState_CE.nombresCompletos_emerg.trim().length == 0){
			// errorsData.push({error: 'Los nombres del contacto de emergencia son requeridos'})
			
			dispatch(
				onDataErrors_PUSH({error: 'Los nombres del contacto de emergencia son requeridos'})
			)
			return;
		}
		if(formState_CE.tel_emerg.trim().length==0){
			dispatch(
				onDataErrors_PUSH({error: 'El telefono del contacto de emergencia son requeridos'})
			)
			return;
		}
		if(formState_CE.relacion_emerg==0){
			dispatch(
				onDataErrors_PUSH({error: 'Selecciona la relacion que tiene con el cliente'})
			)
			return;
		}
		dispatch(onOnePush_CE(formState_CE))
		onResetForm()
	 }
	 
/* action column render */
const ActionColumn = (row) => {
	const ClickDeleteRow=(e)=>{
		dispatch(onOneDelete_CE(row.id))
	}
	return (
	  <>
		<a to="" className="" style={{cursor: 'pointer'}} onClick={ClickDeleteRow}>
		  <i className="mdi mdi-delete fs-4 text-black"></i>
		</a>
	  </>
	);
  };
	 const columns = [
		{
			
			name: 'Nombres completos',
			selector: (row) => row.nombresCompletos_emerg,
		},
		{
			name: 'Telefono',
			selector: (row) => row.tel_emerg
		},
		{
			name: 'Relacion',
			selector: (row) => {
				// console.log(DataTrainerPrueba.find(e=>e.value===row.trainer_HorarioPgm));
				const nameTrainer = arrayrelacionPariente.find(e=>e.value===row.relacion_emerg)
				return nameTrainer?.label
			}
		},
		{
			name: 'Acciones',
			cell: ActionColumn
		}
	];
	
	return (
		<>
			<form>
				<Row>
					<Col xl={3}>
						<div className="mb-2">
							<label htmlFor="nombresCompletos_emerg" className="form-label">
								Nombre completo del contacto.*
							</label>
							<input
								className="form-control"
								type="text"
								name="nombresCompletos_emerg"
								id="nombresCompletos_emerg"
								value={nombresCompletos_emerg}
								onChange={onInputChange_CE}
								placeholder="Nombres completo"
								required
							/>
						</div>
					</Col>
					<Col xl={3}>
						<div className="mb-2">
							<label htmlFor="tel_emerg" className="form-label">
								Número de teléfono del contacto.*
							</label>
							<input
								className="form-control"
								type="text"
								name="tel_emerg"
								id="tel_emerg"
								value={tel_emerg}
								onChange={onInputChange_CE}
								placeholder="Numero de telefono"
								required
							/>
						</div>
					</Col>
					<Col xl={3}>
						<div className="mb-2">
							<label htmlFor="relacion_emerg" className="form-label">
								Relacion*
							</label>
							<Select
								onChange={(e) => onInputChangeReact_CE(e, 'relacion_emerg')}
								name="relacion_emerg"
								placeholder={'Seleccione el estado civil'}
								className="react-select"
								classNamePrefix="react-select"
								options={arrayrelacionPariente}
								value={arrayrelacionPariente.find(
									(option) => option.value === relacion_emerg
								)}
								required
							/>
						</div>
					</Col>
					<Col xl={3}>
					<div className="mb-2 mt-2">
							<Button onClick={onSubmit_CE}>Agregar</Button>
						</div>
					</Col>
				</Row>
			</form>
			{
				dataErrors[0]&& (
					<span className='text-danger'>
						<i className='mdi mdi-close'></i>
						{dataErrors[0]?.error}</span>
				)
			}
			<DataTable noDataComponent={'No hay información para mostrar'} data={dataContactsEmerg} columns={columns} />
		</>
	);
};
