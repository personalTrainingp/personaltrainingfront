{
	agruparConceptos(data, 2026, '05').map((m) => {
		return (
			<Table>
				<thead>
					<tr>
						<th style={{ width: '250px' }}>{m.param_label}</th>
						<th style={{ width: '250px' }}>MAYO</th>
					</tr>
				</thead>
				<tbody>
					{m.parametro_grupo_gasto
						.filter((f) => f.monto_proyectado !== 0)
						.map((f) => {
							return (
								<tr>
									<td>{f.nombre_gasto}</td>
									{f.itemsxDia.map((g) => {
										return <td>{g.monto_proyectado}</td>;
									})}
								</tr>
							);
						})}
				</tbody>
			</Table>
		);
	});
}
