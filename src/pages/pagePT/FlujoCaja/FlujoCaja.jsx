import { PageBreadcrumb } from '@/components';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useEffect, useState } from 'react';
import { DataFlujoCaja } from './DataFlujoCaja';

export const FlujoCaja = () => {
	
	return (
		<>
			<PageBreadcrumb subName={'T'} title={'Flujo de Caja'} />
            <TabView>
                <TabPanel header='CHANGE'>
                    <DataFlujoCaja id_enterprice={598}/>
                </TabPanel>
                <TabPanel header='CIRCUS'>
                <DataFlujoCaja id_enterprice={599}/>
                </TabPanel>
            </TabView>
		</>
	);
};
