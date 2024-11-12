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
import icon_CARRITO from '@/assets/images/carrito.png'
import { Loading } from '@/components/Loading';
import Swal from 'sweetalert2';
import icoMem from '@/assets/images/PT-images/iconos/mem.png'
import icoAcc from '@/assets/images/PT-images/iconos/acc.png'
import icoEst from '@/assets/images/PT-images/iconos/estetica.png'
import icoSupl from '@/assets/images/PT-images/iconos/supl.png'
import icoNut from '@/assets/images/PT-images/iconos/nutri.png'
import icoTransf from '@/assets/images/PT-images/iconos/transf.png'
import { ItemProdServ } from '../reportes/totalVentas/ItemProdServ';
import { ModalTraspaso } from './ModalTraspaso';
import { ResumenTraspaso } from './ResumenTraspaso';
import { ResumenVentaTransferencia } from './ResumenVentaTransferencia';


export const sumarTarifas = (venta) =>{
	const sumaTarifas = Object.values(venta)
	.flatMap(array => array) // Aplanamos los arrays en uno solo
	.map(objeto => objeto.tarifa) // Obtenemos un array con todas las tarifas
	.filter(tarifa => typeof tarifa === 'number') // Filtramos solo los valores que son números
	.reduce((total, tarifa) => total + tarifa, 0); // Sumamos todas las tarifas
	return sumaTarifas
}

