import React from 'react'
import { useNavigate } from 'react-router-dom'
import { TabPanel, TabView } from 'primereact/tabview'
import { InputButton } from '@/components/InputText'
import { DataTableCheckList } from './DataTableCheckList'
import { HistorialCheckList } from './HistorialCheckList'

export const AppGestionCheckList = ({ id_empresa }) => {
	const navigate = useNavigate()

	const onNuevoCheckList = () => {
		navigate(`/gestion-checklist/formulario/${id_empresa}/0`)
	}
	const onEditarCheckList = (id) => {
		navigate(`/gestion-checklist/formulario/${id_empresa}/${id}`)
	}
	const onVerCheckList = (id) => {
		navigate(`/gestion-checklist/formulario/${id_empresa}/${id}?ver=1`)
	}

	return (
		<div>
			<TabView>
				<TabPanel header="CHECKLISTS">
					<InputButton label={'AGREGAR CHECKLIST'} onClick={onNuevoCheckList} />
					<DataTableCheckList id_empresa={id_empresa} onEditarCheckList={onEditarCheckList} />
				</TabPanel>
				<TabPanel header="HISTORICO">
					<HistorialCheckList id_empresa={id_empresa} onVerCheckList={onVerCheckList} />
				</TabPanel>
			</TabView>
		</div>
	)
}
