import {
	DateMask,
	DateMaskString,
	FormatoDateMask,
	FormatoTimeMask,
	MoneyFormatter,
} from '@/components/CurrencyMask';
import React, { useState } from 'react';
import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { ModalFirma } from './ModalFirma';
import { useDispatch } from 'react-redux';
import { onAllDeleteTraspaso } from '@/store/uiNuevaVenta/uiNuevaVenta';
import { useVentasStore } from '../../../hooks/hookApi/useVentasStore';
import dayjs from 'dayjs';
import config from '@/config';

export const ResumenTraspaso = ({ dataVenta, detalle_cli_modelo, dataPagos }) => {
    const dispatch = useDispatch();
	const deleteMembresia = () => {
		dispatch(onAllDeleteTraspaso());
	};
    
	return (
		<div className="container">
			<div className="row">
				<h5 className="mb-0">
					<a
						href="#"
						className="d-flex flex-column align-items-start text-primary d-inline-block align-middle p-2 mb-2 font-22"
					>
						<img width={220} src={`${config.API_IMG.LOGO}${dataVenta?.url_image}`} />
						{dataVenta.sesiones} sesiones
					</a>
				</h5>
				<div className="col-lg-12 bg-white rounded shadow-sm mb-5">
					<div className="table-responsive">
						<table className="table">
							<thead>
								<tr>
									<th scope="col" className="border-0 bg-light p-1">
										{/* <div className="p-0 px-3 text-uppercase"> */}
										{/* <img width={220} src={`${config.API_IMG.LOGO}${dataVenta.url_image}`}/> */}
										{/* </div> */}
									</th>
									<th scope="col" className="border-0 bg-light p-1">
										<div className="py-0 text-uppercase">PRECIO</div>
									</th>
									<th scope="col" className="border-0 bg-light p-1">
										<div className="py-0 text-uppercase">ELIMINAR</div>
									</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<th scope="row" className="border-0 p-0">
										<div className="p-0">
											<img
												src="https://bootstrapious.com/i/snippets/sn-cart/product-1.jpg"
												alt=""
												width="70"
												className="img-fluid rounded shadow-sm"
											/>
											<div className="ml-3 d-inline-block align-middle">
												<span className="text-muted font-weight-normal font-italic d-block">
													Hora de Inicio: {dataVenta.time_h}{' '}
												</span>
												<span className="text-muted font-weight-normal font-italic d-block">
													Hora de término:{' '}
													{dayjs(dataVenta.time_h, 'hh:mm A')
														.add(45, 'minute')
														.format('hh:mm A')}
												</span>
												<span className="text-muted font-weight-normal font-italic d-block">
													Fecha de Inicio:{' '}
													{FormatoDateMask(
														dataVenta.fechaInicio_programa,
														'dddd D [de] MMMM [del] YYYY'
													)}{' '}
												</span>
												<span className="text-muted font-weight-normal font-italic d-block">
													Fecha de termino:{' '}
													{FormatoDateMask(
														dataVenta.fechaFinal,
														'dddd D [de] MMMM [del] YYYY'
													)}
												</span>
											</div>
										</div>
									</th>
									<td className="border-0 align-middle">
										<strong>
											{<MoneyFormatter amount={dataVenta.tarifa} />}
										</strong>
									</td>
									{/* <td className="border-0 align-middle"><strong>3</strong></td> */}
									<td className="border-0 align-middle">
										<span onClick={deleteMembresia} className="action-icon">
											<i className="mdi mdi-delete-forever-outline text-danger fs-3 ms-2"></i>
										</span>
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
		//     <Table responsive hover className="table-centered table-nowrap mb-0">
		//     <tbody>
		//         <tr>
		//             <td>
		//                 <h5 className="font-14 my-1">
		//                     <Link to="" className="text-body">
		//                         {dataVenta.name_pgm} - {dataVenta.semanas} Semanas
		//                     </Link>
		//                 </h5>
		//                 <span className="text-muted font-13">Inicia: {FormatoDateMask(dataVenta.fechaInicio_programa, 'D [de] MMMM [del] YYYY')} a las {dataVenta.time_h} </span>
		//                 <br/>
		//                 <span className="text-muted font-13">Finaliza: {FormatoDateMask(dataVenta.fechaFinal, 'D [de] MMMM [del] YYYY')} </span>
		//             </td>
		//             <td onClick={testClick}>
		//                 <span className="text-muted font-13">Tarifa: </span> <br />
		//                 <span>{<MoneyFormatter amount={dataVenta.tarifa}/>}</span>
		//             </td>
		//             <td>
		//             <OverlayTrigger
		//                 placement="top"
		//                 delay={{ show: 250, hide: 250 }}
		//                 overlay={renderTooltip}
		//                 >
		//                 <a style={{cursor: 'pointer', color: 'blue'}} onClick={modalOpenFirma} className="font-14 mt-1 fw-normal">{dataVenta.firmaCli?'Con firma':'Sin firma'}</a>
		//                 </OverlayTrigger>
		//                 <ModalFirma show={modalFirma} onHide={modalCloseFirma} dataFirma={dataVenta.firmaCli}/>
		//             </td>
		//             <td>
		//                 <span className="text-muted font-13">Contrato</span>
		//                     <h5 className='d-flex justify-content-center font-20' onClick={descargarPDFgenerado} style={{cursor: 'pointer'}}><i className='mdi mdi-file'></i></h5>
		//             </td>
		//             <td className="table-action" style={{ width: '90px' }}>
		//                 <Link onClick={deleteMembresia} className="action-icon">
		//                     <i className="mdi mdi-delete"></i>
		//                 </Link>
		//             </td>
		//         </tr>
		//     </tbody>
		// </Table>
	);
}
