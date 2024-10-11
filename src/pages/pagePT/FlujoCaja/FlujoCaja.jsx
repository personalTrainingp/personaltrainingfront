import { PageBreadcrumb } from '@/components';
import { MoneyFormatter } from '@/components/CurrencyMask';
import { useFlujoCajaStore } from '@/hooks/hookApi/FlujoCajaStore/useFlujoCajaStore';
import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Table } from 'react-bootstrap';

export const FlujoCaja = () => {
	const { dataIngresos_FC: DATAingresosENERO, obtenerIngresosxMes: obtenerIngresosENERO } =
			useFlujoCajaStore(),
		{ dataIngresos_FC: DATAingresosFEBRERO, obtenerIngresosxMes: obtenerIngresosFEBRERO } =
			useFlujoCajaStore(),
		{ dataIngresos_FC: DATAingresosMARZO, obtenerIngresosxMes: obtenerIngresosMARZO } =
			useFlujoCajaStore(),
		{ dataIngresos_FC: DATAingresosABRIL, obtenerIngresosxMes: obtenerIngresosABRIL } =
			useFlujoCajaStore(),
		{ dataIngresos_FC: DATAingresosMAYO, obtenerIngresosxMes: obtenerIngresosMAYO } =
			useFlujoCajaStore(),
		{ dataIngresos_FC: DATAingresosJUNIO, obtenerIngresosxMes: obtenerIngresosJUNIO } =
			useFlujoCajaStore(),
		{ dataIngresos_FC: DATAingresosJULIO, obtenerIngresosxMes: obtenerIngresosJULIO } =
			useFlujoCajaStore(),
		{ dataIngresos_FC: DATAingresosAGOSTO, obtenerIngresosxMes: obtenerIngresosAGOSTO } =
			useFlujoCajaStore(),
		{
			dataIngresos_FC: DATAingresosSEPTIEMBRE,
			obtenerIngresosxMes: obtenerIngresosSEPTIEMBRE,
		} = useFlujoCajaStore(),
		{ dataIngresos_FC: DATAingresosOCTUBRE, obtenerIngresosxMes: obtenerIngresosOCTUBRE } =
			useFlujoCajaStore(),
		{ dataIngresos_FC: DATAingresosNOVIEMBRE, obtenerIngresosxMes: obtenerIngresosNOVIEMBRE } =
			useFlujoCajaStore(),
		{ dataIngresos_FC: DATAingresosDICIEMBRE, obtenerIngresosxMes: obtenerIngresosDICIEMBRE } =
			useFlujoCajaStore();
	const [objIngresoxMES, setobjIngresoxMES] = useState({
		enero: 0,
		febrero: 0,
		marzo: 0,
		abril: 0,
		mayo: 0,
		junio: 0,
		julio: 0,
		agosto: 0,
		septiembre: 0,
		octubre: 0,
		noviembre: 0,
		diciembre: 0,
	});
	useEffect(() => {
		obtenerIngresosENERO(1, 2024);
		obtenerIngresosFEBRERO(2, 2024);
		obtenerIngresosMARZO(3, 2024);
		obtenerIngresosABRIL(4, 2024);
		obtenerIngresosMAYO(5, 2024);
		obtenerIngresosJUNIO(6, 2024);
		obtenerIngresosJULIO(7, 2024);
		obtenerIngresosAGOSTO(8, 2024);
		obtenerIngresosSEPTIEMBRE(9, 2024);
		obtenerIngresosOCTUBRE(10, 2024);
		obtenerIngresosNOVIEMBRE(11, 2024);
		obtenerIngresosDICIEMBRE(12, 2024);
		// const febrero = obtenerIngresosxMes(2, 2024)
	}, []);

	const obtenerTotalIngresosxxMes = (mes) => {
		switch (mes) {
			case 1:
				return DATAingresosENERO;
			case 2:
				return DATAingresosFEBRERO;
			case 3:
				return DATAingresosMARZO;
			case 4:
				return DATAingresosABRIL;
			case 5:
				return DATAingresosMAYO;
			case 6:
				return DATAingresosJUNIO;
			case 7:
				return DATAingresosJULIO;
			case 8:
				return DATAingresosAGOSTO;
			case 9:
				return DATAingresosSEPTIEMBRE;
			case 10:
				return DATAingresosOCTUBRE;
			case 11:
				return DATAingresosNOVIEMBRE;
			case 12:
				return DATAingresosDICIEMBRE;
                case 'T':
                    return {
                        programa_MONTO: 
                            DATAingresosENERO.programa_MONTO+
                            DATAingresosFEBRERO.programa_MONTO+
                            DATAingresosMARZO.programa_MONTO+
                            DATAingresosABRIL.programa_MONTO+
                            DATAingresosMAYO.programa_MONTO+
                            DATAingresosJUNIO.programa_MONTO+
                            DATAingresosJULIO.programa_MONTO+
                            DATAingresosAGOSTO.programa_MONTO+
                            DATAingresosSEPTIEMBRE.programa_MONTO+
                            DATAingresosOCTUBRE.programa_MONTO+
                            DATAingresosNOVIEMBRE.programa_MONTO+
                            DATAingresosDICIEMBRE.programa_MONTO,
                            
                        producto18_MONTO: 
                            DATAingresosENERO.producto18_MONTO+
                            DATAingresosFEBRERO.producto18_MONTO+
                            DATAingresosMARZO.producto18_MONTO+
                            DATAingresosABRIL.producto18_MONTO+
                            DATAingresosMAYO.producto18_MONTO+
                            DATAingresosJUNIO.producto18_MONTO+
                            DATAingresosJULIO.producto18_MONTO+
                            DATAingresosAGOSTO.producto18_MONTO+
                            DATAingresosSEPTIEMBRE.producto18_MONTO+
                            DATAingresosOCTUBRE.producto18_MONTO+
                            DATAingresosNOVIEMBRE.producto18_MONTO+
                            DATAingresosDICIEMBRE.producto18_MONTO,
                        producto17_MONTO: 
                            DATAingresosENERO.producto17_MONTO+
                            DATAingresosFEBRERO.producto17_MONTO+
                            DATAingresosMARZO.producto17_MONTO+
                            DATAingresosABRIL.producto17_MONTO+
                            DATAingresosMAYO.producto17_MONTO+
                            DATAingresosJUNIO.producto17_MONTO+
                            DATAingresosJULIO.producto17_MONTO+
                            DATAingresosAGOSTO.producto17_MONTO+
                            DATAingresosSEPTIEMBRE.producto17_MONTO+
                            DATAingresosOCTUBRE.producto17_MONTO+
                            DATAingresosNOVIEMBRE.producto17_MONTO+
                            DATAingresosDICIEMBRE.producto17_MONTO,
                            citasNutri_MONTO: 
                                DATAingresosENERO.citasNutri_MONTO+
                                DATAingresosFEBRERO.citasNutri_MONTO+
                                DATAingresosMARZO.citasNutri_MONTO+
                                DATAingresosABRIL.citasNutri_MONTO+
                                DATAingresosMAYO.citasNutri_MONTO+
                                DATAingresosJUNIO.citasNutri_MONTO+
                                DATAingresosJULIO.citasNutri_MONTO+
                                DATAingresosAGOSTO.citasNutri_MONTO+
                                DATAingresosSEPTIEMBRE.citasNutri_MONTO+
                                DATAingresosOCTUBRE.citasNutri_MONTO+
                                DATAingresosNOVIEMBRE.citasNutri_MONTO+
                                DATAingresosDICIEMBRE.citasNutri_MONTO,
                                citasFito_MONTO: 
                                    DATAingresosENERO.citasFito_MONTO+
                                    DATAingresosFEBRERO.citasFito_MONTO+
                                    DATAingresosMARZO.citasFito_MONTO+
                                    DATAingresosABRIL.citasFito_MONTO+
                                    DATAingresosMAYO.citasFito_MONTO+
                                    DATAingresosJUNIO.citasFito_MONTO+
                                    DATAingresosJULIO.citasFito_MONTO+
                                    DATAingresosAGOSTO.citasFito_MONTO+
                                    DATAingresosSEPTIEMBRE.citasFito_MONTO+
                                    DATAingresosOCTUBRE.citasFito_MONTO+
                                    DATAingresosNOVIEMBRE.citasFito_MONTO+
                                    DATAingresosDICIEMBRE.citasFito_MONTO
                    };
			default:
				return {
					citasFito_MONTO: 0,
					citasNutri_MONTO: 0,
					producto17_MONTO: 0,
					producto18_MONTO: 0,
					programa_MONTO: 0,
				};
		}
	};

	return (
		<>
			<PageBreadcrumb subName={'T'} title={'Flujo de Caja'} />
			<Row>
				<Col xxl={12}>
					<h4 className="text-center">INGRESOS</h4>
					<Card>
						<Table
							// style={{tableLayout: 'fixed'}}
							className="table-centered mb-0"
							hover
							responsive
						>
							<thead className="bg-primary">
								<tr>
									<th>
										<div style={{ maxWidth: '10px' }}></div>
									</th>
									<th className='text-white'>ENERO</th>
									<th className='text-white'>FEBRERO</th>
									<th className='text-white'>MARZO</th>
									<th className='text-white'>ABRIL</th>
									<th className='text-white'>MAYO</th>
									<th className='text-white'>JUNIO</th>
									<th className='text-white'>JULIO</th>
									<th className='text-white'>AGOSTO</th>
									<th className='text-white'>SEPTIEMBRE</th>
									<th className='text-white'>OCTUBRE</th>
									<th className='text-white'>NOVIEMBRE</th>
									<th className='text-white'>DICIEMBRE</th>
									<th className='text-white'>TOTAL</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>PROGRAMAS</td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(1).programa_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(2).programa_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(3).programa_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(4).programa_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(5).programa_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(6).programa_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(7).programa_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(8).programa_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(9).programa_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(10).programa_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(11).programa_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(12).programa_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes('T').programa_MONTO} symbol={'S/.'}/></td>
								</tr>
                                <tr>
									<td>ACCESORIOS</td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(1).producto17_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(2).producto17_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(3).producto17_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(4).producto17_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(5).producto17_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(6).producto17_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(7).producto17_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(8).producto17_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(9).producto17_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(10).producto17_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(11).producto17_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(12).producto17_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes('T').producto17_MONTO} symbol={'S/.'}/></td>
								</tr>
                                <tr>
									<td>SUPLEMENTOS</td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(1).producto18_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(2).producto18_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(3).producto18_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(4).producto18_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(5).producto18_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(6).producto18_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(7).producto18_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(8).producto18_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(9).producto18_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(10).producto18_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(11).producto18_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(12).producto18_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes('T').producto18_MONTO} symbol={'S/.'}/></td>
								</tr>
                                <tr>
									<td>TRATAMIENTOS ESTETICOS</td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(1).citasFito_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(2).citasFito_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(3).citasFito_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(4).citasFito_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(5).citasFito_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(6).citasFito_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(7).citasFito_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(8).citasFito_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(9).citasFito_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(10).citasFito_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(11).citasFito_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes(12).citasFito_MONTO} symbol={'S/.'}/></td>
									<td><MoneyFormatter amount={obtenerTotalIngresosxxMes('T').citasFito_MONTO} symbol={'S/.'}/></td>
								</tr>
							</tbody>
						</Table>
					</Card>
					<h4 className="text-center">APORTES</h4>
					<Card></Card>
					<h4 className="text-center">EGRESOS</h4>
					<Card></Card>
					<h4 className="text-center">CREDITO FISCAL</h4>
					<Card></Card>
				</Col>
			</Row>
		</>
	);
};
