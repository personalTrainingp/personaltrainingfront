import React, { useEffect, useMemo, useState } from 'react';
import { TabPanel, TabView } from 'primereact/tabview';
import { App2 } from './App2';
import { PageBreadcrumb } from '@/components';

export const App = () => {

  return (
    <>
    <PageBreadcrumb title={'CUENTAS POR PAGAR'}/>
    <TabView>
      <TabPanel header={<div className='fs-1'>CHANGE</div>}>
        <App2 id_empresa={598} bgEmpresa='bg-change' classNameTablePrincipal='bg-change p-2' />
      </TabPanel>
      <TabPanel header={<div className='fs-1 text-circus'>CIRCUS</div>}>
        <App2 id_empresa={601} bgEmpresa='bg-circus' classNameTablePrincipal='bg-circus p-2' />
      </TabPanel>
      <TabPanel header={<div className='fs-1 text-ISESAC'>REDUCTO</div>}>
        <App2 id_empresa={599} bgEmpresa='bg-greenISESAC' classNameTablePrincipal='bg-greenISESAC p-2' />
      </TabPanel>
    </TabView>
    </>
  );
};
