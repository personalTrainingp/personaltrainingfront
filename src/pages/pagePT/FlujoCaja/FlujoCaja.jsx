import { PageBreadcrumb } from '@/components';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useEffect, useState } from 'react';
import { DataFlujoCaja } from './DataFlujoCaja';
import { DatatableEgresos } from './DatatableEgresos';
import { useSelector } from 'react-redux';
import { DataTableGastos } from './DataTableGastos';

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
	const {viewSubTitle} = useSelector(e=>e.ui)
	return (
		<>
			<PageBreadcrumb subName={'T'} title={`Flujo de Caja ${viewSubTitle}`} />
            <TabView>
                <TabPanel style={{alignItems: 'flex-end', display: 'flex'}}  header={<TabIcon width={220} src='https://change-the-slim-studio-sigma.vercel.app/assets/mem_logo-be75730a.png'/>}>
                    <TabView>
                        <TabPanel header={<div className='fs-1 text-black'>2024</div>}>
                            <DatatableEgresos arrayRangeDate={[new Date(2024, 8, 15), new Date()]} nombre_empresa={'CHANGE'} id_enterprice={598} background={'bg-primary'} anio={2024}/>
                        </TabPanel>
                        <TabPanel header={<div className='fs-1 text-black'>2025</div>}>
                            <DatatableEgresos arrayRangeDate={[new Date(2024, 8, 15), new Date()]} nombre_empresa={'CHANGE'} id_enterprice={598} background={'bg-primary'} anio={2025}/>
                        </TabPanel>
                    </TabView>
                </TabPanel>
                <TabPanel style={{alignItems: 'flex-end', display: 'flex'}} className='mx-5' header={<TabIcon width={180} src='https://sistema-circus.vercel.app/assets/Positivo-transparente-c932a60a.png'/>}>
                    <TabView>
                        <TabPanel header={<div className='fs-1 text-black'>2024</div>}>
                            <DatatableEgresos arrayRangeDate={[new Date(2025, 1, 15), new Date()]} nombre_empresa={'CIRCUS'} background={'bg-circus'} id_enterprice={599} anio={2024}/>
                        </TabPanel>
                        <TabPanel header={<div className='fs-1 text-black'>2025</div>}>
                            <DatatableEgresos arrayRangeDate={[new Date(2025, 1, 15), new Date()]} nombre_empresa={'CIRCUS'} background={'bg-circus'} id_enterprice={599} anio={2025}/>
                        </TabPanel>
                    </TabView>
                </TabPanel>
                <TabPanel style={{alignItems: 'flex-end', display: 'flex'}} className='mb-2' headerClassName="mi-tab-verde" header={<div style={{fontSize: '40px', color: '#17a700'}} className=' fw-medium'>INVERSIONES <br/> SAN EXPEDITO</div>}>
                    <TabView>
                        <TabPanel header={<div className='fs-1 text-black'>2024</div>}>
                            <DatatableEgresos arrayRangeDate={[new Date(2025, 1, 15), new Date()]} background={'bg-greenISESAC'} id_enterprice={601} anio={2024} nombre_empresa={'ISE SAC'}/>
                        </TabPanel>
                        <TabPanel header={<div className='fs-1 text-black'>2025</div>}>
                            <DatatableEgresos arrayRangeDate={[new Date(2025, 1, 15), new Date()]} background={'bg-greenISESAC'} id_enterprice={601} anio={2025} nombre_empresa={'ISE SAC'}/>
                        </TabPanel>
                    </TabView>
                </TabPanel>
                <TabPanel style={{alignItems: 'flex-end', display: 'flex'}} className='mb-2' headerClassName="mi-tab-verde" header={<div style={{fontSize: '40px', color: '#17a700'}} className=' fw-medium'>INVERSIONES <br/> SAN EXPEDITO <br/> circus</div>}>
                    <TabView>
                        <TabPanel header={<div className='fs-1 text-black'>2025</div>}>
                            <DataTableGastos arrayRangeDate={[new Date(2025, 1, 15), new Date()]} background={'bg-greenISESAC'} id_enterprice={601} anio={2025} nombre_empresa={'ISE SAC'}/>
                        </TabPanel>
                    </TabView>
                </TabPanel>
            </TabView>
		</>
	);
};
