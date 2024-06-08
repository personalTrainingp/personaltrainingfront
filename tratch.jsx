import { Button, Card, Col, Dropdown, Modal, ProgressBar, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import Flatpickr from 'react-flatpickr';
// images
import sinImage from '@/assets/images/imageBlanck.jpg';
import { useRef, useState } from 'react';
import DataTable from 'react-data-table-component';
import { useForm } from '@/hooks/useForm';
import { useProgramaTrainingStore } from '@/hooks/hookApi/useProgramaTrainingStore';
import Select from 'react-select';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { getHorarioPgm } from '@/store/tableHorario/tablehorarioSlice';
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
const ProjectCard = ({ project, DataTrainerPrueba, columns, data, API_URL }) => {
	const dispatch = useDispatch();
	const { hrpgm } = useSelector((e) => e.hrpgm);
	const [onModal, setOnModal] = useState(false);
	const [onModalDelete, setonModalDelete] = useState(false);
	const [viewImage, setviewImage] = useState(
		`${API_URL}/file/logo/${project.tb_image.name_image}`
	);
	const { startUpdateProgramaPT, startRegisterHorarioPgm, startUpdateHorarioPgm, startDeleteHorarioPgm, startDeleteProgramaTraining } = useProgramaTrainingStore();
	const [isActive, setIsActive] = useState(false);
	const {
		id_pgm,
		desc_pgm,
		name_pgm,
		onInputChange: onUpdateInputChange,
		formState,
		onResetForm,
	} = useForm(project);
	const { onFileChange: onUpdateInputFileChange, formState: formImg } = useForm(project.tb_image);
	const {
		id_horarioPgm,
		aforo_HorarioPgm,
		time_HorarioPgm,
		trainer_HorarioPgm,
		estado_HorarioPgm,
		onInputChange: onPostInputHorarioChange,
		onInputChangeButton,
		onInputChangeReact,
		onInputChangeFlaticon,
		formState: formStateHr,
		onResetForm: onResetFormHr,
	} = useForm(hrpgm);
	const ClickOnOpenModal = () => {
		setOnModal(true);
	};
	const ClickOnCloseModal = () => {
		setOnModal(false);
		onResetForm();
		setviewImage(`${API_URL}/file/logo/${project.tb_image.name_image}`);
		dispatch(getHorarioPgm(registerHorarioPgm));
	};
	const ViewDataImg = (e) => {
		const file = e.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			setviewImage(reader.result);
		};
		reader.readAsDataURL(file);
	};
	const onStartSubmitUpdate = (e) => {
		e.preventDefault();
		startUpdateProgramaPT(formImg.name_image, formState);
		setOnModal(false);
	};
	const clickonOpenModalDelete = () => {
		setonModalDelete(true);
	};
	const onClickDeletePgm = ()=>{
		startDeleteProgramaTraining(project.id_pgm)
		clickonOpenModalDelete()
	}
	//CRUD HORARIOS DE PROGRAMA
	const onStartSubmitPost = (e) => {
		e.preventDefault();
		if (formStateHr.id_horarioPgm == 0) {
            startRegisterHorarioPgm(formStateHr, id_pgm);
			onResetFormHr();
			return;
		}
		startUpdateHorarioPgm(formStateHr, id_pgm);
		dispatch(getHorarioPgm(registerHorarioPgm));
	};
	const onClickChangeisActive = (e) => {
		setIsActive(!isActive);
		onInputChangeButton(e, !isActive);
	};
	const handleRowClick = (row) => {
		console.log('Datos de la fila clickeada:', row);
        setIsActive(row.estado_HorarioPgm)
		dispatch(getHorarioPgm(row));
	};
	const onClickDelete = ()=>{
		dispatch(getHorarioPgm(registerHorarioPgm));
		startDeleteHorarioPgm(formStateHr.id_horarioPgm)
	}
	return (
		<>
			<Modal show={onModal} onHide={ClickOnCloseModal} size="xl">
				<Modal.Header>
					<Modal.Title>Editar programa {project.name_pgm}</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<form onSubmit={onStartSubmitUpdate}>
						<Row>
							<Col lg={6}>
								<img src={viewImage} style={{ width: '100%', height: '30vh' }} />
								<input
									type="file"
									className="form-control mt-2"
									accept="image/png, image/jpeg, image/jpg"
									onChange={(e) => {
										onUpdateInputFileChange(e);
										ViewDataImg(e);
									}}
									name="name_image"
								/>
							</Col>
							<Col lg={6}>
								<div className="mb-4">
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
								<div className="mb-4">
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
								<Button type="submit">Actualizar informacion</Button>
							</Col>
						</Row>
					</form>
					<Row className="mt-4">
						<form onSubmit={onStartSubmitPost}>
							<Row className='justify-content-center'>
								<input
									className="form-control"
									value={id_horarioPgm}
									onChange={onPostInputHorarioChange}
									type='hidden'
									required
								/>
								<Col xl={2}>
									<div className="mb-2">
										{/* <Flatpickr
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
												onInputChangeFlaticon(e, 'time_HorarioPgm')
											}
											required
										/> */}
									</div>
								</Col>
								<Col xl={1}>
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
								<Col xl={4}>
									<div className="mb-2">
										<Select
											onChange={(e) =>
												onInputChangeReact(e, 'trainer_HorarioPgm')
											}
											name={'trainer_HorarioPgm'}
											placeholder={'Seleccione el entrenador(a)'}
											className="react-select"
											classNamePrefix="react-select"
											options={DataTrainerPrueba}
											value={DataTrainerPrueba.find(
												(option) => option.value === trainer_HorarioPgm
											)}
											required
										></Select>
									</div>
								</Col>
								<Col xl={2}>
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
								<Col xl={2}>
									<Button type="submit" className='form-control'>
                                        {/* <i className={`mdi ${formStateHr.id_horarioPgm == 0?'mdi-plus':'mdi-square-edit-outline'}`}></i> */}
										{formStateHr.id_horarioPgm == 0 ? 'Agregar' : 'Actualizar'}
									</Button>
								</Col>
                                {!(formStateHr.id_horarioPgm == 0) &&(
                                <Col xl={1}>
									<Button className='btn-danger' onClick={onClickDelete}>
                                        <i className='mdi mdi-delete'></i>
									</Button>
                                </Col>
                                )
                                }
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
				</Modal.Body>
			</Modal>
			<Card className="d-block">
				{project.tb_image.name_image && (
					<>
						<img
							className="card-img-top bg-black p-4"
							height={'190vh'}
							src={`http://localhost:4000/api/file/logo/${project.tb_image.name_image}`}
							alt=""
						/>
						<div className="card-img-overlay"></div>
					</>
				)}

				<Card.Body className={project.tb_image.name_image ? 'position-relative' : ''}>
					{/* {!project.image && (
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
									<i className="mdi mdi-pencil me-1"></i>Edit
								</Dropdown.Item>
								<Dropdown.Item>
									<i className="mdi mdi-delete me-1"></i>Delete
								</Dropdown.Item>
								<Dropdown.Item>
									<i className="mdi mdi-email-outline me-1"></i>Invite
								</Dropdown.Item>
								<Dropdown.Item>
									<i className="mdi mdi-exit-to-app me-1"></i>Leave
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>
					)} */}
					<Dropdown className="card-widgets" align="end">
						<Dropdown.Toggle
							variant="link"
							as="a"
							className="card-drop arrow-none cursor-pointer p-0 shadow-none"
						>
							<i className="ri-more-fill"></i>
						</Dropdown.Toggle>

						<Dropdown.Menu>
							<Dropdown.Item onClick={clickonOpenModalDelete}>
								<i className="mdi mdi-delete me-1"></i>Delete
							</Dropdown.Item>
						</Dropdown.Menu>
					</Dropdown>
					<Modal show={onModalDelete} onHide={()=>setonModalDelete(false)}>
						{/* <Modal.Header>
							<Modal.Title>
								Eliminar 
							</Modal.Title>
						</Modal.Header> */}
						<Modal.Body>
							<p className='fs-4'>Seguro que quiere eliminar <b>{project.name_pgm}</b></p>
							<Button onClick={onClickDeletePgm}>Eliminar programa</Button>
							<Button onClick={()=>{setonModalDelete(false)}}>Cancelar</Button>
						</Modal.Body>
					</Modal>

					<h4 className="mt-0" onClick={ClickOnOpenModal} style={{ cursor: 'pointer' }}>
						<div>{project.name_pgm}</div>
					</h4>

					{/* {!project.image && (
						<div
							className={classNames('badge', {
								'bg-success': project.state === 'Finished',
								'bg-secondary text-light': project.state === 'Ongoing',
								'bg-warning': project.state === 'Planned',
							})}
						>
							{project.state}
						</div>
					)} */}

					{project.desc_pgm && (
						<p className="text-muted font-13 my-1">
							{project.desc_pgm}...
							<Link
								onClick={ClickOnOpenModal}
								style={{ cursor: 'pointer' }}
								className="fw-bold text-muted"
							>
								view more
							</Link>
						</p>
					)}

					<p className="mb-1">
						<span className="pe-2 text-nowrap mb-2 d-inline-block">
							<i className="mdi mdi-human-queue text-muted me-1"></i>
							<b>{project.totalTasks}</b> Personas
						</span>
						<span className="text-nowrap mb-2 d-inline-block">
							<i className="mdi mdi-clock-time-four-outline text-muted me-1"></i>
							<b>{project.tb_HorarioProgramaPTs.length}</b> Horarios
						</span>
					</p>

						<>
							<p className="mt-3 mb-2 fw-bold">
								Progress <span className="float-end">{project.progress}%</span>
							</p>
							<ProgressBar now={project.progress} className="progress-sm" />
						</>
					{/* {project.image && (
					)} */}
				</Card.Body>

				{/* {project.image && (
					<ul className="list-group list-group-flush">
						<li className="list-group-item p-3">
							<p className="mb-2 fw-bold">
								Progress <span className="float-end">{project.progress}%</span>
							</p>

							{project.progress < 30 && (
								<ProgressBar now={project.progress} className="progress-sm" />
							)}
							{project.progress > 30 && project.progress < 100 && (
								<ProgressBar now={project.progress} className="progress-sm" />
							)}
							{project.progress === 100 && (
								<ProgressBar now={project.progress} className="progress-sm" />
							)}
						</li>
					</ul>
				)} */}
			</Card>
		</>
	);
};




