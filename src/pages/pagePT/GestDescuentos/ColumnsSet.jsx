
const actionFecha = (row)=>{
    const fec_inicio = new Date(row.fec_inicio).toLocaleDateString("es")
    return fec_inicio;
}
const actionFechaFinal = (row)=>{
    const fec_fin = new Date(row.fec_fin).toLocaleDateString("es")
    return new Date(row.fec_fin).getFullYear() > 3000?"indefinido": fec_fin;
}
const multiplicador=(row)=>{
    return `${row.multiplicador*100}%`
}
const columns=[
    {
		name: 'id',
		selector: row => row.id,
        width: '60px', // Ajusta el ancho de la columna aquí
	},
	{
		name: 'Multiplicador',
		selector: row => row.multiplicador,
        width: '120px', // Ajusta el ancho de la columna aquí
        cell: multiplicador
	},
	{
		name: 'Inicio',
		selector: row => row.fec_inicio,
        cell: actionFecha
	},
	{
		name: 'Final',
		selector: row => row.fec_fin,
        cell: actionFechaFinal
	},
]
export { columns }