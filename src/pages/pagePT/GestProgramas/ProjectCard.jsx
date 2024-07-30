import {
	Button,
	Card,
	Col,
	Collapse,
	Dropdown,
	Modal,
	ProgressBar,
	Row,
	Tab,
	Tabs,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Flatpickr from 'react-flatpickr';
// images
import sinImage from '@/assets/images/imageBlanck.jpg';
import { useEffect, useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useForm } from '@/hooks/useForm';
import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getHorarioPgm } from '@/store/tableHorario/tablehorarioSlice';
import logoNutricion from '@/assets/images/manzana.png';
import SimpleBar from 'simplebar-react';
import { ModalPriceWeek } from './ModalPriceWeek';
import { GETSEMANASxpt } from '@/store/ventaProgramaPT/programaPTSlice';
import { TabSectionHorario } from './TabSectionHorario';
import config from '@/config';
import { useImageStore } from '@/hooks/hookApi/useImageStore';
const updateInputFile = {
	name_image: '',
};
const registerHorarioPgm = {
	id_horarioPgm: 0,
	aforo_HorarioPgm: 0,
	time_HorarioPgm: '00:00:00',
	trainer_HorarioPgm: '',
	estado_HorarioPgm: false,
};
const registerSemanasPgm = {
    id_pgm: null,
    id_st: 0,
    semanas_st: 0,
    congelamiento_st: 0,
    nutricion_st: 0,
    tarifaRegular_st: 0,
    estado_st: false,
	tb_tarifa_trainings: []
}
const ProjectCard = ({ project, DataTrainerPrueba, columns, data, API_URL }) => {
	// console.log(project.uid_avatar);
	const dispatch = useDispatch();
	//https://archivosluroga.blob.core.windows.net/membresiaavatar/WhatsApp Image 2024-07-15 at 8.23.44 AM (1)-1722297219271.jpeg
	//https://archivosluroga.blob.core.windows.net/membresiaavatar/WhatsApp%20Image%202024-07-15%20at%208.23.44%20AM%20(1)
	//todo
	//https://archivosluroga.blob.core.windows.net/membresiaavatar/WhatsApp Image 2024-07-15 at 8.23.44 AM (2)-1722304321063.jpeg
	//https://archivosluroga.blob.core.windows.net/membresiaavatar/WhatsApp%20Image%202024-07-15%20at%208.23.44%20AM%20(2)-1722304322443.jpeg 

	//https://archivosluroga.blob.core.windows.net/membresiaavatar/diagrama_arquitectura_capas-1722304544298.png 
	//https://archivosluroga.blob.core.windows.net/membresiaavatar/diagrama_arquitectura_capas-1722304542944.png
	const [viewImage, setviewImage] = useState(
		`${config.API_IMG.LOGO}/${project.tb_image?.name_image}`
	);
	// console.log(project);
	return (
		<>
			{/* 
			<Modal show={onModal} onHide={ClickOnCloseModal} size="xl">
				<Modal.Header>
					<Modal.Title>Editar programa {project.name_pgm}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row>
						<Col lg={4}>
							<form onSubmit={onStartSubmitUpdate}>
								<img src={viewImage} style={{ width: '100%', height: '25vh' }} />
								<input
									type="file"
									className="form-control mt-2 mb-2"
									accept="image/png, image/jpeg, image/jpg"
									onChange={(e) => {
										onUpdateInputFileChange(e);
										ViewDataImg(e);
									}}
									name="name_image"
								/>
								<div className="mb-2">
									<label htmlFor="nombre_pgm" className="form-label">
										Nombre del programa*
									</label>
									<input
										className="form-control"
										name="name_pgm"
										value={name_pgm}
										onChange={onUpdateInputChange}
										id="name_pgm"
										placeholder="Nombre del programa"
										required
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="sigla_pgm" className="form-label">
										Sigla del programa*
									</label>
									<input
										className="form-control"
										name="sigla_pgm"
										value={sigla_pgm}
										onChange={onUpdateInputChange}
										id="sigla_pgm"
										placeholder="Nombre del programa"
										required
									/>
								</div>
								<div className="mb-2">
									<label htmlFor="desc_pgm" className="form-label">
										Descripcion del programa*
									</label>
									<textarea
										className="form-control"
										name="desc_pgm"
										value={desc_pgm}
										onChange={onUpdateInputChange}
										id="desc_pgm"
										placeholder="Descripcion del programa"
										style={{ maxHeight: '100px' }}
										required
									/>
								</div>
								<div className="mb-2">
									<input
										type="button"
										className={`form-control text-white p-1
											${isActivepgm ? 'bg-success' : 'bg-danger'}
											`}
										value={isActivepgm ? 'Activo' : 'Inactivo'}
										name="estado_pgm"
										onClick={onClickChangeisActive_PGM}
										id="estado_pgm"
									/>
								</div>
								<Button type="submit" className="form-control mb-3">
									Actualizar informacion
								</Button>
							</form>
						</Col>
						<Col lg={8}>
							<Tabs>
								<Tab eventKey={'horario'} title={'Horario'}>
									<Row className="mt-4">
										<form onSubmit={onStartSubmitPost}>
											<Row>
												<input
													className="form-control"
													value={id_horarioPgm}
													onChange={onPostInputHorarioChange}
													type="hidden"
													required
												/>
												<Col xl={2} className="p-1">
													<div className="mb-2">
														<Flatpickr
															options={{
																enableTime: true,
																noCalendar: true,
																dateFormat: 'H:i',
																time_24hr: true,
															}}
															placeholder="Horario"
															className="form-control"
															value={time_HorarioPgm}
															name="time_HorarioPgm"
															id="time_HorarioPgm"
															onChange={(e) =>
																onInputChangeFlaticon(
																	e,
																	'time_HorarioPgm'
																)
															}
															required
														/>
													</div>
												</Col>
												<Col xl={2} className="p-1">
													<div className="mb-2">
														<input
															className="form-control"
															placeholder="Aforo"
															type="number"
															value={aforo_HorarioPgm}
															name="aforo_HorarioPgm"
															id="aforo_HorarioPgm"
															onChange={onPostInputHorarioChange}
															required
														/>
													</div>
												</Col>
												<Col xl={4} className="p-1">
													<div className="mb-2">
														<Select
															onChange={(e) =>
																onInputChangeReact(
																	e,
																	'trainer_HorarioPgm'
																)
															}
															name={'trainer_HorarioPgm'}
															placeholder={
																'Seleccione el entrenador(a)'
															}
															className="react-select"
															classNamePrefix="react-select"
															options={DataTrainerPrueba}
															value={DataTrainerPrueba.find(
																(option) =>
																	option.value ===
																	trainer_HorarioPgm
															)}
															required
														></Select>
													</div>
												</Col>
												<Col xl={2} className="p-1">
													<div className="mb-2">
														<input
															type="button"
															className={`form-control text-white p-1
																${isActive ? 'bg-success' : 'bg-danger'}
																`}
															value={isActive ? 'Activo' : 'Inactivo'}
															name="estado_HorarioPgm"
															onClick={onClickChangeisActive}
															id="estado_HorarioPgm"
														/>
													</div>
												</Col>
												<Col xl={2} className="p-1">
													<Button type="submit" className="form-control">
														{formStateHr.id_horarioPgm == 0
															? 'Agregar'
															: 'Actualizar'}
													</Button>
												</Col>
												{!(formStateHr.id_horarioPgm == 0) && (
													<Col xl={1}>
														<Button
															className="btn-danger"
															onClick={onClickDelete}
														>
															<i className="mdi mdi-delete"></i>
														</Button>
													</Col>
												)}
											</Row>
										</form>
										<DataTable
											columns={columns}
											data={data}
											dense={true}
											onRowClicked={handleRowClick}
											noDataComponent={<p>No hay horarios disponibles</p>}
										/>
									</Row>
								</Tab>
								<Tab eventKey={'semanas'} title={'Semanas'}>
									<Row className="mt-2 mb-2 align-items-center">
										<Col xl={9}>
											<Button onClick={ClickonModalSemana}>Agregar semana</Button>
										</Col>
										<Col xl={3}>
											<span>Registro total: {project.tb_semana_trainings.length}</span>
										</Col>
									</Row>
									<SimpleBar
										className="card-body py-0"
										style={{ maxHeight: '450px', overflowX: 'hidden' }}
									>
										<Row>
												{
													project.tb_semana_trainings.map(e=>{
														return(
															<Col xl={6}
																key={e.id_st}
															>
																<div
																onClick={sem=>ClickonModalSemana(sem, e)}
																className="border border-2 hover-card rounded rounded-4 p-2 mb-2"
															>
																<ul className="list-inline mb-2">
																	<li className="font-16 fw-semibold">
																		<Link to="" className="text-secondary">
																			{
																				e && (
																					<>
																						{project.sigla_pgm} - {e.semanas_st} SEMANAS
																					</>
																				)
																			}
																		</Link>
																		<span className={`float-end  p-1 text-white rounded-1 fw-bold ${e.estado_st===true?'bg-success':'bg-danger'}`}>
																			{
																				e.estado_st===true?'Activo':'Inactivo'
																			}
																		</span>
																	</li>
																</ul>
																<p className="text-muted mb-1">
																	<i className="mdi mdi-calendar-week me-1"></i>
																	<b>Tarifa regular:</b> S/ {e.tarifaRegular_st}
																</p>
																<p className="text-muted mb-1">
																	<i className="mdi mdi-calendar-week me-1"></i>
																	<b>Semanas:</b> {e.semanas_st}
																</p>
																<p className="text-muted mb-1">
																	<i className="mdi mdi-apple me-1"></i>
																	<b>Nutricion:</b> {e.nutricion_st}
																</p>
																<p className="text-muted mb-1">
																	<i className="mdi mdi-snowflake me-1"></i>
																	<b>Congelamiento:</b> {e.congelamiento_st}
																</p>
																<p className="text-muted mb-1">
																	<i className="mdi mdi-tag-multiple me-1"></i>
																	<b>Tarifas Habilitadas:</b> 10
																</p>
																</div>
															</Col>
														)
													})
												}
										</Row>
									</SimpleBar>
								</Tab>
							</Tabs>
						</Col>
					</Row>
				</Modal.Body>
			</Modal> */}
			{/* <ModalPriceWeek show={modalWeek} onHide={() => setmodalWeek(false)} onShow={()=>setmodalWeek(true)} onOpenModalPgm={()=>setOnModal(true)} project={project} /> */}
			<Card className="d-block">
				{project.tb_image?.name_image && (
					<>
						<img
							className="card-img-top p-4"
							height={'200vh'}
							src={`${config.API_IMG.LOGO}${project.tb_image?.name_image}`}
							alt=""
						/>
						<div className="card-img-overlay"></div>
					</>
				)}
				<Card.Body className={project.tb_image?.name_image ? 'position-relative p-3' : ''}>
					<Dropdown className="card-widgets" align="end">
						<Dropdown.Toggle
							variant="link"
							as="a"
							className="card-drop arrow-none cursor-pointer p-0 shadow-none"
						>
							<i className="ri-more-fill"></i>
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item>
								<i className="mdi mdi-delete me-1"></i>Delete
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					{/* <Modal show={onModalDelete} onHide={() => setonModalDelete(false)}>
						<Modal.Body>
							<p className="fs-4">
								Seguro que quiere eliminar <b>{project.name_pgm}</b>
							</p>
							<Button onClick={onClickDeletePgm}>Eliminar programa</Button>
							<Button
								onClick={() => {
									setonModalDelete(false);
								}}
							>
								Cancelar
							</Button>
						</Modal.Body>
					</Modal> */}

					<h4 className="mt-0" style={{ cursor: 'pointer' }}>
						<Link style={{color: 'black'}} to={`/programa/${project.uid}`}>
							{project.name_pgm} - {project.sigla_pgm}
						</Link>
					</h4>
					{project.desc_pgm && (
						<p className="text-muted font-13 my-1">
							{project.desc_pgm.substring(0, 30)}
							{project.desc_pgm.length > 30 && (
								<>
									...
									<Link
										style={{ cursor: 'pointer' }}
										className="fw-bold text-muted"
									>
										view more
									</Link>
								</>
							)}
						</p>
					)}
					<p className="mb-1">
						<span className="pe-2 text-nowrap mb-2 d-inline-block">
							<i className="mdi mdi-human-queue text-muted me-1"></i>
							<b>{project.totalTasks}</b> Personas
						</span>
						<span className="text-nowrap mb-2 d-inline-block">
							<i className="mdi mdi-clock-time-four-outline text-muted me-1"></i>
							{/* <b>{project.tb_HorarioProgramaPTs.length}</b> Horarios */}
						</span>
					</p>

					<div className="mb-2">
						<input
							type="button"
							className={`form-control text-white p-1
								${project.estado_pgm ? 'bg-success' : 'bg-danger'}
								`}
							value={project.estado_pgm ? 'Activo' : 'Inactivo'}
							style={{ cursor: 'default' }}
						/>
					</div>
					<>
						{/* <p className="mt-3 mb-2 fw-bold">
							Progress <span className="float-end">{project.progress}%</span>
						</p>
						<ProgressBar now={project.progress} className="progress-sm" /> */}
					</>
				</Card.Body>
			</Card> 
		</>
	);
};

export default ProjectCard;