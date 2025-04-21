import { PageBreadcrumb } from '@/components';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useEffect, useState } from 'react';
import { DataFlujoCaja } from './DataFlujoCaja';
import { DatatableEgresos } from './DatatableEgresos';

export const FlujoCaja = () => {
	
	return (
		<>
			<PageBreadcrumb subName={'T'} title={'Flujo de Caja'} />
            <TabView>
                <TabPanel header='CHANGE'>
                    <TabView>
                        <TabPanel header={'2024'}>
                            <DatatableEgresos id_enterprice={598} anio={2024}/>
                        </TabPanel>
                        <TabPanel header={'2025'}>
                            <DatatableEgresos id_enterprice={598} anio={2025}/>
                        </TabPanel>
                    </TabView>
                </TabPanel>
                <TabPanel header='CIRCUS'>
                    <TabView>
                        <TabPanel header={'2024'}>
                            <DatatableEgresos id_enterprice={599} anio={2024}/>
                        </TabPanel>
                        <TabPanel header={'2025'}>
                            <DatatableEgresos id_enterprice={599} anio={2025}/>
                        </TabPanel>
                    </TabView>
                </TabPanel>
            </TabView>
		</>
	);
};
