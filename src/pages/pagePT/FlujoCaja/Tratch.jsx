
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