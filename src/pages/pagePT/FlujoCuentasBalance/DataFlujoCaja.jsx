import React, { useState, useEffect } from 'react'
import { MoneyFormatter, NumberFormatMoney } from '@/components/CurrencyMask';
import { useFlujoCajaStore } from '@/hooks/hookApi/FlujoCajaStore/useFlujoCajaStore';
import { Card, Col, Row, Table } from 'react-bootstrap';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { ModalDetallexCelda } from './ModalDetallexCelda';

export const DataFlujoCaja = ({id_enterprice}) => {
    const [dataModal, setdataModal] = useState({})
    const [isOpenModalDetallexCelda, setisOpenModalDetallexCelda] = useState(false)
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
            const { obtenerGastosxANIO, dataGastosxANIO } = useFlujoCajaStore()
            const { dataCreditoFiscal, obtenerCreditoFiscalxANIO } = useFlujoCajaStore()
    
	useEffect(() => {
		obtenerIngresosENERO(1, 2025);
		obtenerIngresosFEBRERO(2, 2025);
		obtenerIngresosMARZO(3, 2025);
		obtenerIngresosABRIL(4, 2025);
		obtenerIngresosMAYO(5, 2025);
		obtenerIngresosJUNIO(6, 2025);
		obtenerIngresosJULIO(7, 2025);
		obtenerIngresosAGOSTO(8, 2025);
		obtenerIngresosSEPTIEMBRE(9, 2025);
		obtenerIngresosOCTUBRE(10, 2025);
		obtenerIngresosNOVIEMBRE(11, 2025);
		obtenerIngresosDICIEMBRE(12, 2025);
        obtenerCreditoFiscalxANIO(2025, id_enterprice);
		// const febrero = obtenerIngresosxMes(2, 2025)
        obtenerGastosxANIO(2025, id_enterprice);
	}, []);
    const onOpenModalDetallexCelda = (data)=>{
        setisOpenModalDetallexCelda(true)        
        setdataModal(data)
    }
    const onCloseModalDetallexCelda = ()=>{
        setisOpenModalDetallexCelda(false)
        setdataModal([])
    }
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
    // Función para sumar los monto_total por cada mes
function sumarMontosPorMes(datos, grupo) {
    const mesesSuma = [];
  
    // Inicializamos el arreglo de meses con los valores en cero
    for (let i = 1; i <= 12; i++) {
      mesesSuma.push({ mes: i, monto_total: 0 });
    }
  
    // Recorremos cada concepto y sumamos los montos por mes
    datos.forEach(concepto => {
      concepto.items.forEach(item => {
        const mesIndex = item.mes - 1; // Los índices de los meses van de 0 a 11
        mesesSuma[mesIndex].monto_total += item.monto_total;
      });
    });
  
    return { grupo, meses: mesesSuma };
  }
  function sumarIngresosXmes(mes) {
    return obtenerTotalIngresosxxMes(mes).programa_MONTO+obtenerTotalIngresosxxMes(mes).producto17_MONTO+obtenerTotalIngresosxxMes(mes).producto18_MONTO+obtenerTotalIngresosxxMes(mes).citasFito_MONTO+obtenerTotalIngresosxxMes(mes).citasNutri_MONTO
  }
  function creditoFiscalAcumulado(len, acumulado) {
    return dataCreditoFiscal.ventas[len]?.igv -(dataCreditoFiscal.facturas[len]?.igv + acumulado)
  }
  function calcularCreditoFiscal(facturas, ventas, initAcumulado) {
    let acumulado = initAcumulado; // Inicializar con el acumulado proporcionado para el primer mes
    const resultado = [];
  
    // Iterar sobre los meses y años
    for (let i = 0; i < ventas.length; i++) {
      const { mes, igv: igvVentas, anio: anioVentas } = ventas[i];
      const factura = facturas.find(f => f.mes === mes && f.anio === anioVentas);
      const igvFacturas = factura ? factura.igv : 0;
  
      // Calcular el crédito fiscal (creFisc) usando el acumulado actual
      const creFisc = igvVentas - igvFacturas - acumulado;
  
      // Agregar al resultado
      resultado.push({
        mes,
        anio: anioVentas,
        creFisc,
        acumulado
      });
  
      // El acumulado para el siguiente mes es el creFisc del mes actual
      acumulado = creFisc;
    }
  
    return resultado;
  }
  
  return (
    <>
    <Row>
        <Col xxl={12}>
            <h4 className="text-center h2">INGRESOS</h4>
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
                            <th className='text-white text-center p-1'>ENERO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>FEBRERO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>MARZO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>ABRIL <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>MAYO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>JUNIO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>JULIO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>AGOSTO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>SEPTIEMBRE <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>OCTUBRE <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>NOVIEMBRE <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>DICIEMBRE <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>TOTAL <span className='w-100 float-end'></span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>PROGRAMAS</td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(1).programa_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(2).programa_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(3).programa_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(4).programa_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(5).programa_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(6).programa_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(7).programa_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(8).programa_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(9).programa_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(10).programa_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(11).programa_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(12).programa_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes('T').programa_MONTO} symbol={'S/.'}/></td>
                        </tr>
                        <tr>
                            <td>ACCESORIOS</td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(1).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(2).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(3).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(4).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(5).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(6).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(7).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(8).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(9).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(10).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(11).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(12).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes('T').producto17_MONTO} symbol={'S/.'}/></td>
                        </tr>
                        <tr>
                            <td>SUPLEMENTOS</td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(1).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(2).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(3).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(4).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(5).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(6).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(7).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(8).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(9).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(10).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(11).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(12).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes('T').producto18_MONTO} symbol={'S/.'}/></td>
                        </tr>
                        <tr>
                            <td>TRATAMIENTOS ESTETICOS</td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(1).citasFito_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(2).citasFito_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(3).citasFito_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(4).citasFito_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(5).citasFito_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(6).citasFito_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(7).citasFito_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(8).citasFito_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(9).citasFito_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(10).citasFito_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(11).citasFito_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(12).citasFito_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes('T').citasFito_MONTO} symbol={'S/.'}/></td>
                        </tr>
                        <tr>
                            <td>TOTAL</td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(1)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(2)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(3)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(4)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(5)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(6)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(7)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(8)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(9)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(10)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(11)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(12)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={
sumarIngresosXmes(1)+
sumarIngresosXmes(2)+
sumarIngresosXmes(3)+
sumarIngresosXmes(4)+
sumarIngresosXmes(5)+
sumarIngresosXmes(6)+
sumarIngresosXmes(7)+
sumarIngresosXmes(8)+
sumarIngresosXmes(9)+
sumarIngresosXmes(10)+
sumarIngresosXmes(11)+
sumarIngresosXmes(12)
} symbol={'S/.'}/></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
            <h4 className="text-center h2">EGRESOS <span className='ml-3'><SymbolSoles isbottom={false} classN={'mb-4'}/></span></h4>
            <Card>
                {
                    dataGastosxANIO.map((g, i)=>{
                        
                        const resultadoFinal = sumarMontosPorMes(g.conceptos, g.grupo);
                        
                        return(
                        <Table
                        striped
                        className="table-centered mb-0"
                        // hover

                        responsive
                    >
                        <thead className="bg-primary">
                            <tr>
                            <th className='text-primary fs-2'><span className='bg-white p-1 rounded rounded-3' style={{width: '260px'}}>{i+1}. {g.grupo}</span></th>
                            <th className='text-white text-center p-1'>ENERO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>FEBRERO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>MARZO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>ABRIL <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>MAYO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>JUNIO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>JULIO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>AGOSTO <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>SEPTIEMBRE <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>OCTUBRE <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>NOVIEMBRE <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>DICIEMBRE <span className='w-100 float-end'></span></th>
                            <th className='text-white text-center p-1'>TOTAL <span className='w-100 float-end'></span></th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                g.conceptos.map((c, index)=>(
                                    <tr>
                                        <td className='fw-bold fs-4'><div style={{width: '250px'}}>{index+1}. {c.concepto}</div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[0], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[0].monto_total}/></div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[1], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[1].monto_total}/></div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[2], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[2].monto_total}/></div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[3], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[3].monto_total}/></div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[4], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[4].monto_total}/></div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[5], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[5].monto_total}/></div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[6], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[6].monto_total}/></div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[7], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[7].monto_total}/></div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[8], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[8].monto_total}/></div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda({...c.items[9], concepto: c.concepto, grupo: g.grupo})}><NumberFormatMoney amount={c.items[9].monto_total}/></div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda(c.items[10])}><NumberFormatMoney amount={c.items[10].monto_total}/></div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda(c.items[11])}><NumberFormatMoney amount={c.items[11].monto_total}/></div></td>
                                        <td className='text-center'><div className='cursor-text-primary' onClick={()=>onOpenModalDetallexCelda(c.items[12])}><NumberFormatMoney amount={
                                                                                                c.items[0].monto_total+
                                                                                                c.items[1].monto_total+
                                                                                                c.items[2].monto_total+
                                                                                                c.items[3].monto_total+
                                                                                                c.items[4].monto_total+
                                                                                                c.items[5].monto_total+
                                                                                                c.items[6].monto_total+
                                                                                                c.items[7].monto_total+
                                                                                                c.items[8].monto_total+
                                                                                                c.items[9].monto_total+
                                                                                                c.items[10].monto_total+
                                                                                                c.items[11].monto_total}/></div></td>
                                    </tr>
                                )
                                )
                            }
                            <tr>
                                <td className='fw-bolder h4'>TOTAL</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[0].monto_total}/>}</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[1].monto_total}/>}</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[2].monto_total}/>}</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[3].monto_total}/>}</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[4].monto_total}/>}</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[5].monto_total}/>}</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[6].monto_total}/>}</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[7].monto_total}/>}</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[8].monto_total}/>}</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[9].monto_total}/>}</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[10].monto_total}/>}</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={resultadoFinal.meses[11].monto_total}/>}</td>
                                <td className='text-center fw-bolder h4'>{<NumberFormatMoney amount={
                                                                                        resultadoFinal.meses[0].monto_total+
                                                                                        resultadoFinal.meses[1].monto_total+
                                                                                        resultadoFinal.meses[2].monto_total+
                                                                                        resultadoFinal.meses[3].monto_total+
                                                                                        resultadoFinal.meses[4].monto_total+
                                                                                        resultadoFinal.meses[5].monto_total+
                                                                                        resultadoFinal.meses[6].monto_total+
                                                                                        resultadoFinal.meses[7].monto_total+
                                                                                        resultadoFinal.meses[8].monto_total+
                                                                                        resultadoFinal.meses[9].monto_total+
                                                                                        resultadoFinal.meses[10].monto_total+
                                                                                        resultadoFinal.meses[11].monto_total
                                                                                        }/>}</td>
                            </tr>
                        </tbody>
                        </Table>
                    )})
                }
            </Card>
            <h4 className="text-center h2">UTILIDAD</h4>
            <Card>
            <Table
                    // style={{tableLayout: 'fixed'}}
                    className="table-centered mb-0"
                    hover
                    responsive
                    striped
                >
                    <thead className="bg-primary">
                        <tr>
                            <th>
                                <div style={{ maxWidth: '10px' }}></div>
                            </th>
                            <th className='text-white text-center p-1'>ENERO <span className='w-100 float-end'>S/.</span></th>
                            <th className='text-white text-center p-1'>FEBRERO <span className='w-100 float-end'>S/.</span></th>
                            <th className='text-white text-center p-1'>MARZO <span className='w-100 float-end'>S/.</span></th>
                            <th className='text-white text-center p-1'>ABRIL <span className='w-100 float-end'>S/.</span></th>
                            <th className='text-white text-center p-1'>MAYO <span className='w-100 float-end'>S/.</span></th>
                            <th className='text-white text-center p-1'>JUNIO <span className='w-100 float-end'>S/.</span></th>
                            <th className='text-white text-center p-1'>JULIO <span className='w-100 float-end'>S/.</span></th>
                            <th className='text-white text-center p-1'>AGOSTO <span className='w-100 float-end'>S/.</span></th>
                            <th className='text-white text-center p-1'>SEPTIEMBRE <span className='w-100 float-end'>S/.</span></th>
                            <th className='text-white text-center p-1'>OCTUBRE <span className='w-100 float-end'>S/.</span></th>
                            <th className='text-white text-center p-1'>NOVIEMBRE <span className='w-100 float-end'>S/.</span></th>
                            <th className='text-white text-center p-1'>DICIEMBRE <span className='w-100 float-end'>S/.</span></th>
                            <th className='text-white text-center p-1'>TOTAL <span className='w-100 float-end'>S/.</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>INGRESOS</td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(1)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(2)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(3)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(4)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(5)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(6)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(7)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(8)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(9)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(10)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(11)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes(12)} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={sumarIngresosXmes('T')} symbol={'S/.'}/></td>
                        </tr>
                        <tr>
                            <td>EGRESOS</td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(1).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(2).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(3).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(4).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(5).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(6).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(7).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(8).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(9).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(10).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(11).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(12).producto17_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes('T').producto17_MONTO} symbol={'S/.'}/></td>
                        </tr>
                        <tr>
                            <td>UTILIDAD</td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(1).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(2).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(3).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(4).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(5).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(6).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(7).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(8).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(9).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(10).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(11).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes(12).producto18_MONTO} symbol={'S/.'}/></td>
                            <td className='text-center'><NumberFormatMoney amount={obtenerTotalIngresosxxMes('T').producto18_MONTO} symbol={'S/.'}/></td>
                        </tr>
                    </tbody>
                </Table>
            </Card>
            <h4 className="text-center h2">CREDITO FISCAL</h4>
            <Card>
                {
                    dataCreditoFiscal.length!==0 && (
                        <Table
                                // style={{tableLayout: 'fixed'}}
                                className="table-centered mb-0"
                                hover
                                striped
                                responsive
                            >
                                <thead className="bg-primary">
                                    <tr>
                                        <th>
                                            <div style={{ maxWidth: '10px' }}></div>
                                        </th>
                                        <th className='text-white text-center p-1'>ENERO <span className='w-100 float-end'>S/.</span></th>
                                        <th className='text-white text-center p-1'>FEBRERO <span className='w-100 float-end'>S/.</span></th>
                                        <th className='text-white text-center p-1'>MARZO <span className='w-100 float-end'>S/.</span></th>
                                        <th className='text-white text-center p-1'>ABRIL <span className='w-100 float-end'>S/.</span></th>
                                        <th className='text-white text-center p-1'>MAYO <span className='w-100 float-end'>S/.</span></th>
                                        <th className='text-white text-center p-1'>JUNIO <span className='w-100 float-end'>S/.</span></th>
                                        <th className='text-white text-center p-1'>JULIO <span className='w-100 float-end'>S/.</span></th>
                                        <th className='text-white text-center p-1'>AGOSTO <span className='w-100 float-end'>S/.</span></th>
                                        <th className='text-white text-center p-1'>SEPTIEMBRE <span className='w-100 float-end'>S/.</span></th>
                                        <th className='text-white text-center p-1'>OCTUBRE <span className='w-100 float-end'>S/.</span></th>
                                        <th className='text-white text-center p-1'>NOVIEMBRE <span className='w-100 float-end'>S/.</span></th>
                                        <th className='text-white text-center p-1'>DICIEMBRE <span className='w-100 float-end'>S/.</span></th>
                                        <th className='text-white text-center p-1'>TOTAL <span className='w-100 float-end'>S/.</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>PERIODO ANT.</td>
                                        {/* <td className='text-center'><NumberFormatMoney amount={dataCreditoFiscal.creditoFiscalAniosAnteriores} symbol={'S/.'}/></td> */}
                                        {
                                            calcularCreditoFiscal(dataCreditoFiscal.facturas, dataCreditoFiscal.ventas, dataCreditoFiscal.creditoFiscalAniosAnteriores).map(c=>(
                                                <td className='text-center'><NumberFormatMoney amount={c.acumulado} symbol={'S/.'}/></td>
                                            ))
                                        }
                                        <th>2300</th>
                                    </tr>
                                    <tr>
                                        <td>IGV VENTAS</td>
                                        {
                                            dataCreditoFiscal.ventas.map(v=>(
                                                <td className='text-center'><NumberFormatMoney amount={v.igv} symbol={'S/.'}/></td>  
                                            ))
                                        }
                                    </tr>
                                    <tr>
                                        <td>IGV COMPRAS</td>
                                        {
                                            dataCreditoFiscal.facturas.map(f=>(
                                                <td className='text-center'><NumberFormatMoney amount={f.igv} symbol={'S/.'}/></td>
                                            ))
                                        }
                                    </tr>
                                    <tr>
                                        <td>CREDITO FISCAL</td>
                                        {
                                            calcularCreditoFiscal(dataCreditoFiscal.facturas, dataCreditoFiscal.ventas, dataCreditoFiscal.creditoFiscalAniosAnteriores).map(c=>(
                                                <td className='text-center'><NumberFormatMoney amount={c.creFisc} symbol={'S/.'}/></td>
                                            ))
                                        }
                                        <td className='text-center'><NumberFormatMoney amount={creditoFiscalAcumulado(1)} symbol={'S/.'}/></td>
                                    </tr>
                                </tbody>
                            </Table>
                    )
                }
            </Card>
        </Col>
    </Row>
    <ModalDetallexCelda data={dataModal} onHide={onCloseModalDetallexCelda} show={isOpenModalDetallexCelda}/>
    </>
  )
}
