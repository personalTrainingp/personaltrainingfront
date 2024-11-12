import { PageBreadcrumb, Table } from '@/components'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { columnsParamsG, sizePerPageList } from './TermGastos'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import { useSelector } from 'react-redux'
import { TabPanel, TabView } from 'primereact/tabview'
import { DataTableGastos } from './DataTableGastos'

export const GestGastosFvsV = () => {
  const { obtenerParametrosGastosFinanzas } = useGf_GvStore()
  useEffect(() => {
    obtenerParametrosGastosFinanzas()
  }, [])
  const {dataView} = useSelector(u=>u.DATA)
  console.log(dataView);
  
  return (
    <>
        <Row>
            <TabView>
              <TabPanel header='CHANGE'>
                <DataTableGastos data={dataView.filter(d=>d.id_empresa === 598)}/>
              </TabPanel>
              <TabPanel header='REDUCTO'>
              <DataTableGastos data={dataView.filter(d=>d.id_empresa === 599)}/>
              </TabPanel>
              <TabPanel header='HISTORICO'>
              <DataTableGastos data={dataView.filter(d=>d.id_empresa === 0)}/>
              </TabPanel>
            </TabView>
        </Row>
    </>
  )
}
