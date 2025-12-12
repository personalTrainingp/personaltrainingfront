import React, { useEffect, useState, useMemo } from 'react';
import Select from 'react-select'; // <-- importar react-select
import { useFlujoCajaStore } from './hook/useFlujoCajaStore';
import { ModalDetallexCelda } from './ModalDetallexCelda';
import { useDispatch } from 'react-redux';
import { onSetColorView, onSetViewSubTitle } from '@/store';
import { useVentasStore } from './hook/useVentasStore';
import { TableVentas } from './TableVentas';
import { TableGasto } from './TableGasto';
import { TableFinal } from './TableFinal';

export const DatatableEgresos = ({
	id_enterprice,
	anio,
	nombre_empresa,
	background,
	arrayRangeDate,
	bgMultiValue,
	bgTotal
}) => {
	const [dataModal, setDataModal] = useState(null);
	const [isOpenModalDetallexCelda, setIsOpenModalDetallexCelda] = useState(false);
	const { obtenerGastosxANIO, dataGastosxANIO, dataNoPagos } = useFlujoCajaStore();
	const { obtenerVentasxFechaxEmpresa, dataVentasxMes } = useVentasStore()
	const dispatch = useDispatch();
	useEffect(() => {
		if(id_enterprice || arrayRangeDate){
			obtenerVentasxFechaxEmpresa(arrayRangeDate, id_enterprice)
		}
	}, [id_enterprice, arrayRangeDate])
	
	// 1) Nombres de los meses (índices 0–11)
	const mesesNombres = useMemo(
		() => [
			'ENERO',
			'FEBRERO',
			'MARZO',
			'ABRIL',
			'MAYO',
			'JUNIO',
			'JULIO',
			'AGOSTO',
			'SEPTIEMB.',
			'OCTUBRE',
			'NOVIEMB.',
			'DICIEMBRE',
		],
		[]
	);

	// 2) Crear opciones para react-select (value=1..12, label=“ENERO” etc)
	const monthOptions = useMemo(
		() =>
			mesesNombres.map((nombre, idx) => ({
				value: idx + 1,
				label: nombre,
			})),
		[mesesNombres]
	);

	// 3) Estado local para los meses seleccionados (inicialmente, todos)
	const [selectedMonths, setSelectedMonths] = useState(() => {
  // intenta leer un array de valores [1,2,3...]
  const stored = localStorage.getItem('selectedMonths')
  if (stored) {
    const vals = JSON.parse(stored)
    // reconstruye el array de opciones a partir de los valores guardados
    return monthOptions.filter(opt => vals.includes(opt.value))
  }
  // si no hay nada en storage, selecciona todos por defecto
  return monthOptions
});
// 4) Persiste en localStorage cada vez que cambie la selección
useEffect(() => {
  const vals = selectedMonths.map(opt => opt.value)
  localStorage.setItem('selectedMonths', JSON.stringify(vals))
}, [selectedMonths])
	// 4) Cada vez que cambia empresa o año, recargar datos
	useEffect(() => {
		obtenerGastosxANIO(anio, id_enterprice);
		// obtenerVentasxANIO(anio, id_enterprice)
	}, [anio, id_enterprice]);

	// 5) Al cambiar nombre_empresa, actualizar subtítulo y rango de fechas
	useEffect(() => {
		dispatch(onSetViewSubTitle(nombre_empresa));
		dispatch(onSetColorView(bgMultiValue));
		// dispatch(onSetRangeDate(arrayRangeDate));
	}, [nombre_empresa]);

	// 6) Calcular totales por grupo (sumando cada sub-item en vez de usar monto_total)
	const totalesPorGrupo = useMemo(() => {
		return dataGastosxANIO.map((g) => {
			// inicializamos un array de 12 meses en cero
			const mesesSuma = Array.from({ length: 12 }, () => 0);

			g.conceptos.forEach((concepto) => {
				concepto.items.forEach(({ mes, items }) => {
					// items aquí es el array de gastos de ese mes; sumamos cada gasto[i].monto (o el campo que corresponda)
					const sumaDelMes = items.reduce((acc, gasto) => {
						return acc + (gasto.monto*gasto.tc || 0);
					}, 0);
					mesesSuma[mes - 1] += sumaDelMes;
				});
			});

			const totalAnual = mesesSuma.reduce((sum, m) => sum + m, 0);
			return {
				grupo: g.grupo,
				mesesSuma,
				totalAnual,
				conceptos: g.conceptos,
			};
		});
	}, [dataGastosxANIO]);

	
	
	// justo después de tu useMemo que calcula totalPorMes y totalGeneral
		const prestamosGroup = totalesPorGrupo.find(
		(g) => g.grupo.toUpperCase() === 'PRESTAMOS'
		) || { mesesSuma: Array(12).fill(0), totalAnual: 0 };
	// 1) Prepara el array sin “PRESTAMOS”
	const gruposSinPrestamos = totalesPorGrupo.filter(
	(g) => g.grupo.toUpperCase() !== 'PRESTAMOS'
	);
	// 7) Calcular totales generales por mes para la última fila (sumando cada gasto en items)
	const { totalPorMes, totalGeneral } = useMemo(() => {
		// otro array de 12 meses en cero
		const totales = Array.from({ length: 12 }, () => 0);

		dataGastosxANIO.forEach((grupo) => {
			grupo.conceptos.forEach((concepto) => {
				concepto.items.forEach(({ mes, items }) => {
					// sumamos aquí cada gasto.monto dentro de items
					const sumaDelMes = items.reduce((acc, gasto) => {
						return acc + (gasto.monto || 0);
					}, 0);
					totales[mes - 1] += sumaDelMes;
				});
			});
		});

		const sumaAnual = totales.reduce((acc, v) => acc + v, 0);
		return { totalPorMes: totales, totalGeneral: sumaAnual };
	}, [dataGastosxANIO]);
	
	// 8) Funciones para abrir/cerrar el modal
	const onCloseModalDetallexCelda = () => {
		setIsOpenModalDetallexCelda(false);
		setDataModal(null);
	};
	const onOpenModalDetallexCelda = (itemDetail) => {
		setDataModal(itemDetail);
		setIsOpenModalDetallexCelda(true);
	};
	const mesesSeleccionadosNums = useMemo(
		() => selectedMonths.map((opt) => opt.value),
		[selectedMonths]
	);
	const backgroundMultiValue = bgMultiValue;
	return (
		<>
				<div style={{ marginBottom: '1rem', width: '95vw' }}>
					<Select
						options={monthOptions}
						isMulti
						closeMenuOnSelect={false}
						hideSelectedOptions={false}
						value={selectedMonths}
						onChange={setSelectedMonths}
						placeholder="Selecciona uno o varios meses..."
						styles={{
							control: (provided) => ({
								...provided,
								fontSize: '1.9rem',
								color: 'white',
							}),
							menuList: (provided, state) => ({
								...provided,
								padding: '12px 16px', // Espaciado interno para que cada opción sea más “alta”
							}),
							// Contenedor de las etiquetas seleccionadas ("pills")
							multiValue: (provided) => ({
								...provided,
								backgroundColor: backgroundMultiValue, // fondo rojo para cada etiqueta
								color: 'white',
							}),
							// Texto dentro de cada pill
							multiValueLabel: (provided) => ({
								...provided,
								color: 'white', // texto blanco sobre rojo
								fontSize: '1.45vw',
							}),
						}}
					/>
				</div>
				<div className="table-responsive" style={{ width: '95vw' }}>
					<TableVentas dataVentasxMes={dataVentasxMes} background={background} bgTotal={bgTotal} mesesNombres={mesesNombres} mesesSeleccionadosNums={mesesSeleccionadosNums}/>
					<div>
						<TableGasto 
							bgMultiValue={bgMultiValue} 
							bgTotal={bgTotal}  
							gruposSinPrestamos={gruposSinPrestamos} 
							mesesNombres={mesesNombres} 
							mesesSeleccionadosNums={mesesSeleccionadosNums} onOpenModalDetallexCelda={onOpenModalDetallexCelda}
							totalPorMes={totalPorMes}
							prestamosGroup ={prestamosGroup}
							totalGeneral ={totalGeneral }
							selectedMonths ={selectedMonths }
							dataVentasxMes={dataVentasxMes}
							/>
							{/* <TableFinal bgMultiValue={bgMultiValue} bgTotal={bgTotal} gruposSinPrestamos={gruposSinPrestamos} mesesNombres={mesesNombres} mesesSeleccionadosNums={mesesSeleccionadosNums} prestamosGroup={prestamosGroup} totalGeneral={totalGeneral} totalPorMes={totalPorMes}/> */}
					</div>
				</div>

			<ModalDetallexCelda
				data={dataModal}
				onHide={onCloseModalDetallexCelda}
				obtenerGastosxANIO={obtenerGastosxANIO}
				show={isOpenModalDetallexCelda}
				id_enterprice={id_enterprice}
				anio={anio}
				bgEmpresa={background}
			/>
		</>
	);
};


