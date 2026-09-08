import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Badge } from 'react-bootstrap'
import { Button } from 'primereact/button'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { DateMaskStr } from '@/components/CurrencyMask'
import { useCheckListStore } from './hook/useCheckListStore'

export const HistorialCheckList = ({ id_empresa, onVerCheckList }) => {
	const { obtenerHistorialCheckListxEmpresa, loading } = useCheckListStore()
	const { dataViewHistorial } = useSelector((e) => e.CHECKLIST)

	useEffect(() => {
		obtenerHistorialCheckListxEmpresa(id_empresa)
	}, [id_empresa])

	const columns = [
		{ id: 1, header: 'ID', sortable: true, accessor: 'id', width: '80px' },
		{
			id: 2,
			header: <>FECHA <br /> CHECKLIST</>,
			accessor: 'fecha_checklist',
			width: '200px',
			render: (row) => <>{DateMaskStr(row.fecha_checklist, 'dddd DD [DE] MMMM [DEL] YYYY')}</>,
		},
		{ id: 3, header: 'TITULO', accessor: 'titulo', width: '250px' },
		{ id: 4, header: 'RESPONSABLE', accessor: 'responsable', width: '200px' },
		{
			id: 5,
			header: 'ITEMS',
			width: '260px',
			render: (row) => {
				const total = row.total_items || 0
				const revisados = row.revisados || 0
				const noRevisados = row.no_revisados || 0
				return (
					<div className="d-flex flex-column gap-1">
						<Badge bg="success">REVISADO: {revisados}</Badge>
						<Badge bg="danger">NO REVISADO: {noRevisados}</Badge>
						<Badge bg="secondary">TOTAL: {total}</Badge>
					</div>
				)
			},
		},
		{
			id: 6,
			header: 'ACCIONES',
			render: (row) => <Button icon="pi pi-eye" rounded outlined onClick={() => onVerCheckList(row.id)} />,
		},
	]

	return <DataTableCR columns={columns} data={dataViewHistorial} loading={loading} responsive />
}
