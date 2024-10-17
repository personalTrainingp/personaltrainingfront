import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { Rating } from 'primereact/rating';
import { Tag } from 'primereact/tag';
import { classNames } from 'primereact/utils';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Fieldset } from 'primereact/fieldset';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { Detalle_membresia } from '@/components/Detalles/Detalle_membresia';
import { Detalle_productos } from '@/components/Detalles/Detalle_productos';
import { Detalle_cita } from '@/components/Detalles/Detalle_cita';
import { ModalViewObservacion } from '../GestVentas/ModalViewObservacion';
import { arrayFacturas } from '@/types/type';
// import { ProductService } from './service/ProductService';

export const ComprasxCliente = ({uid, dataVenta}) => {
	const [isOpenModalObservation, setisOpenModalObservation] = useState(false)
	const [IdBoleta, setIdBoleta] = useState(0)
	const onModalViewObservacion = (id)=>{
		setisOpenModalObservation(true)
		setIdBoleta(id)
	}
	const onCloseModalViewObservacion = ()=>{
		setisOpenModalObservation(false)
		setIdBoleta(0)
	}
//Boleta ${e.id}
    return (
		<>
				<ModalViewObservacion id={IdBoleta} onHide={onCloseModalViewObservacion} show={isOpenModalObservation}/>
				<Accordion>
					{
						dataVenta.map(e=>{
							return (
								<AccordionTab header={
								<div className=''>
									<span className=''>{arrayFacturas?.find(f=>f.value===e.id_tipoFactura)?.label} {e.numero_transac}</span>
									<span className='float-end z-5'>
										<a className='a-focus' onClick={()=>onModalViewObservacion(e.id)}>Ver detalle de boleta</a>
										{/* <Button label="Ver detalle de boleta" text onClick={()=>onModalViewObservacion(e.id)} /> */}
									</span>
								</div>
								} key={e.id}>
								
								<br/>
									{
										e.detalle_ventaMembresia.length>0 && (
											
											<>
											<b className='text-800'>MEMBRESIA: </b>
											{
												e.detalle_ventaMembresia.map(m=>(
													<Detalle_membresia e={m}/>
												))
											}
											</>
										)
									}
									{
										e.detalle_ventaProductos.length>0 && (
											
											<>
											<b className='text-800'>PRODUCTOS: </b>
											{
												e.detalle_ventaProductos.map(p=>(
													<>
													<Detalle_productos e={p}/>
													</>
												))
											}
											</>
										)
									}
									{
										e.detalle_ventaCitas.length>0 && (
											
											<>
											<b className='text-800'>PRODUCTOS: </b>
											{
												e.detalle_ventaCitas.map(c=>(
													<>
													<Detalle_cita e={c}/>
													</>
												))
											}
											</>
										)
									}
								</AccordionTab>
							)
						})
					}
				</Accordion>
		</>
        // <div className="card">
        //     <div className="text-2xl font-bold text-800 m-3">
        //         PRODUCTOS:
        //     </div>
        //     <Table responsive hover className="table-centered table-nowrap mb-0">
		// 			<tbody>
		// 				<tr>
		// 					<td>
		// 						<h5 className="font-14 my-1">
		// 							<Link to="" className="text-body">
        //                                 BFR BODY FAT REMOVAL
		// 							</Link>
		// 						</h5>
		// 						<span className="text-muted font-13">TIPO: SUPLEMENTOS</span>
		// 					</td>
		// 					<td className='text-center'>
		// 						<span className="text-muted font-13 text-center">CANTIDAD</span> <br />
		// 						<span className="font-14 mt-1 fw-normal text-center">2</span>
		// 					</td>
		// 					<td className='text-center'>
        //                         <span className="text-muted font-13 text-center">MONTO</span> <br />
        //                         <span className="font-14 mt-1 fw-normal text-center">S/ 1600.00</span>
		// 					</td>
		// 					<td className='text-center'>
		// 						<span className="text-muted font-13 text-center">Fecha de venta</span> <br />
		// 						<span className="font-14 mt-1 fw-normal text-center">30 de Julio de 2024</span>
		// 					</td>
		// 				</tr>
		// 			</tbody>
		// 		</Table>
        // </div>
    )
}