function unirPorMes(data) {
  const resultado = [];

  data.forEach(({ items }) => {
    items.forEach(({ mes, monto_total, items: subitems }) => {
      let existente = resultado.find(r => r.mes === mes);
      if (!existente) {
        existente = { mes, monto_total: 0, items: [] };
        resultado.push(existente);
      }
      existente.monto_total += monto_total;
      existente.items.push(...subitems);
    });
  });

  return resultado;
}
function totalesGrupo(dataGastoXgrpxconcepto) {
	return useMemo(() => {
		return dataGastoXgrpxconcepto.map((g) => {
			// inicializamos un array de 12 meses en cero
			const mesesSuma = Array.from({ length: 12 }, () => 0);

			g.conceptos.forEach((concepto) => {
				concepto.items.forEach(({ mes, items }) => {
					// items aquí es el array de gastos de ese mes; sumamos cada gasto[i].monto (o el campo que corresponda)
					const sumaDelMes = items.reduce((acc, gasto) => {
						return acc + (gasto.monto*gasto.tc || 0);
					}, 0);
					mesesSuma[mes - 1] += sumaDelMes;
				});
			});

			const totalAnual = mesesSuma.reduce((sum, m) => sum + m, 0);
			return {
				grupo: g.grupo,
				mesesSuma,
				totalAnual,
				conceptos: g.conceptos,
			};
		});
	}, [dataGastoXgrpxconcepto]);
	
}

function totalGeneralYsumaTotal(dataGasto) {
		const { totalPorMes, totalGeneral } = useMemo(() => {
		// otro array de 12 meses en cero
		const totales = Array.from({ length: 12 }, () => 0);

		dataGasto.forEach((grupo) => {
			grupo.conceptos.forEach((concepto) => {
				concepto.items.forEach(({ mes, items }) => {
					// sumamos aquí cada gasto.monto dentro de items
					const sumaDelMes = items.reduce((acc, gasto) => {
						return acc + (gasto.monto || 0);
					}, 0);
					totales[mes - 1] += sumaDelMes;
				});
			});
		});

		const sumaAnual = totales.reduce((acc, v) => acc + v, 0);
		return { totalPorMes: totales, totalGeneral: sumaAnual };
	}, [dataGasto]);
	return {
		totalPorMes,
		totalGeneral
	}
}