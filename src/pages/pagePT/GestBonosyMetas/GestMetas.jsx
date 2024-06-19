import { PageBreadcrumb, Table } from '@/components';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Dropdown, Row } from 'react-bootstrap';
import { ModalMeta } from './ModalMeta';
import { columns, sizePerPageList } from './ColumnsSet';
import { useSelector } from 'react-redux';
import { useMetaStore } from '@/hooks/hookApi/useMetaStore';
import { useDispatch } from 'react-redux';
import Nouislider from 'nouislider-react';
import { Divider } from 'primereact/divider';
import { Link } from 'react-router-dom';

export const GestMetas = () => {
	const [isModalOpenMetas, setIsModalOpenMetas] = useState(false);
	const dispatch = useDispatch();
	const { dataMetas } = useSelector((e) => e.meta);
	const { obtenerMetas } = useMetaStore();
	const hideModal = () => {
		setIsModalOpenMetas(false);
	};
	const showModal = () => {
		setIsModalOpenMetas(true);
	};
	useEffect(() => {
		obtenerMetas();
	}, []);

	return (
		<>
			<PageBreadcrumb title="Metas" subName="E" />
			<Button onClick={showModal}>Agregar meta</Button>
			<Row className='m-3'>
				<Col lg='4'>

					<Card className="d-block" style={{boxShadow: '1px 2px 2px gray'}}>
									<Card.Body
										className={
										''	// project.tb_image.name_image ? 'position-relative p-3' : ''
										}
									>
										<h2>Sin Iniciar</h2>
										<Card className='border border-3'>
											<Card.Body>
												
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

										<h4 className="mt-0" style={{ cursor: 'pointer' }}>
											<Link
												style={{ color: 'black', fontSize: '30px'}}
												to={`/programa`}
											>
												META DE FEBRERO
												{/* {project.name_pgm} - {project.sigla_pgm} */}
											</Link>
										</h4>
										<p className="mb-1">
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Meta: <b>{'2,000.00'}</b>
											</span>
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Bono: <b>{'2000.000'}</b>
											</span>
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Inicio: <b>{'21/09/2020'}</b>
											</span>
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Fin: <b>{'22/10/2020'}</b>
											</span>
										</p>
										{(
											<p className="text-muted font-13 my-1">
												{/* {project.desc_pgm.substring(0, 30)} */}
												{/* {project.desc_pgm.length > 30 && ( */}
													Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam asperiores eos saepe modi itaque nulla veritatis quis vel quibusdam est!
													<>
														...
														<Link
															style={{ cursor: 'pointer' }}
															className="fw-bold text-muted"
														>Ver mas
														</Link>
													</>
												{/* )} */}
											</p>
										)}
										
											</Card.Body>
										</Card>
									</Card.Body>
					</Card>
				</Col>
				<Col lg='4'>
					<Card className="d-block" style={{boxShadow: '2px 5px 5px black'}}>
									<Card.Body
										className={
										''	// project.tb_image.name_image ? 'position-relative p-3' : ''
										}
									>
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
											<Link
												style={{ color: 'black', fontSize: '30px'}}
												to={`/programa`}
											>
												META DE FEBRERO
												{/* {project.name_pgm} - {project.sigla_pgm} */}
											</Link>
										</h4>
										<p className="mb-1">
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Meta: <b>{'2,000.00'}</b>
											</span>
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Bono: <b>{'2000.000'}</b>
											</span>
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Inicio: <b>{'21/09/2020'}</b>
											</span>
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Fin: <b>{'22/10/2020'}</b>
											</span>
										</p>
										{(
											<p className="text-muted font-13 my-1">
												{/* {project.desc_pgm.substring(0, 30)} */}
												{/* {project.desc_pgm.length > 30 && ( */}
													<>
														<Link
															style={{ cursor: 'pointer' }}
															className="fw-bold text-muted"
														>
															Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam asperiores eos saepe modi itaque nulla veritatis quis vel quibusdam est!
														</Link>
													</>
												{/* )} */}
											</p>
										)}
										
									</Card.Body>
					</Card>
				</Col>
				<Col lg='4'>
					<Card className="d-block" style={{boxShadow: '2px 5px 5px black'}}>
									<Card.Body
										className={
										''	// project.tb_image.name_image ? 'position-relative p-3' : ''
										}
									>
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
											<Link
												style={{ color: 'black', fontSize: '30px'}}
												to={`/programa`}
											>
												META DE FEBRERO
												{/* {project.name_pgm} - {project.sigla_pgm} */}
											</Link>
										</h4>
										<p className="mb-1">
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Meta: <b>{'2,000.00'}</b>
											</span>
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Bono: <b>{'2000.000'}</b>
											</span>
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Inicio: <b>{'21/09/2020'}</b>
											</span>
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Fin: <b>{'22/10/2020'}</b>
											</span>
										</p>
										{(
											<p className="text-muted font-13 my-1">
												{/* {project.desc_pgm.substring(0, 30)} */}
												{/* {project.desc_pgm.length > 30 && ( */}
													<>
														<Link
															style={{ cursor: 'pointer' }}
															className="fw-bold text-muted"
														>
															Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quisquam asperiores eos saepe modi itaque nulla veritatis quis vel quibusdam est!
														</Link>
													</>
												{/* )} */}
											</p>
										)}
										
									</Card.Body>
					</Card>
				</Col>
			</Row>
				{/* <div className="flex justify-content-center p-2">
					<Divider align="left">
						<div className="inline-flex align-items-center m-3">
							<b className="fs-3">Sin Iniciar</b>
						</div>
					</Divider>
					<Divider layout="vertical" />
					<Divider align="left">
						<div className="inline-flex align-items-center">
							<b className="fs-3">En progreso</b>
						</div>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam quis
							pariatur, veniam non sit quasi dolor iste dicta voluptatem perferendis
							excepturi rem reiciendis vero facilis doloremque, dignissimos incidunt.
							Ea consectetur corrupti id illum omnis consequatur adipisci harum sequi,
							sit magnam dignissimos eaque ipsum quaerat maxime cumque exercitationem
							esse, voluptates quam.
						</p>
					</Divider>
					<Divider layout="vertical" />
					<Divider align="left">
						<div className="inline-flex align-items-center">
							<b className="fs-3">Completado</b>
						</div>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam quis
							pariatur, veniam non sit quasi dolor iste dicta voluptatem perferendis
							excepturi rem reiciendis vero facilis doloremque, dignissimos incidunt.
							Ea consectetur corrupti id illum omnis consequatur adipisci harum sequi,
							sit magnam dignissimos eaque ipsum quaerat maxime cumque exercitationem
							esse, voluptates quam.
						</p>
					</Divider>
				</div> */}
			<ModalMeta show={isModalOpenMetas} onHide={hideModal} />
		</>
	);
};
