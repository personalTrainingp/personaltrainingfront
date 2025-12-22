export const TotalesPorGrupo = (data) => {
	const dataTotal = data.map((g) => {
		// inicializamos un array de 12 meses en cero
		const mesesSuma = Array.from({ length: 12 }, () => 0);

		g?.conceptos?.forEach((concepto) => {
			concepto.items.forEach(({ mes, items }) => {
				// items aquí es el array de gastos de ese mes; sumamos cada gasto[i].monto (o el campo que corresponda)
				const sumaDelMes = items.reduce((acc, gasto) => {
					return acc + (gasto.monto * gasto.tc || 0);
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
	console.log({ dataTotal });

	return {
		dataTotal,
	};
};
export const TotalesGeneralesxMes = (data = []) => {
	// otro array de 12 meses en cero
	const totales = Array.from({ length: 12 }, () => 0);

	data?.forEach((grupo) => {
		grupo?.conceptos?.forEach((concepto) => {
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
};
