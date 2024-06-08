import { Table } from '@/components'
import React, { useEffect } from 'react'
import { columns, sizePerPageList } from './ColumnsSet'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'

export const TodoVentas = () => {
    const { obtenerTablaVentas } = useVentasStore()
    useEffect(() => {
        obtenerTablaVentas()
    }, [])
    
  return (
    <>
        <Table
            columns={columns}
            data={[]}
            pageSize={10}
            sizePerPageList={sizePerPageList}
            isSortable={true}
            pagination={true}
            isSelectable={false}
            isSearchable={true}
            tableClass="table-striped"
            searchBoxClass="mt-2 mb-3"
        />
    </>
  )
}
