import { PageBreadcrumb, Table } from '@/components'
import React, { useEffect } from 'react'
import { Col, Row } from 'react-bootstrap'
import { columnsParamsG, sizePerPageList } from './ColumnGastoFijo'
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore'
import { useSelector } from 'react-redux'

export const GestGastosFvsV = () => {
  const { obtenerParametrosGastosFinanzas } = useGf_GvStore()
  useEffect(() => {
    obtenerParametrosGastosFinanzas()
  }, [])
  const {dataParametrosGastos} = useSelector(u=>u.finanzas)
  return (
    <>
        <Row>
        <Table
            columns={columnsParamsG}
            data={dataParametrosGastos}
            pageSize={10}
            sizePerPageList={sizePerPageList}
            isSortable={true}
            pagination={false}
            isSearchable={true}
            tableClass="table-striped"
            searchBoxClass="mt-2 mb-3"
          /> 
        </Row>
    </>
  )
}
