import { DataTableCR } from '@/components/DataView/DataTableCR';
import React from 'react'
// import { TerminosOnShow } from '@/hooks/Api/Terminologias';

export const DataTableFeriados = ({list, onOpenModalCustomProducto, onOpenModalOfertasProducto, onDeleteCustomProducto}) => {
  const columns = [
    { id: 'id', header: 'ID', accessor: 'id', sortable: true, width: 20, headerAlign: 'right', cellAlign: 'left' },
    { id: 'nombre', header: 'Nombre', accessor: 'nombre', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'fecha', header: 'Fecha', accessor: 'fechaDesde', width: 100, headerAlign: 'right', cellAlign: 'left' },
  ];
  return (
    <div>
        <DataTableCR
          columns={columns}
          data={list}
          defaultPageSize={25}
          pageSizeOptions={[10, 25, 50, 100]}
          striped={false}
          small
          responsive
          syncUrl
          pageParam="page"          // opcional (default: "page")
          pageSizeParam="pageSize"  // opcional (default: "pageSize")
          verticalBorders
          resizableColumns
        />
    </div>
  )
}
