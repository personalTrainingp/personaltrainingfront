import React from 'react';
import { Card, CardTitle, Col, Row } from 'react-bootstrap';
import Chart from 'react-apexcharts';
import { CardEstimado } from '@/components/CardTab/CardEstimado';
import { MoneyFormatter } from '@/components/CurrencyMask';
import phChange from '@/assets/images/brand-change/change-avatar.png'
import phFs45 from '@/assets/images/brand-change/fs-avatar.png'
import phMuscle from '@/assets/images/brand-change/muscle-avatar.png'

export const ResumenUtilidadesProgramas = ({ data }) => {
  
	// const apexOpts = {
	// 	chart: {
	// 		id: 'area-datetime',
	// 		type: 'area',
	// 		height: 350,
	// 		zoom: {
	// 			autoScaleYaxis: true,
	// 		},
	// 	},
	// 	// annotations: {
	// 	//   yaxis: [{
	// 	//     y: 30,
	// 	//     borderColor: '#999',
	// 	//     label: {
	// 	//       show: true,
	// 	//       text: 'Support',
	// 	//       style: {
	// 	//         color: "#fff",
	// 	//         background: '#00E396',
	// 	//       },
	// 	//     },
	// 	//   }],
	// 	//   xaxis: [{
	// 	//     x: new Date('14 Nov 2012').getTime(),
	// 	//     borderColor: '#999',
	// 	//     yAxisIndex: 0,
	// 	//     label: {
	// 	//       show: true,
	// 	//       text: 'Rally',
	// 	//       style: {
	// 	//         color: "#fff",
	// 	//         background: '#775DD0',
	// 	//       },
	// 	//     },
	// 	//   }],
	// 	// },
	// 	dataLabels: {
	// 		enabled: false,
	// 	},
	// 	markers: {
	// 		size: 0,
	// 		style: 'hollow',
	// 	},
	// 	xaxis: {
	// 		type: 'datetime',
	// 		min: new Date('01 Mar 2012').getTime(),
	// 		tickAmount: 6,
	// 	},
	// 	tooltip: {
	// 		x: {
	// 			format: 'dd MMM yyyy',
	// 		},
	// 	},
	// 	fill: {
	// 		type: 'gradient',
	// 		gradient: {
	// 			shadeIntensity: 1,
	// 			opacityFrom: 0.2,
	// 			opacityTo: 0.6,
	// 			stops: [0, 100],
	// 			colorStops: [
	// 				{
	// 					offset: 0,
	// 					color: '#00FF00',
	// 					opacity: 0.1,
	// 				},
	// 				{
	// 					offset: 100,
	// 					color: '#00FF00',
	// 					opacity: 0.4,
	// 				},
	// 			],
	// 		},
	// 	},
	// 	stroke: {
	// 		curve: 'smooth',
	// 		width: 3, // Ajuste del grosor de la línea
	// 		colors: ['#48EB3D'], // Verde oscuro
	// 	},
	// };

	// const series = [
	// 	{
	// 		name: 'Variable',
	// 		data: [
	// 			[1327359600000, 30.95],
	// 			[1327446000000, 31.34],
	// 			[1327532400000, 31.18],
	// 			[1327618800000, 31.05],
	// 			[1327878000000, 31.0],
	// 			[1327964400000, 30.95],
	// 			[1328050800000, 31.24],
	// 			[1328137200000, 31.29],
	// 			[1328223600000, 31.85],
	// 			[1328482800000, 31.86],
	// 			[1328569200000, 32.28],
	// 			[1328655600000, 32.1],
	// 			[1328742000000, 32.65],
	// 			[1328828400000, 32.21],
	// 			[1329087600000, 32.35],
	// 			[1329174000000, 32.44],
	// 			[1329260400000, 32.46],
	// 			[1329346800000, 32.86],
	// 			[1329433200000, 32.75],
	// 			[1329778800000, 32.54],
	// 			[1329865200000, 32.33],
	// 			[1329951600000, 32.97],
	// 			[1330038000000, 33.41],
	// 			[1330297200000, 33.27],
	// 			[1330383600000, 33.27],
	// 			[1330470000000, 32.89],
	// 			[1330556400000, 33.1],
	// 			[1330642800000, 33.73],
	// 		],
	// 	},
	// ];

	return (
			<div className="card">
                                <div className="card-header">
                                    <h4 className="header-title">RESUMEN <span className="fs-3">PROGRAMAS</span></h4>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        {/* <div className="col-xl-9 col-lg-4 col-md-6 col-sm-12">
                                            <div className="row">
                                                <div className="col-lg-6">
                                                </div>
                                            </div>
                                        </div> */}
                                        
                                        <div className="col-sm-12">
                                            <div className="accordion" id="CardaccordionExample">
                                                <div className="mb-0">
                                                    <div id="CardheadingOne">
                                                        <h5 className="m-0">
                                                            <a className="d-block border border-light p-2 rounded mb-1 bg-success"
                                                                data-bs-toggle="collapse" href="#collapseOne"
                                                                aria-expanded="true" aria-controls="collapseOne">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div>
                                                                        <p className="text-white fw-bold font-18 mb-1">INGRESOS DIRECTOS</p>
                                                                        <h3 className="text-white my-0"><MoneyFormatter amount={data.totalIngresosProgramas}/></h3>
                                                                    </div>  
                                                                    <div className="avatar-sm">
                                                                        <span className="avatar-title bg-success rounded-circle h3 my-0">
                                                                            <i className="mdi mdi-arrow-up-bold-outline"></i>
                                                                        </span>
                                                                    </div>                                      
                                                                </div>
                                                            </a>
                                                        </h5>
                                                    </div>
                                            
                                                    <div id="collapseOne" className="collapse show"
                                                        aria-labelledby="CardheadingOne" data-bs-parent="#CardaccordionExample">
                                                        <div className="card-body pt-0 px-1">
                                                            <ul className="list-group">
                                                                <li className="p-2 d-flex justify-content-between align-items-center">
                                                                    <img src={phChange} width={130} height={40} className='m-0'/>
                                                                    <span className="rounded-pill fw-bolder">S/.55,234.00</span>
                                                                </li>
                                                                <li className="p-2 d-flex justify-content-between align-items-center">
                                                                    <img src={phMuscle} width={120} height={40} className='m-0'/>
                                                                    <span className="rounded-pill fw-bolder">S/.10,028.00</span>
                                                                </li>
                                                                <li className="p-2 d-flex justify-content-between align-items-center">
                                                                    <img src={phFs45} width={70} height={40} className='m-0'/>
                                                                    <span className="rounded-pill fw-bolder">S/.29,281.00</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-0">
                                                    <div id="CardheadingTwo">
                                                        <h5 className="m-0">
                                                            <a className="d-block border border-light p-2 rounded mb-1 bg-danger"
                                                                data-bs-toggle="collapse" href="#collapseTwo"
                                                                aria-expanded="false" aria-controls="collapseTwo">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div>
                                                                        <p className="font-18 text-white mb-1">EGRESOS DIRECTOS</p>
                                                                        <h3 className="text-white my-0">S/42,731.67</h3>
                                                                    </div>  
                                                                    <div className="avatar-sm">
                                                                        <span className="avatar-title bg-danger rounded-circle h3 my-0">
                                                                            <i className="mdi mdi-arrow-down-bold-outline"></i>
                                                                        </span>
                                                                    </div>                                      
                                                                </div>
                                                            </a>
                                                        </h5>
                                                    </div>
                                                    <div id="collapseTwo" className="collapse" aria-labelledby="CardheadingTwo"
                                                        data-bs-parent="#CardaccordionExample">
                                                        <div className="card-body pt-0">
                                                            <ul className="list-group">
                                                                <li className="p-2 d-flex justify-content-between align-items-center">
                                                                    IGV
                                                                    <span className="rounded-pill fw-bolder">113,234.00</span>
                                                                </li>
                                                                <li className="p-2 d-flex justify-content-between align-items-center">
                                                                    POS
                                                                    <span className="rounded-pill fw-bolder">7,132.58</span>
                                                                </li>
                                                                <li className="p-2 d-flex justify-content-between align-items-center">
                                                                    RENTA
                                                                    <span className="rounded-pill fw-bolder">5,085.58</span>
                                                                </li>
                                                                <li className="p-2 d-flex justify-content-between align-items-center">
                                                                    COMISIONES
                                                                    <span className="rounded-pill fw-bolder">0.00</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mb-0">
                                                    <div id="CardheadingThree">
                                                        <h5 className="m-0">
                                                            <a className="d-block border border-light p-2 rounded bg-info"
                                                                data-bs-toggle="collapse" href="#collapseThree"
                                                                aria-expanded="false" aria-controls="collapseThree">
                                                                <div className="d-flex justify-content-between align-items-center">
                                                                    <div>
                                                                        <p className="font-18 text-white mb-1">UTILIDAD</p>
                                                                        <h3 className="text-white my-0">S/51,811.33</h3>
                                                                    </div>  
                                                                    <div className="avatar-sm">
                                                                        <span className="avatar-title bg-info rounded-circle h3 my-0">
                                                                            <i className="mdi mdi-chart-line"></i>
                                                                        </span>
                                                                    </div>                                      
                                                                </div>
                                                            </a>
                                                        </h5>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
	);
};
