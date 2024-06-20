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
import { CurrencyMask, FormatoDateMask } from '@/components/CurrencyMask';
import { ScrollPanel } from 'primereact/scrollpanel';
// import './ScrollPanelDemo.css';

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
	console.log(dataMetas);
	useEffect(() => {
		obtenerMetas();
	}, []);

	function filtrarPorFechas(arrayObjetos, tipoFiltro) {
		// Obtener la fecha actual en formato JavaScript
		const fechaActual = new Date();
	  
		// Función para comparar la fecha actual con la fecha de inicio
		function esFechaAnterior(fechaInicio) {
		  const fechaInicioObj = new Date(fechaInicio);
		  return fechaActual < fechaInicioObj;
		}
	  
		// Función para comparar la fecha actual con la fecha final
		function esFechaPosterior(fechaFinal) {
		  const fechaFinalObj = new Date(fechaFinal);
		  return fechaActual > fechaFinalObj;
		}
	  
		// Función para verificar si la fecha actual está dentro del rango
		function esFechaDurante(fechaInicio, fechaFinal) {
		  const fechaInicioObj = new Date(fechaInicio);
		  const fechaFinalObj = new Date(fechaFinal);
		  return fechaActual >= fechaInicioObj && fechaActual <= fechaFinalObj;
		}
	  
		// Filtrar el array de objetos según el tipo de filtro especificado
		let objetosFiltrados = [];
		switch (tipoFiltro) {
		  case 'anterior':
			objetosFiltrados = arrayObjetos.filter(objeto => esFechaAnterior(objeto.fec_init));
			break;
		  case 'despues':
			objetosFiltrados = arrayObjetos.filter(objeto => esFechaPosterior(objeto.fec_final));
			break;
		  case 'durante':
			objetosFiltrados = arrayObjetos.filter(objeto => esFechaDurante(objeto.fec_init, objeto.fec_final));
			break;
		  default:
			console.error('Tipo de filtro no reconocido');
			break;
		}
	  
		return objetosFiltrados;
	  }
	  	const formatCurrency = (value) => {
		return value.toLocaleString('PEN', { style: 'currency', currency: 'PEN' });
		};
		
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
										<h2>SIN INICIAR</h2>
										<ScrollPanel style={{ width: '100%', height: '200px' }} className="custombar1">
											{filtrarPorFechas(dataMetas, 'anterior').map(e=>{
												return (
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
													{e.nombre_meta}
													{/* {project.name_pgm} - {project.sigla_pgm} */}
												</Link>
											</h4>
											<p className="mb-1">
												<span className="pe-2 text-nowrap mb-2 d-inline-block">
													Meta: <b>{e.meta}</b>
												</span>
												<span className="pe-2 text-nowrap mb-2 d-inline-block">
													Bono: <b>{e.bono}</b>
												</span>
												<span className="pe-2 text-nowrap mb-2 d-inline-block">
													Inicio: <b>{e.fec_init}</b>
												</span>
												<span className="pe-2 text-nowrap mb-2 d-inline-block">
													Fin: <b>{e.fec_final}</b>
												</span>
											</p>
											{(
												<p className="text-muted font-13 my-1">
													{e.observacion.substring(0, 30)}
													{e.observacion.length > 30 && (
														<>
															...
															<Link
																style={{ cursor: 'pointer' }}
																className="fw-bold text-muted"
															>Ver mas
															</Link>
														</>
														)}    
												</p>
											)}
											
												</Card.Body>
											</Card>
												)
											})
											}
										</ScrollPanel>
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
										<h2>EN PROGRESO</h2>
										{filtrarPorFechas(dataMetas, 'durante').map(e=>{
											return (
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
												{e.nombre_meta}
												{/* {project.name_pgm} - {project.sigla_pgm} */}
											</Link>
										</h4>
										<p className="mb-1">
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Meta: <b>{e.meta}</b>
											</span>
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Bono: <b>{e.bono}</b>
											</span>
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Inicio: <b>{e.fec_init}</b>
											</span>
											<span className="pe-2 text-nowrap mb-2 d-inline-block">
												Fin: <b>{e.fec_final}</b>
											</span>
										</p>
										{(
											<p className="text-muted font-13 my-1">
												{e.observacion.substring(0, 30)}
												{e.observacion.length > 30 && (
													<>
														...
														<Link
															style={{ cursor: 'pointer' }}
															className="fw-bold text-muted"
														>Ver mas
														</Link>
													</>
													)}    
											</p>
										)}
										
											</Card.Body>
										</Card>
											)
										})
										}
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
										<h2>COMPLETADA</h2>
										<ScrollPanel style={{ width: '100%', height: '700px' }} className="custombar1">
											{filtrarPorFechas(dataMetas, 'despues').map(e=>{
												return (
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
													{e.nombre_meta}
													{/* {project.name_pgm} - {project.sigla_pgm} */}
												</Link>
											</h4>
											<p className="mb-1">
												<span className="pe-2 text-nowrap mb-2 d-inline-block">
													Meta: <b>{formatCurrency(e.meta)}</b>
												</span>
												<span className="pe-2 text-nowrap mb-2 d-inline-block">
													Bono: <b>{e.bono}</b>
												</span>
												<span className="pe-2 text-nowrap mb-2 d-inline-block">
													Inicio: <b>{FormatoDateMask(e.fec_init, 'D [de] MMMM [de] YYYY')}</b>
												</span>
												<span className="pe-2 text-nowrap mb-2 d-inline-block">
													Fin: <b>{FormatoDateMask(e.fec_final, 'D [de] MMMM [de] YYYY')}</b>
												</span>
											</p>
											{(
												<p className="text-muted font-13 my-1">
													{e.observacion.substring(0, 30)}
													{e.observacion.length > 30 && (
														<>
															...
															<Link
																style={{ cursor: 'pointer' }}
																className="fw-bold text-muted"
															>Ver mas
															</Link>
														</>
														)}    
												</p>
											)}
											
												</Card.Body>
											</Card>
												)
											})
											}
										</ScrollPanel>
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
