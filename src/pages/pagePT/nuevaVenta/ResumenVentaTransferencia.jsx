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
import { onDeleteAllPrograma } from '@/store/uiNuevaVenta/uiNuevaVenta';
import { useVentasStore } from '../../../hooks/hookApi/useVentasStore';
import dayjs from 'dayjs';
import config from '@/config';

export const ResumenVentaTransferencia = ({ dataVenta, detalle_cli_modelo, dataPagos }) => {
	const dispatch = useDispatch();
	const [modalFirma, setmodalFirma] = useState(false);
	const { obtenerPDFCONTRATOgenerado } = useVentasStore();
	const modalOpenFirma = () => {
		setmodalFirma(true);
	};
	const modalCloseFirma = () => {
		setmodalFirma(false);
	};
	console.log(dataVenta);
	
	const renderTooltip = (props) => (
		<Tooltip id="button-tooltip" className="tooltip-firma" {...props}>
			<img src={dataVenta.firmaCli} width={100} height={50} />
		</Tooltip>
	);
	const deleteMembresia = () => {
		dispatch(onDeleteAllPrograma());
	};
	const testClick = () => {
		console.log('hace click');
	};
	const descargarPDFgenerado = () => {
		obtenerPDFCONTRATOgenerado({ dataVenta, detalle_cli_modelo, dataPagos });
	};
	return (
		<div className="container">
			<li className="mb-4 cursor-pointer border-bottom-3 hover-li p-2">
          <h3 className='text-muted align-items-center d-flex'>
				{dataVenta[0].label_pgm} - {dataVenta[0].sesiones_disponibles} SESIONES
          </h3>
          <p className="text-muted mb-1 font-16 font-bold">
          <br/>
          <i className="mdi mdi-calendar me-1"></i> INICIA: {dataVenta[0].fec_init_mem}
          <br/>
          <i className="mdi mdi-calendar me-1"></i> TERMINA: {dataVenta[0].fec_fin_mem}
          <br/>
          <i className="mdi mdi-calendar me-1"></i> HORA: {dataVenta[0].label_horario}
          <br/>
          <i className="mdi mdi-calendar me-1"></i> CLIENTE ANTIGUO: {dataVenta[0].label_cliente_antiguo}
          <br/>
          <i className="mdi mdi-calendar me-1"></i> MONTO: 0.00
          <br/>
          <div>
          </div>
          </p>
      </li>
			{/* 
			<div className="row">
				<h5 className="mb-0">
					<a
						href="#"
						className="d-flex flex-column align-items-start text-primary d-inline-block align-middle p-2 mb-2 font-22 rounded rounded-4 shadow shadow-8"
					>
						<img width={220} src={`${config.API_IMG.LOGO}${dataVenta.url_image}`} />
						{dataVenta.semanas} Semanas = {dataVenta.semanas * 5} sesiones
					</a>
				</h5>
				<div className="col-lg-12 bg-white rounded shadow-sm mb-5">
					<div className="table-responsive">
						<table className="table">
							<thead>
								<tr>
									<th scope="col" className="border-0 bg-light p-1">
									</th>
									<th scope="col" className="border-0 bg-light p-1">
										<div className="py-0 text-uppercase">PRECIO</div>
									</th>
									<th scope="col" className="border-0 bg-light p-1">
										<div className="py-0 text-uppercase">CONTRATO</div>
									</th>
									<th scope="col" className="border-0 bg-light p-1">
										<div className="py-0 text-uppercase">FIRMA</div>
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
									<td className="border-0 align-middle">
										<h5
											className="fs-2"
											onClick={descargarPDFgenerado}
											style={{ cursor: 'pointer' }}
										>
											<i className="mdi mdi-file-document"></i>
										</h5>
									</td>
									<td className="border-0 align-middle">
										<OverlayTrigger
											placement="top"
											delay={{ show: 250, hide: 250 }}
											overlay={renderTooltip}
										>
											<a
												style={{ cursor: 'pointer', color: 'blue' }}
												onClick={modalOpenFirma}
												className="font-14 mt-1 fw-normal"
											>
												{dataVenta.firmaCli ? 'Con firma' : 'Sin firma'}
											</a>
										</OverlayTrigger>
										<ModalFirma
											show={modalFirma}
											onHide={modalCloseFirma}
											dataFirma={dataVenta.firmaCli}
										/>
									</td>
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
			*/}
		</div>
	);
};