export const sumarPagos = (dataPagos)=>{
	const sumaPagos = Object.values(dataPagos).flatMap(array=>array).map(obj=>obj.monto_pago)
	.reduce((total, tarifa) => total + tarifa, 0); // Sumamos todas las tarifas
	return sumaPagos;
}
const Shipping = ({ dataVenta, datos_pagos, detalle_cli_modelo, funToast }) => {
	const [modalAcc, setModalAcc] = useState(false)
	const [modalSupl, setModalSupl] = useState(false)
	const [modalPgm, setModalPgm] = useState(false)
	const [modalVentaFitology, setmodalVentaFitology] = useState(false)
	const [modalNutricion, setmodalNutricion] = useState(false)
	const [modalTransMem, setmodalTransMem] = useState(false)
	const [modalTraspaso, setmodalTraspaso] = useState(false)
	const { startRegisterVenta, msgBox, loadingVenta } = useVentasStore()
	const dispatch = useDispatch()
	const onOpenModalTraspaso = ()=>{
		setmodalTraspaso(true)
	}
	const onCloseModalTraspaso = ()=>{
        setmodalTraspaso(false)
    }
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
	if(detalle_cli_modelo.id_cli==0){
		return(
			<div style={{ height: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', opacity: '.5'}}>
				<img src={icon_CARRITO} style={{width: '80px', height: '80px'}}>
				</img>
				ELIJA UN SOCIO PARA EMPEZAR A VENDER
			</div>
		)
	}
	const onSubmitFormVentaANDnew = async()=>{
		if(sumarPagos(datos_pagos)!==sumarTarifas(dataVenta)){
			return Swal.fire({
				icon: 'error',
				title: 'EL PAGO DEBE DE SER IGUAL AL SALDO PENDIENTE',
				showConfirmButton: false,
				timer: 2000,
			});
		}
		if(detalle_cli_modelo.id_tipo_transaccion==0 || detalle_cli_modelo.id_empl==0){
			return Swal.fire({
				icon: 'error',
				title: 'COMPLETAR LOS CAMPOS DE SOCIO',
				showConfirmButton: false,
				timer: 2000,
			});
		}
		await startRegisterVenta({dataVenta, datos_pagos, detalle_cli_modelo}, funToast)
		dispatch(RESET_STATE_VENTA())
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
					{detalle_cli_modelo.id_cli!==0 && (
						<>
							<Col lg={12}>
							<div className='container-fluid'>
								<Row>
									<Col className="mb-3" xxl={3} onClick={ClickOpenModalProgramas}>
										<ItemProdServ Inombre={"MEMBRESIAS"} Iabrev={"acc"} icono={icoMem} icowid={100} icohe={120} Icantidad={''} Itotal={''}/>
									</Col>
									<ModalPrograma show={modalPgm} hide={()=>setModalPgm(false)}/>
									<Col className="mb-3" xxl={3} onClick={ClickOpenModalAcc}>
										<ItemProdServ Inombre={"ACCESORIOS"} Iabrev={"acc"} icono={icoAcc} icowid={100} icohe={120} Icantidad={''} Itotal={''}/>
									</Col>
									<ModalAccesorio show={modalAcc} hide={()=>setModalAcc(false)}/>
									<Col className="mb-3" xxl={3} onClick={onOpenModalSupl}>
										<ItemProdServ Inombre={"SUPLEMENTOS"} Iabrev={"acc"} icono={icoSupl} icowid={100} icohe={120} Icantidad={''} Itotal={''}/>
									</Col>
									<ModalSuplementos show={modalSupl} hide={onCloseModalSupl}/>
									<Col className="mb-3" xxl={3} onClick={onOpenModalNut}>
									<ItemProdServ Inombre={"CITAS NUTRICIONISTA"} Iabrev={"acc"} icono={icoNut} icowid={100} icohe={120} Icantidad={''} Itotal={''}/>
									</Col>
									<ModalVentaNutricion show={modalNutricion} onHide={onCloseModalNut}/>
									<Col className="mb-3" xxl={3} onClick={ClickOpenModalFitology}>
									<ItemProdServ Inombre={"TRATAMIENTOS ESTETICOS"} Iabrev={"acc"} icono={icoEst} icowid={100} icohe={120} Icantidad={''} Itotal={''}/>
									</Col>
									<ModalVentaFitology show={modalVentaFitology} onHide={ClickCloseModalFitology}/>
									<Col className="mb-3" xxl={3} onClick={ClickOpenModalTransfMemb}>
									<ItemProdServ Inombre={"TRANSFERENCIAS DE MEMBRESIAS"} icono={icoTransf} Iabrev={"acc"} icowid={100} icohe={120} Icantidad={''} Itotal={''}/>
									</Col>
									<ModalTransferencia show={modalTransMem} onHide={clickCloseModalTransfMemb}/>
									<Col className="mb-3" xxl={3} onClick={onOpenModalTraspaso}>
									<ItemProdServ Inombre={"TRASPASO PT A CHANGE"} Iabrev={"acc"} icowid={100} icohe={120} Icantidad={''} Itotal={''}/>
									</Col>
									<ModalTraspaso show={modalTraspaso} onHide={onCloseModalTraspaso}/>
								</Row>
							</div>
							</Col>
							<Col lg={12}>
							{dataVenta.detalle_venta_programa.length <= 0 &&
							dataVenta.detalle_venta_fitology.length <= 0 && 
							dataVenta.detalle_venta_accesorio.length <= 0 && 
							dataVenta.detalle_venta_suplementos.length <= 0 &&
							dataVenta.detalle_venta_nutricion.length<=0 &&
							dataVenta.detalle_venta_transferencia.length<=0 &&
							dataVenta.detalle_traspaso <=0
							? (
								<span style={{height: '100px'}}>No hay ningún producto, membresía o servicio registrado</span>
							) : (
							<>
							{dataVenta.detalle_traspaso.length > 0 && (
								<>
									<h4>traspaso</h4>
									<ResumenTraspaso dataVenta={dataVenta.detalle_traspaso[0]} detalle_cli_modelo={detalle_cli_modelo} dataPagos={datos_pagos}/>
									{/* <ResumenVentaMembresia dataVenta={dataVenta.detalle_venta_programa[0]} detalle_cli_modelo={detalle_cli_modelo} dataPagos={datos_pagos} /> */}
								</>
							)}
							{dataVenta.detalle_venta_programa.length > 0 && (
								<>
									<h4>Venta de membresía</h4>
									<ResumenVentaMembresia dataVenta={dataVenta.detalle_venta_programa[0]} detalle_cli_modelo={detalle_cli_modelo} dataPagos={datos_pagos} />
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
							{dataVenta.detalle_venta_transferencia.length > 0 && (
								<>
									<h4>Venta de Transferencias</h4>
									<ResumenVentaTransferencia dataVenta={dataVenta.detalle_venta_transferencia} detalle_cli_modelo={detalle_cli_modelo} dataPagos={datos_pagos}/>
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
		<Loading show={loadingVenta}/>
		{/* <div className='container d-flex justify-content-between'>
			<Button onClick={handelPrev}>Anterior</Button>
			<Button onClick={handelNext}>Siguiente</Button>
		</div> */}
		
		</>
	);
};

export default Shipping;
