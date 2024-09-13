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
			<div class="card">
                                <div class="card-header">
                                    <h4 class="header-title">RESUMEN <span class="fs-3">PROGRAMAS</span></h4>
                                </div>
                                <div class="card-body">
                                    <div class="row">
                                        {/* <div class="col-xl-9 col-lg-4 col-md-6 col-sm-12">
                                            <div class="row">
                                                <div class="col-lg-6">
                                                </div>
                                            </div>
                                        </div> */}
                                        
                                        <div class="col-sm-12">
                                            <div class="accordion" id="CardaccordionExample">
                                                <div class="mb-0">
                                                    <div id="CardheadingOne">
                                                        <h5 class="m-0">
                                                            <a class="d-block border border-light p-2 rounded mb-1 bg-success"
                                                                data-bs-toggle="collapse" href="#collapseOne"
                                                                aria-expanded="true" aria-controls="collapseOne">
                                                                <div class="d-flex justify-content-between align-items-center">
                                                                    <div>
                                                                        <p class="text-white fw-bold font-18 mb-1">INGRESOS DIRECTOS</p>
                                                                        <h3 class="text-white my-0"><MoneyFormatter amount={data.totalIngresosProgramas}/></h3>
                                                                    </div>  
                                                                    <div class="avatar-sm">
                                                                        <span class="avatar-title bg-success rounded-circle h3 my-0">
                                                                            <i class="mdi mdi-arrow-up-bold-outline"></i>
                                                                        </span>
                                                                    </div>                                      
                                                                </div>
                                                            </a>
                                                        </h5>
                                                    </div>
                                            
                                                    <div id="collapseOne" class="collapse show"
                                                        aria-labelledby="CardheadingOne" data-bs-parent="#CardaccordionExample">
                                                        <div class="card-body pt-0 px-1">
                                                            <ul class="list-group">
                                                                <li class="p-2 d-flex justify-content-between align-items-center">
                                                                    <img src={phChange} width={130} height={40} className='m-0'/>
                                                                    <span class="rounded-pill fw-bolder">S/.55,234.00</span>
                                                                </li>
                                                                <li class="p-2 d-flex justify-content-between align-items-center">
                                                                    <img src={phMuscle} width={120} height={40} className='m-0'/>
                                                                    <span class="rounded-pill fw-bolder">S/.10,028.00</span>
                                                                </li>
                                                                <li class="p-2 d-flex justify-content-between align-items-center">
                                                                    <img src={phFs45} width={70} height={40} className='m-0'/>
                                                                    <span class="rounded-pill fw-bolder">S/.29,281.00</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-0">
                                                    <div id="CardheadingTwo">
                                                        <h5 class="m-0">
                                                            <a class="d-block border border-light p-2 rounded mb-1 bg-danger"
                                                                data-bs-toggle="collapse" href="#collapseTwo"
                                                                aria-expanded="false" aria-controls="collapseTwo">
                                                                <div class="d-flex justify-content-between align-items-center">
                                                                    <div>
                                                                        <p class="font-18 text-white mb-1">EGRESOS DIRECTOS</p>
                                                                        <h3 class="text-white my-0">S/42,731.67</h3>
                                                                    </div>  
                                                                    <div class="avatar-sm">
                                                                        <span class="avatar-title bg-danger rounded-circle h3 my-0">
                                                                            <i class="mdi mdi-arrow-down-bold-outline"></i>
                                                                        </span>
                                                                    </div>                                      
                                                                </div>
                                                            </a>
                                                        </h5>
                                                    </div>
                                                    <div id="collapseTwo" class="collapse" aria-labelledby="CardheadingTwo"
                                                        data-bs-parent="#CardaccordionExample">
                                                        <div class="card-body pt-0">
                                                            <ul class="list-group">
                                                                <li class="p-2 d-flex justify-content-between align-items-center">
                                                                    IGV
                                                                    <span class="rounded-pill fw-bolder">113,234.00</span>
                                                                </li>
                                                                <li class="p-2 d-flex justify-content-between align-items-center">
                                                                    POS
                                                                    <span class="rounded-pill fw-bolder">7,132.58</span>
                                                                </li>
                                                                <li class="p-2 d-flex justify-content-between align-items-center">
                                                                    RENTA
                                                                    <span class="rounded-pill fw-bolder">5,085.58</span>
                                                                </li>
                                                                <li class="p-2 d-flex justify-content-between align-items-center">
                                                                    COMISIONES
                                                                    <span class="rounded-pill fw-bolder">0.00</span>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="mb-0">
                                                    <div id="CardheadingThree">
                                                        <h5 class="m-0">
                                                            <a class="d-block border border-light p-2 rounded bg-info"
                                                                data-bs-toggle="collapse" href="#collapseThree"
                                                                aria-expanded="false" aria-controls="collapseThree">
                                                                <div class="d-flex justify-content-between align-items-center">
                                                                    <div>
                                                                        <p class="font-18 text-white mb-1">UTILIDAD</p>
                                                                        <h3 class="text-white my-0">S/51,811.33</h3>
                                                                    </div>  
                                                                    <div class="avatar-sm">
                                                                        <span class="avatar-title bg-info rounded-circle h3 my-0">
                                                                            <i class="mdi mdi-chart-line"></i>
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
