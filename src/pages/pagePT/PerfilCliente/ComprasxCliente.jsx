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
// import { ProductService } from './service/ProductService';

export const ComprasxCliente = ({uid, dataVenta}) => {
    const [products, setProducts] = useState(dataVenta);

    console.log(dataVenta);

    const itemTemplate = (product, index) => {
        return (
            <Table responsive hover className="table-centered table-nowrap mb-0">
					<tbody>
						<tr>
							<td>
								<h5 className="font-14 my-1">
									<Link to="" className="text-body">
                                        BFR BODY FAT REMOVAL
									</Link>
								</h5>
								<span className="text-muted font-13">TIPO: SUPLEMENTOS</span>
							</td>
							<td>
								<span className="text-muted font-13">CANTIDAD</span> <br />
								<span className="font-14 mt-1 fw-normal">2</span>
							</td>
							<td>
                                <span className="text-muted font-13">MONTO</span> <br />
                                <span className="font-14 mt-1 fw-normal">S/ 1600.00</span>
							</td>
						</tr>
					</tbody>
				</Table>
        );
    };

    const listTemplate = (items) => {
        if (!items || items.length === 0) return null;

        let list = items.map((product, index) => {
            return itemTemplate(product, index);
        });

        return <div className="grid grid-nogutter">{list}</div>;
    };

    return (
		<>
				<Accordion>
					{
						dataVenta.map(e=>{
							console.log(e);
							return (
								<AccordionTab header={`Boleta ${e.id}`} key={e.id}>
									<p className="m-0">
										Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
										Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
										consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
										Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
									</p>
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
