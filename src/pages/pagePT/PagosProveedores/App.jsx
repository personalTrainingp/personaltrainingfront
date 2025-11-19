import React, { useEffect, useMemo, useState } from 'react';
import { TabPanel, TabView } from 'primereact/tabview';
import { App2 } from './App2';
import { PageBreadcrumb } from '@/components';
import { ColorEmpresa } from '@/components/ColorEmpresa';

export const App = () => {

  return (
    <>
    <PageBreadcrumb title={'CUENTAS POR PAGAR'}/>
    <ColorEmpresa
      childrenChange={
        <App2 id_empresa={598} bgEmpresa='bg-change' classNameTablePrincipal='bg-change p-2' />
      }
      childrenCircus={
        <App2 id_empresa={601} bgEmpresa='bg-circus' classNameTablePrincipal='bg-circus p-2' />
      }
      childrenReducto={
        <App2 id_empresa={599} bgEmpresa='bg-greenISESAC' classNameTablePrincipal='bg-greenISESAC p-2' />
      }
    />
    </>
  );
};