<Modal size='xxl' show={show} onHide={hide}>
        <Modal.Header>
            <Modal.Title>Agrega un programa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div>
              <Row className='container-imgs d-flex justify-content-center'>
                <p className='fs-5'>Seleccione un programa:</p>
                {/* {
                  datapgmPT.map(e=>{
                    if(!e.estado_pgm){
                      return;
                    }
                    return(
                    <Col onClick={()=>onClickProgramaTraining(e.id_pgm)} xl={3} lg={3} sm={3} xs={6} style={{cursor: 'pointer'}} className='content-img bg-black p-2 hover-card-border' key={e.id_pgm}>
                      <img width={100} height={50} src={`http://localhost:4000/api/file/logo/${e.tb_image.name_image}`}/>
                    </Col>
                    )
                  })
                } */}
              </Row>
              <div>
                <form onSubmit={onSubmitRegisterPrograma}>
                  <Row>
                  <Col xl={4}>
                    <div className='mb-2'>
                    </div>
                  </Col>

                    {/* <Button type='submit'>Registrar compra</Button> */}
                  </Row>

                </form>
              </div>
            </div>
        </Modal.Body>
    </Modal>

export default ProjectCard;
























// 
// 
// 
// 
// 

<Modal show={modalReg} onHide={()=>setModalReg(false)}>
<Modal.Body>
									  <h3>Registrar producto</h3>
									  <form className="ps-3 pe-3" onSubmit={onStartSubmit}>
				  {/* <input
												  className="form-control"
												  type="number"
												  name='id_prodInv'
												  value={id_prodInv}
												  onChange={onRegisterInputChange}
												  id="id_prodInv"
												  placeholder="id"
					required
											  /> */}
										  <div className="mb-3">
											  <label htmlFor="distrito_prov" className="form-label">
												  Articulo / producto*
											  </label>
											  <Select
													  onChange={(e)=>onInputChangeReact(e, "id_articulo")}
													  name={"id_articulo"}
													  placeholder={'Seleccione el articulo'}
													  className="react-select"
													  classNamePrefix="react-select"
					  defaultValue={optionsArticuloProd[id_articulo]}
					  options={optionsArticuloProd}
													  required
											  ></Select>
										  </div>
										  <div className="mb-3">
											  <label htmlFor="distrito_prov" className="form-label">
												  Uso del articulo*
											  </label>
											  <Select
													  onChange={(e)=>onInputChangeReact(e, "id_usoArt")}
													  name={"id_usoArt"}
													  placeholder={'Seleccione el distrito'}
													  className="react-select"
													  classNamePrefix="react-select"
													  options={optionsUsoArtProd}
													  defaultValue={optionsUsoArtProd[id_usoArt]}
													  required
											  ></Select>
										  </div>
										  <div className="mb-3">
											  <label htmlFor="distrito_prov" className="form-label">
												  Clasificacion*
											  </label>
											  <Select
													  onChange={(e)=>onInputChangeReact(e, "id_clasificacion")}
													  name={"id_clasificacion"}
													  placeholder={'Seleccione el distrito'}
													  className="react-select"
													  classNamePrefix="react-select"
													  options={optionsClasificacionProd}
													  defaultValue={optionsClasificacionProd[id_clasificacion]}
													  required
											  ></Select>
										  </div>
										  <div className="mb-3">
											  <label htmlFor="id_almacen" className="form-label">
												  Almacen*
											  </label>
											  <Select
													  onChange={(e)=>onInputChangeReact(e, "id_almacen")}
													  name={"id_almacen"}
													  placeholder={'Seleccione el almacen'}
													  className="react-select"
													  classNamePrefix="react-select"
													  options={optionsAlmacenProd}
													  defaultValue={optionsAlmacenProd[id_almacen]}
													  required
											  ></Select>
										  </div>
										  <div className="mb-3">
											  <label htmlFor="distrito_prov" className="form-label">
												  Unidad de medida*
											  </label>
											  <Select
													  onChange={(e)=>onInputChangeReact(e, "id_unidMedida")}
													  name={"id_unidMedida"}
													  placeholder={'Seleccione el distrito'}
													  className="react-select"
													  classNamePrefix="react-select"
													  options={optionsUnidMedidasProd}
													  defaultValue={optionsUnidMedidasProd[id_unidMedida]}
													  required
											  ></Select>
										  </div>
										  <div className="mb-3">
											  <label htmlFor="distrito_prov" className="form-label">
												  Stock*
											  </label>
				  <input
												  className="form-control"
												  type="number"
												  name='stock_prodInv'
												  value={stock_prodInv}
												  onChange={onRegisterInputChange}
												  id="stock_prodInv"
												  placeholder="Stock"
					required
											  />
										  </div>
										  <div className="mb-3">
											  <label htmlFor="distrito_prov" className="form-label">
												  precio de venta
											  </label>
											  <input
												  className="form-control"
												  name='precio_prodInv'
												  value={precio_prodInv}
												  onChange={(e)=>onRegisterInputChange(CurrencyMask(e))}
												  id="precio_prodInv"
												  placeholder="Precio de venta"
												  required
											  />
										  </div>
										  <div className="mb-3 text-center">
											  <button className="btn btn-rounded btn-primary" type="submit">
												  Registrar producto al inventario
											  </button>
										  </div>
									  </form>

</Modal.Body>
</Modal>