import React, { useState } from 'react';
import { Button, Col, Modal, Row } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import SimpleBar from 'simplebar-react';
import { ModalTarifa } from './ModalTarifa';
import { useForm } from '@/hooks/useForm';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { arrayEstados } from '@/types/type';
import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore';
import { useDispatch } from 'react-redux';
import { GETTARIFAxpt } from '@/store/ventaProgramaPT/programaPTSlice';
const registrarTARIFA = {
	// id_st: null,
	id_tt: 0,
	nombreTarifa_tt: '',
	descripcionTarifa_tt: '',
	tarifaCash_tt: '',
	estado_tt: true,
}
export const ModalPriceWeek = ({ show, onHide, onOpenModalPgm, onShow }) => {
	const [modalTarifa, setmodalTarifa] = useState(false);
	const dispatch = useDispatch()
    const { startRegisterSemanaPgm, startUpdateSemanaPgm, startDeleteSemanaPgm }= useProgramaTrainingStore()
	const { select_SEMANA, datapgmPT } = useSelector((e) => e.programaPT);
	const {
		id_pgm,
		id_st,
		semanas_st,
		congelamiento_st,
		nutricion_st,
		tarifaRegular_st,
		estado_st,
		onResetForm,
		onInputChange,
		onInputChangeReact,
		formState,
	} = useForm(select_SEMANA);
	const submitSemanaPt = (e) => {
		e.preventDefault();
        if(id_st==0){
            onHide()
            onOpenModalPgm()
            startRegisterSemanaPgm(formState, id_pgm)
            return;
        }
        onHide()
        onOpenModalPgm()
        startUpdateSemanaPgm(formState, id_pgm)
	};
	const ClickonModalTarifa = (e, id)=>{
		onHide();
		setmodalTarifa(true);
		if(!id){
			return dispatch(GETTARIFAxpt(registrarTARIFA))
		}
		dispatch(GETTARIFAxpt(id))
	}
	const newArray = datapgmPT.map((e) => ({ value: e.id_pgm, label: e.sigla_pgm }));
	return (
		<>
			<Modal show={show} onHide={onHide} size={`${id_st===0?'xxl':'lg'}`}>
				<Modal.Header>
					<Modal.Title>
						{newArray.find((ev) => ev.value === id_pgm)?.label} - {semanas_st} SEMANAS
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col>
							<form onSubmit={submitSemanaPt}>
								<div className="mb-3 row">
									<label className="form-label col-form-label">
										Sigla de programa:
									</label>
									<div>
										<Select
											onChange={(e) => onInputChangeReact(e, 'id_pgm')}
											name={'id_pgm'}
											placeholder={'Seleccione la sigla de programa'}
											className="react-select"
											classNamePrefix="react-select"
											options={newArray}
											value={newArray.find(
												(option) => option.value === id_pgm
											)}
											required
										></Select>
									</div>
								</div>
								<div className="mb-3 row">
									<label className="form-label col-form-label">Semanas:</label>
									<div>
										<input
											type="number"
											className="form-control"
											onChange={onInputChange}
											name="semanas_st"
											id="semanas_st"
											value={semanas_st}
											required
										/>
									</div>
								</div>
								<div className="mb-3 row">
									<label className="form-label col-form-label">
										Congelamientos:
									</label>
									<div>
										<input
											type="number"
											className="form-control"
											onChange={onInputChange}
											name="congelamiento_st"
											id="congelamiento_st"
											value={congelamiento_st}
											required
										/>
									</div>
								</div>
								<div className="mb-3 row">
									<label className="form-label col-form-label">Nutricion:</label>
									<div>
										<input
											type="number"
											className="form-control"
											onChange={onInputChange}
											name="nutricion_st"
											id="nutricion_st"
											value={nutricion_st}
											required
										/>
									</div>
								</div>
								<div className="mb-3 row">
									<label className="form-label col-form-label">
										Tarifa regular:
									</label>
									<div>
										<input
											type="number"
											className="form-control"
											onChange={onInputChange}
											name="tarifaRegular_st"
											id="tarifaRegular_st"
											value={tarifaRegular_st}
											required
										/>
									</div>
								</div>
								<div className="mb-3 row">
									<label className="form-label col-form-label">Estado:</label>
									<div>
										<Select
											onChange={(e) => onInputChangeReact(e, 'estado_st')}
											name="estado_st"
											placeholder={'Seleccione el estado'}
											className="react-select"
											classNamePrefix="react-select"
											options={arrayEstados}
											value={arrayEstados.find(
												(option) => option.value === estado_st
											)}
											required
										/>
									</div>
								</div>
								<div>
									<Button type="submit">
										{id_st === 0 ? 'Registrar' : 'Actualizar'}
									</Button>
								</div>
							</form>
						</Col>
						{id_st===0?(
							<>
							</>
						):(
							<Col>
							<div>
								<label className="form-label col-form-label">
									Tarifas Habilitadas
								</label>
								<span className='float-end'>
												Registro total: {
													select_SEMANA.tb_tarifa_trainings.length
												}
								</span>
								<Button onClick={ClickonModalTarifa} className='mb-2'>Agregar nueva tarifa</Button>
								<div className="box-tarifa">
									<SimpleBar
										className="card-body py-0"
										style={{ maxHeight: '430px', overflowX: 'hidden' }}
									>
									{
										select_SEMANA.tb_tarifa_trainings?.map(e=>{
											return(
													<div
														key={e.id_tt}
														className="border border-2 rounded-3 p-2 hover-card mb-2 text-black"
														onClick={taf=>ClickonModalTarifa(taf, e)}
													>
														<div className="text-black d-flex align-items-start justify-content-between">
															<div className="flex-row">
																<div className="fs-3">
																	<b>S/ {e.tarifaCash_tt.toFixed(2)}</b>
																</div>
																<div className="fs-4">{e.nombreTarifa_tt}</div>
															</div>
															<span className="bg-success p-1 text-white rounded-3 fs-6">
																{e.estado_tt?'Activo': 'Inactivo'}
															</span>
														</div>
														<p className="text-muted mb-0">
															{e.descripcionTarifa_tt}
														</p>
														{/* <span className="text-muted mb-0 mt-2 d-flex flex-row align-items-center justify-content-around">
															<div className="text-center">
																<b>FECHA INICIO</b>
																<p className="mb-0">
																	{new Date().toLocaleDateString()}
																</p>
															</div>
															<div className="text-center">
																<b>FECHA FIN</b>
																<p className="mb-0">SIN LIMITE</p>
															</div>
														</span> */}
													</div>
											)
										})
									}
									</SimpleBar>
								</div>
								<div></div>
							</div>
							</Col>
						)
						}
					</Row>
				</Modal.Body>
			</Modal>
			<ModalTarifa show={modalTarifa} select_SEMANA={select_SEMANA} showSemana={onShow} onHide={() => setmodalTarifa(false)} />
		</>
	);
};
