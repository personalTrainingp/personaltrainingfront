import { Row, Col, Card, Button, Table} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useRef, useState } from 'react';
import { ModalAccesorio } from './ModalAccesorio';
import { useSelector } from 'react-redux';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import ModalPrograma from './ventaPrograma';
import { ModalSuplementos } from './ModalSuplementos';
import { ResumenVentaMembresia } from './ResumenVentaMembresia';
import { ModalTransferencia } from './ModalTransferencia';
import { ResumenVentaProductos } from './ResumenVentaProductos';
import { ModalVentaFitology } from './ModalVentaFitology';
import { ResumenVentaProductosSuplemento } from './ResumenVentaProductosSuplemento';
import { ResumenVentaFitology } from './ResumenVentaFitology';
import { ModalVentaNutricion } from './ModalVentaNutricion';
import { ResumenVentaNutricion } from './ResumenVentaNutricion';
import { useDispatch } from 'react-redux';
import { RESET_STATE_VENTA } from '@/store/uiNuevaVenta/uiNuevaVenta';
import { useVentasStore } from '@/hooks/hookApi/useVentasStore';

const Shipping = ({ dataVenta, datos_pagos, detalle_cli_modelo, funToast }) => {
	const [modalAcc, setModalAcc] = useState(false)
	const [modalSupl, setModalSupl] = useState(false)
	const [modalPgm, setModalPgm] = useState(false)
	const [modalVentaFitology, setmodalVentaFitology] = useState(false)
	const [modalNutricion, setmodalNutricion] = useState(false)
	const [modalTransMem, setmodalTransMem] = useState(false)
	const { startRegisterVenta, msgBox } = useVentasStore()
	const dispatch = useDispatch()
	const ClickOpenModalAcc = ()=>{
		setModalAcc(true)
	}
	const ClickOpenModalProgramas = ()=>{
		setModalPgm(true)
	}
	const ClickOpenModalFitology = ()=>{
		setmodalVentaFitology(true)
	}
	const ClickCloseModalFitology = ()=>{
		setmodalVentaFitology(false)
	}
	const ClickOpenModalTransfMemb = ()=>{
		setmodalTransMem(true)
	}
	const clickCloseModalTransfMemb = () =>{
		setmodalTransMem(false)
	}
	const onOpenModalSupl = ()=>{
		setModalSupl(true)
	}
	const onCloseModalSupl = ()=>{
		setModalSupl(false)
	}
	const onOpenModalNut = ()=>{
		setmodalNutricion(true)
	}
	const onCloseModalNut = ()=>{
		setmodalNutricion(false)
	}
	if(detalle_cli_modelo.id_cliente==0){
		return(
			<>
			ELIJA UN CLIENTE PARA EMPEZAR A VENDER
			</>
		)
	}
	const onSubmitFormVentaANDnew = async()=>{
		await startRegisterVenta({dataVenta, datos_pagos, detalle_cli_modelo}, funToast)
		dispatch(RESET_STATE_VENTA())
		// await funToast(msgBox.severity, msgBox.summary, msgBox.detail, msgBox.label, msgBox.life)
	}
	const onSubmitFormVenta = async()=>{
		startRegisterVenta({dataVenta, datos_pagos, detalle_cli_modelo})
		// onSubmitFormVentaANDnew()   
	}
	return (
		<>
		<Row>
			<Col>
				{/* <h4 className="mt-2">Elige la venta que se va a hacer:</h4> */}
				<Row>
					{detalle_cli_modelo.id_cliente!==0 && (
						<>
							<Col lg={12}>
								<Row>
									<Col sm={6} xl={2} className="mb-3" onClick={ClickOpenModalAcc}>
										<Card className="mb-0 h-100 border-1">
											<Card.Body>
												<div className="border-dashed border-2 border h-100 w-100 rounded d-flex align-items-center justify-content-center">
													<Link
														to=""
														className="text-center text-muted p-2"
														data-bs-toggle="modal"
														data-bs-target="#exampleModal"
													>
														<i className="mdi mdi-plus h3 my-0"></i>
														<h4 className="font-16 mt-1 mb-0 d-block">Venta de ACCESORIOS</h4>
													</Link>
												</div>
											</Card.Body>
										</Card>
									</Col>
									<ModalAccesorio show={modalAcc} hide={()=>setModalAcc(false)}/>
									{
										(
											<>
											<Col sm={6} xl={2} className="mb-3" onClick={ClickOpenModalProgramas}>
												<Card className="mb-0 h-100 border-1">
													<Card.Body>
														<div className="border-dashed border-2 border h-100 w-100 rounded d-flex align-items-center justify-content-center">
															<Link
																to=""
																className="text-center text-muted p-2"
																data-bs-toggle="modal"
																data-bs-target="#exampleModal"
															>
																<i className="mdi mdi-plus h3 my-0"></i>
																<h4 className="font-16 mt-1 mb-0 d-block">Venta de MEMBRESIAS</h4>
															</Link>
														</div>
													</Card.Body>
												</Card>
											</Col>
											<ModalPrograma show={modalPgm} hide={()=>setModalPgm(false)}/>
											</>
										)
									}
									<Col sm={6} xl={2} className="mb-3" onClick={onOpenModalSupl}>
										<Card className="mb-0 h-100 border-1">
											<Card.Body>
												<div className="border-dashed border-2 border h-100 w-100 rounded d-flex align-items-center justify-content-center">
													<Link
														to=""
														className="text-center text-muted p-2"
														data-bs-toggle="modal"
														data-bs-target="#exampleModal"
													>
														<i className="mdi mdi-plus h3 my-0"></i>
														<h4 className="font-16 mt-1 mb-0 d-block">Venta de SUPLEMENTOS</h4>
													</Link>
												</div>
											</Card.Body>
										</Card>
									</Col>
									<ModalSuplementos show={modalSupl} hide={onCloseModalSupl}/>
									<Col sm={6} xl={2} className="mb-3" onClick={ClickOpenModalFitology}>
										<Card className="mb-0 h-100 border-1">
											<Card.Body>
												<div className="border-dashed border-2 border h-100 w-100 rounded d-flex align-items-center justify-content-center">
													<Link
														to=""
														className="text-center text-muted p-2"
														data-bs-toggle="modal"
														data-bs-target="#exampleModal"
													>
														<i className="mdi mdi-plus h3 my-0"></i>
														<h4 className="font-16 mt-1 mb-0 d-block">Venta de citas FITOLOGY</h4>
													</Link>
												</div>
											</Card.Body>
										</Card>
									</Col>
									<ModalVentaFitology show={modalVentaFitology} onHide={ClickCloseModalFitology}/>
									<Col sm={6} xl={2} className="mb-3" onClick={onOpenModalNut}>
										<Card className="mb-0 h-100 border-1">
											<Card.Body>
												<div className="border-dashed border-2 border h-100 w-100 rounded d-flex align-items-center justify-content-center">
													<Link
														to=""
														className="text-center text-muted p-2"
														data-bs-toggle="modal"
														data-bs-target="#exampleModal"
													>
														<i className="mdi mdi-plus h3 my-0"></i>
														<h4 className="font-16 mt-1 mb-0 d-block">Venta de citas NUTRICIONALES</h4>
													</Link>
												</div>
											</Card.Body>
										</Card>
									</Col>
									<ModalVentaNutricion show={modalNutricion} onHide={onCloseModalNut}/>
									<Col sm={6} xl={2} className="mb-3" onClick={ClickOpenModalTransfMemb}>
										<Card className="mb-0 h-100 border-1">
											<Card.Body>
												<div className="border-dashed border-2 border h-100 w-100 rounded d-flex align-items-center justify-content-center">
													<Link
														to=""
														className="text-center text-muted p-2"
														data-bs-toggle="modal"
														data-bs-target="#exampleModal"
													>
														<i className="mdi mdi-plus h3 my-0"></i>
														<h4 className="font-16 mt-1 mb-0 d-block">Ventas de TRANSFERENCIAS</h4>
													</Link>
												</div>
											</Card.Body>
										</Card>
									</Col>
									<ModalTransferencia show={modalTransMem} onHide={clickCloseModalTransfMemb}/>
								</Row>
							</Col>
							<Col lg={12}>
							{dataVenta.detalle_venta_programa.length <= 0 &&
							dataVenta.detalle_venta_fitology.length <= 0 && 
							dataVenta.detalle_venta_accesorio.length <= 0 && 
							dataVenta.detalle_venta_suplementos.length <= 0 &&
							dataVenta.detalle_venta_nutricion.length<=0
							? (
								<span style={{height: '100px'}}>No hay ningún producto, membresía o servicio registrado</span>
							) : (
							<>
							{dataVenta.detalle_venta_programa.length > 0 && (
								<>
									<h4>Venta de membresía</h4>
									<ResumenVentaMembresia dataVenta={dataVenta.detalle_venta_programa[0]} detalle_cli_modelo={detalle_cli_modelo} />
								</>
							)}
							{dataVenta.detalle_venta_accesorio.length > 0 && (
								<>
									<h4>Venta de accesorios</h4>
									<ResumenVentaProductos dataVenta={dataVenta.detalle_venta_accesorio}/>
								</>
							)}
							{dataVenta.detalle_venta_suplementos.length > 0 && (
								<>
									<h4>Venta de suplementos</h4>
									<ResumenVentaProductosSuplemento dataVenta={dataVenta.detalle_venta_suplementos}/>
								</>
							)}
							{dataVenta.detalle_venta_fitology.length > 0 && (
								<>
									<h4>Venta de citas fitology</h4>
									<ResumenVentaFitology dataVenta={dataVenta.detalle_venta_fitology}/>
								</>
							)}
							{dataVenta.detalle_venta_nutricion.length > 0 && (
								<>
									<h4>Venta de citas Nutricion</h4>
									<ResumenVentaNutricion dataVenta={dataVenta.detalle_venta_nutricion}/>
								</>
							)}
							<Button className={'m-1'} onClick={onSubmitFormVentaANDnew}>Guardar y Nuevo</Button>
							</>
							)}
							</Col>
						</>
					)
					}
				</Row>
			</Col>
		</Row>
		{/* <div className='container d-flex justify-content-between'>
			<Button onClick={handelPrev}>Anterior</Button>
			<Button onClick={handelNext}>Siguiente</Button>
		</div> */}
		</>
	);
};

export default Shipping;
