import { DataTableCR } from '@/components/DataView/DataTableCR';
import React from 'react'
// import { TerminosOnShow } from '@/hooks/Api/Terminologias';

export const DataTableTardanzas = ({list, dataTipoTardanzas, onOpenModalCustomProducto, onOpenModalOfertasProducto, onDeleteCustomProducto}) => {
  const columns = [
    { id: 'id', header: 'ID', accessor: 'id', sortable: true, width: 20, headerAlign: 'right', cellAlign: 'left' },
    { id: 'nombre', header: 'Nombre del colaborador', accessor: 'nombre_colaborador', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'fechaDesde', header: 'Fecha', accessor: 'fechaDesde', width: 100, headerAlign: 'right', cellAlign: 'left' },
    { id: 'descripcion', header: 'Descripcion', accessor: 'observacion', sortable: true, width: 70, headerAlign: 'right', cellAlign: 'right' },
    { id: 'Tipo', header: 'tipo', sortable: true, width: 70, headerAlign: 'right', cellAlign: 'right', render: (row)=>{
      return (
        <>{dataTipoTardanzas.find(t=>t.value===row.id_tipo)?.label}</>
      )
    } },
    { id: 'minutos', header: 'Minutos', accessor: 'minutos', sortable: true, width: 70, headerAlign: 'right', cellAlign: 'right' },
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
