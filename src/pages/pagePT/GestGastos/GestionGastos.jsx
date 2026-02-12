import React, { useState } from 'react'
import { Card, Tab, Tabs } from 'react-bootstrap'
import { GestionGastosIngresos } from './GestionGastosIngresos'
import { PageBreadcrumb } from '@/components'
import { TabPanel, TabView } from 'primereact/tabview'
import { ColorEmpresa } from '@/components/ColorEmpresa'
// import mdu from './mdu.xlsx'
export const GestionGastos = () => {
      const [termusos, settermusos] = useState({change: false, circus: false})
      // const onClickTerminologiaUsos=(emp)=>{
      //       if(emp===601){
      //             window.open(mdu, '_blank');
      //       }
      //       if(emp===598){
      //             window.open(mdu, '_blank');
      //       }
      // }

  return (
    <>
    
    <PageBreadcrumb title={'GESTION DE EGRESOS'} subName={'T'}/>
    <Card className='p-4 m-2'>
      <ColorEmpresa
            childrenChange={
                  <>
                  <div className='fs-3 fw-bold text-primary cursor-pointer' href={'/mdu.xlsx'} target="_blank" rel="noopener noreferrer">
                        <i className='pi pi-file-pdf fs-3 mr-3'></i>
                        TERMINOLOGIA - MANUAL DE USO
                  </div>
                    <GestionGastosIngresos id_enterprice={598} bgEmpresa={'bg-danger'}/>
                  </>
            }
            childrenCircus={
                  <>
                        <a className='fs-3 fw-bold text-primary cursor-pointer' href={'/mdu.xlsx'} target="_blank" rel="noopener noreferrer">
                              <i className='pi pi-file-pdf fs-3 mr-3'></i>
                              TERMINOLOGIA - MANUAL DE USO
                        </a>
                        <GestionGastosIngresos id_enterprice={601} bgEmpresa={'bg-danger'}/>
                  </>
            }
            childrenReducto={
                  <>
                        <GestionGastosIngresos id_enterprice={599} bgEmpresa={'bg-danger'}/>
                  </>
            }
            childrenManicure={
              <GestionGastosIngresos id_enterprice={700} bgEmpresa={'bg-success'}/>
            }
            childrenOtros={
              <GestionGastosIngresos id_enterprice={0} bgEmpresa={'bg-danger'}/>
            }
            childrenOtrosRal={
              <GestionGastosIngresos id_enterprice={600} bgEmpresa={'bg-danger'}/>
            }
            childrenRal={
              <GestionGastosIngresos id_enterprice={800} bgEmpresa={'bg-danger'}/>
            }

      />
    </Card>
    </>
  )
}
