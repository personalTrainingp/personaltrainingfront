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
import { ModalMetaxVendedor } from './ModalMetaxVendedor/ModalMetaxVendedor';
// import './ScrollPanelDemo.css';

export const GestMetas = () => {
	const [isModalOpenMetas, setIsModalOpenMetas] = useState(false);
	const [isModalOpenMetasxVendedor, setisModalOpenMetasxVendedor] = useState(false)
	const dispatch = useDispatch();
	const { dataMetas } = useSelector((e) => e.meta);
	const { obtenerMetas, obtenerMeta, dataMeta, isLoading } = useMetaStore();
	const hideModal = () => {
		setIsModalOpenMetas(false);
	};
	const showModal = () => {
		setIsModalOpenMetas(true);
	};
	const showModalMetaxVendedor = (e)=>{
		setisModalOpenMetasxVendedor(true)
		obtenerMeta(e.id_meta)
	}
	const hideModalMetaxVendedor = () => {
        setisModalOpenMetasxVendedor(false);
    };
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
		return value.toLocaleString('en-ES', { style: 'currency', currency: 'PEN' });
		};
	return (
		<>
			<PageBreadcrumb title="Metas" subName="E" />
			<Button onClick={showModal}>Agregar meta</Button>
			
			<ScrollPanel style={{ width: '100%', height: '660px' }} className="custombar1">
											{dataMetas.map((e)=>{
												return (
													<Card className='border border-3' key={e.id_meta}>
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
													<Dropdown.Item onClick={(h)=>showModalMetaxVendedor(e)}>
														Metas por vendedor
													</Dropdown.Item>
													<Dropdown.Item>
														<i className="mdi mdi-delete me-1"></i>Eliminar
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
													Bono: <b>{ formatCurrency(e.bono)}</b>
												</span>
												<span className="pe-2 text-nowrap mb-2 d-inline-block">
													Inicio: <b>{FormatoDateMask(e.fec_init, 'D [de] MMMM [del] YYYY')}</b>
												</span>
												<span className="pe-2 text-nowrap mb-2 d-inline-block">
													Fin: <b>{FormatoDateMask(e.fec_final, 'D [de] MMMM [del] YYYY')}</b>
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
			<ModalMeta show={isModalOpenMetas} onHide={hideModal} />
			<ModalMetaxVendedor show={isModalOpenMetasxVendedor} onHide={hideModalMetaxVendedor} data={dataMeta} isLoading={isLoading}/>
		</>
	);
};
