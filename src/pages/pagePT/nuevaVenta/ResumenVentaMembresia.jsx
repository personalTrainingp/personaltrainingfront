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

export const ResumenVentaMembresia = ({ dataVenta, detalle_cli_modelo }) => {
	console.log(dataVenta);
	const dispatch = useDispatch();
	const [modalFirma, setmodalFirma] = useState(false);
	const { obtenerPDFCONTRATOgenerado } = useVentasStore();
	const modalOpenFirma = () => {
		setmodalFirma(true);
	};
	const modalCloseFirma = () => {
		setmodalFirma(false);
	};
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
		obtenerPDFCONTRATOgenerado({ dataVenta });
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
										<div className="p-0 px-3 text-uppercase">PROGRAMA</div>
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
											{/* <img src="https://bootstrapious.com/i/snippets/sn-cart/product-1.jpg" alt="" width="70" className="img-fluid rounded shadow-sm"/> */}
											<div className="ml-3 d-inline-block align-middle">
												<h5 className="mb-0">
													{' '}
													<a
														href="#"
														className="text-dark d-inline-block align-middle"
													>
														{dataVenta.name_pgm} - {dataVenta.semanas}{' '}
														Semanas
													</a>
												</h5>
												<span className="text-muted font-weight-normal font-italic d-block">
													Inicia:{' '}
													{FormatoDateMask(
														dataVenta.fechaInicio_programa,
														'dddd D [de] MMMM [de] YYYY'
													)}{' '}
												</span>
												<span className="text-muted font-weight-normal font-italic d-block">
													Hora: {' '}
													<FormatoTimeMask
															date={dataVenta.time_h.trim()}
															format={'hh:mm A'}
														/>
												</span>
												<span className="text-muted font-weight-normal font-italic d-block">
													Finaliza:{' '}
													{FormatoDateMask(
														dataVenta.fechaFinal,
														'dddd D [de] MMMM [de] YYYY'
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
										<h5 className='fs-2' onClick={descargarPDFgenerado} style={{cursor: 'pointer'}}><i className='mdi mdi-file-document'></i></h5>
									</td>
									<td className="border-0 align-middle">
									<OverlayTrigger
										placement="top"
										delay={{ show: 250, hide: 250 }}
										overlay={renderTooltip}
										>
										<a style={{cursor: 'pointer', color: 'blue'}} onClick={modalOpenFirma} className="font-14 mt-1 fw-normal">{dataVenta.firmaCli?'Con firma':'Sin firma'}</a>
										</OverlayTrigger>
										<ModalFirma show={modalFirma} onHide={modalCloseFirma} dataFirma={dataVenta.firmaCli}/>
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
		//                 <span className="text-muted font-13">Inicia: {FormatoDateMask(dataVenta.fechaInicio_programa, 'D [de] MMMM [de] YYYY')} a las {dataVenta.time_h} </span>
		//                 <br/>
		//                 <span className="text-muted font-13">Finaliza: {FormatoDateMask(dataVenta.fechaFinal, 'D [de] MMMM [de] YYYY')} </span>
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
};

/*
<div className="container">
      <div className="row">
        <div className="col-lg-12 p-5 bg-white rounded shadow-sm mb-5">

          <!-- Shopping cart table -->
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th scope="col" className="border-0 bg-light">
                    <div className="p-2 px-3 text-uppercase">Product</div>
                  </th>
                  <th scope="col" className="border-0 bg-light">
                    <div className="py-2 text-uppercase">Price</div>
                  </th>
                  <th scope="col" className="border-0 bg-light">
                    <div className="py-2 text-uppercase">Quantity</div>
                  </th>
                  <th scope="col" className="border-0 bg-light">
                    <div className="py-2 text-uppercase">Remove</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row" className="border-0">
                    <div className="p-2">
                      <img src="https://bootstrapious.com/i/snippets/sn-cart/product-1.jpg" alt="" width="70" className="img-fluid rounded shadow-sm">
                      <div className="ml-3 d-inline-block align-middle">
                        <h5 className="mb-0"> <a href="#" className="text-dark d-inline-block align-middle">Timex Unisex Originals</a></h5><span className="text-muted font-weight-normal font-italic d-block">Category: Watches</span>
                      </div>
                    </div>
                  </th>
                  <td className="border-0 align-middle"><strong>$79.00</strong></td>
                  <td className="border-0 align-middle"><strong>3</strong></td>
                  <td className="border-0 align-middle"><a href="#" className="text-dark"><i className="fa fa-trash"></i></a></td>
                </tr>
                <tr>
                  <th scope="row">
                    <div className="p-2">
                      <img src="https://bootstrapious.com/i/snippets/sn-cart/product-2.jpg" alt="" width="70" className="img-fluid rounded shadow-sm">
                      <div className="ml-3 d-inline-block align-middle">
                        <h5 className="mb-0"><a href="#" className="text-dark d-inline-block">Lumix camera lense</a></h5><span className="text-muted font-weight-normal font-italic">Category: Electronics</span>
                      </div>
                    </div>
                  </th>
                  <td className="align-middle"><strong>$79.00</strong></td>
                  <td className="align-middle"><strong>3</strong></td>
                  <td className="align-middle"><a href="#" className="text-dark"><i className="fa fa-trash"></i></a>
                  </td>
                </tr>
                <tr>
                  <th scope="row">
                    <div className="p-2">
                      <img src="https://bootstrapious.com/i/snippets/sn-cart/product-3.jpg" alt="" width="70" className="img-fluid rounded shadow-sm">
                      <div className="ml-3 d-inline-block align-middle">
                        <h5 className="mb-0"> <a href="#" className="text-dark d-inline-block">Gray Nike running shoe</a></h5><span className="text-muted font-weight-normal font-italic">Category: Fashion</span>
                      </div>
                    </div>
                    <td className="align-middle"><strong>$79.00</strong></td>
                    <td className="align-middle"><strong>3</strong></td>
                    <td className="align-middle"><a href="#" className="text-dark"><i className="fa fa-trash"></i></a>
                    </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- End -->
        </div>
      </div>

    </div>
*/
