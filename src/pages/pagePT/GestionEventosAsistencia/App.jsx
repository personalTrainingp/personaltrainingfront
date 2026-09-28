import React from 'react';
import { TabPanel, TabView } from 'primereact/tabview';
import { PageBreadcrumb } from '@/components';
import { TabEventos } from './TabEventos';
import { TabPersonas } from './TabPersonas';

export const App = () => {
	return (
		<div>
			<PageBreadcrumb title={'Eventos de asistencia (huellero)'} />
			<TabView>
				<TabPanel header="Eventos">
					<TabEventos />
				</TabPanel>
				<TabPanel header="Personas">
					<TabPersonas />
				</TabPanel>
			</TabView>
		</div>
	);
};
