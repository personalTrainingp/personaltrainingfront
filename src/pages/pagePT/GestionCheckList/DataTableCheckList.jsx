import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import { DataTableCR } from '@/components/DataView/DataTableCR'
import { DateMaskStr } from '@/components/CurrencyMask'
import { useCheckListStore } from './hook/useCheckListStore'

export const DataTableCheckList = ({ id_empresa, onEditarCheckList }) => {
	const { obtenerCheckListxEmpresa, deleteCheckListxID, loading } = useCheckListStore()
	const { dataView } = useSelector((e) => e.CHECKLIST)

	useEffect(() => {
		obtenerCheckListxEmpresa(id_empresa)
	}, [id_empresa])

	const confirmDeleteCheckList = (id) => {
		confirmDialog({
			message: `Quieres eliminar el checklist ${id}`,
			accept: () => {
				deleteCheckListxID(id, id_empresa)
			},
		})
	}

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
		{ id: 5, header: 'ESTADO', accessor: 'estado', width: '150px' },
		{
			id: 6,
			header: 'ACCIONES',
			render: (row) => (
				<>
					<Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => onEditarCheckList(row.id)} />
					<Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteCheckList(row.id)} />
				</>
			),
		},
	]

	return <DataTableCR columns={columns} data={dataView} loading={loading} responsive />
}
