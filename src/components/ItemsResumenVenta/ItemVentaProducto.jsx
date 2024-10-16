import {
	DateMask,
	FormatoDateMask,
	FormatoTimeMask,
	MoneyFormatter,
} from '@/components/CurrencyMask';
import React, { useState } from 'react';
import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ModalFirma } from './ModalFirma';
import { useSelector } from 'react-redux';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PdfContrato } from '../pdfs/PdfContrato';
import { useDispatch } from 'react-redux';
import { onDeleteAllPrograma } from '@/store/uiNuevaVenta/uiNuevaVenta';
import { useVentasStore } from '../../../hooks/hookApi/useVentasStore';

export const ItemVentaProducto = ({ dataVenta, detalle_cli_modelo }) => {
	console.log(dataVenta);
	const deleteMembresia = () => {
		dispatch(onDeleteAllPrograma());
	};
	return (
		<div className="container">
			<div className="row">
				<div className="col-lg-12 bg-white rounded shadow-sm mb-5">
					<div className="table-responsive">
						<table className="table">
							<thead>
								<tr>
									<th scope="col" className="border-0 bg-light p-1">
										<div className="p-0 px-3 text-uppercase">NOMBRE DEL PRODUCTO</div>
									</th>
									<th scope="col" className="border-0 bg-light p-1">
										<div className="py-0 text-uppercase">CANTIDAD</div>
									</th>
									<th scope="col" className="border-0 bg-light p-1">
										<div className="py-0 text-uppercase">TOTAL</div>
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
											{/* <img src="https://bootstrapious.com/i/snippets/sn-cart/product-1.jpg" alt="" width="70" className="img-fluid rounded shadow-sm"/> */}
											<div className="ml-3 d-inline-block align-middle">
												<h5 className="mb-0">
													{' '}
													<a
														href="#"
														className="text-dark d-inline-block align-middle"
													>
                                                        GUANTES - M
													</a>
												</h5>
											</div>
										</div>
									</th>
									<td className="border-0 align-middle">
										<strong>
                                            1
											{/* {<MoneyFormatter amount={dataVenta.tarifa} />} */}
										</strong>
									</td>
									<td className="border-0 align-middle">
										<strong>
											{<MoneyFormatter amount={dataVenta.tarifa} />}
										</strong>
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
		</div>
	);
};
