import React, { useState } from 'react';
import { Collapse } from 'react-bootstrap';
import { MoneyFormatter } from '../CurrencyMask';

export const CardEstimado = ({ backgroundColor, title, montoSoles, items, icono }) => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<div
				className="m-1"
				onClick={() => setOpen(!open)}
				style={{cursor: 'pointer'}}
				aria-controls="example-collapse-text"
				aria-expanded={open}
			>
				<a
					className={`d-block border border-light p-1 rounded mb-1 ${backgroundColor}`}
				>
					<div className="d-flex justify-content-between align-items-center">
						<div>
							<p className="text-white fw-bold font-18 mb-1">{title}</p>
							<h3 className="text-white my-0">{montoSoles}</h3>
						</div>
						<div className="avatar-sm">
							<span
								className={`avatar-title ${backgroundColor} rounded-circle h3 my-0`}
							>
								<i className={icono}></i>
							</span>
						</div>
					</div>
				</a>
			</div>
			{

			<Collapse in={open}>
			<div id="example-collapse-text">
				<ul className="list-group">
				{
					items?.map(e=>(
						<>
                                                                <li className="p-2 d-flex justify-content-between align-items-center">
                                                                    {e.label}
                                                                    <span className="rounded-pill fw-bolder"><MoneyFormatter amount={e.monto}/></span>
                                                                </li>
						</>
					))
				}
				</ul>
			</div>
			</Collapse>
			}
			{
				// items.map(e=>(
				// 	<>
				// 	</>
				// ))
				//  && (
				// 	<div id="example-collapse-text">
				// <ul className="list-group">
                //                                                 <li className="p-2 d-flex justify-content-between align-items-center">
                //                                                     RPM 50 XTREME
                //                                                     <span className="rounded-pill fw-bolder">113,234.00</span>
                //                                                 </li>
                //                                                 <li className="p-2 d-flex justify-content-between align-items-center">
                //                                                     FUSION SAVAGE
                //                                                     <span className="rounded-pill fw-bolder">37,617.00</span>
                //                                                 </li>
                //                                                 <li className="p-2 d-flex justify-content-between align-items-center">
                //                                                     MUSCLE SOLID
                //                                                     <span className="rounded-pill fw-bolder">31,028.00</span>
                //                                                 </li>
                //                                                 <li className="p-2 d-flex justify-content-between align-items-center">
                //                                                     CHANGE YOUR LIFE
                //                                                     <span className="rounded-pill fw-bolder">18,154.00</span>
                //                                                 </li>
                //                                             </ul>
				// </div>
				// )
			}
		</>
	);
};
