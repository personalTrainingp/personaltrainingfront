import { PageBreadcrumb } from '@/components';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useEffect, useState } from 'react';
import { DataFlujoCaja } from './DataFlujoCaja';
import { DatatableEgresos } from './DatatableEgresos';
// Componente reutilizable para iconos en los tabs
const TabIcon = ({ src, alt, width }) => (
    <div className='h-100'>
        <img
          src={src}
          alt={alt}
          width={width}
          className="h-auto object-contain align-items"
        />
    </div>
);

export const FlujoCaja = () => {
	
	return (
		<>
			<PageBreadcrumb subName={'T'} title={'Flujo de Caja'} />
            <TabView>
                <TabPanel style={{alignItems: 'flex-end', display: 'flex'}} header={<TabIcon width={220} src='https://change-the-slim-studio-sigma.vercel.app/assets/mem_logo-be75730a.png'/>}>
                    <TabView>
                        <TabPanel header={<div className='fs-1 text-black'>2024</div>}>
                            <DatatableEgresos id_enterprice={598} anio={2024}/>
                        </TabPanel>
                        <TabPanel header={<div className='fs-1 text-black'>2025</div>}>
                            <DatatableEgresos id_enterprice={598} anio={2025}/>
                        </TabPanel>
                    </TabView>
                </TabPanel>
                <TabPanel style={{alignItems: 'flex-end', display: 'flex'}} className='mx-5' header={<TabIcon width={180} src='https://sistema-circus.vercel.app/assets/Positivo-transparente-c932a60a.png'/>}>
                    <TabView>
                        <TabPanel header={<div className='fs-1  text-black'>2024</div>}>
                            <DatatableEgresos id_enterprice={599} anio={2024}/>
                        </TabPanel>
                        <TabPanel header={<div className='fs-1 text-black'>2025</div>}>
                            <DatatableEgresos id_enterprice={599} anio={2025}/>
                        </TabPanel>
                    </TabView>
                </TabPanel>
                <TabPanel style={{alignItems: 'flex-end', display: 'flex'}} className='mb-2' header={<div style={{fontSize: '45px'}} className=' fw-medium text-black'>ISE SAC</div>}>
                    <TabView>
                        <TabPanel header={<div className='fs-1 text-black'>2024</div>}>
                            <DatatableEgresos textColor={'bg-primary'} id_enterprice={601} anio={2024}/>
                        </TabPanel>
                        <TabPanel header={<div className='fs-1 text-black'>2025</div>}>
                            <DatatableEgresos textColor={'bg-secondary'} id_enterprice={601} anio={2025}/>
                        </TabPanel>
                    </TabView>
                </TabPanel>
            </TabView>
		</>
	);
};
