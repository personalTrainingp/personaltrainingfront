import config from '@/config'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect } from 'react'

export const DataTableContratoCliente = () => {
  const { obtenerContratosDeClientes, dataContratos } = useVentasStore()
  useEffect(() => {
    obtenerContratosDeClientes()
  }, [])
  const firmaBodyTemplate = (rowData)=>{
    return (
      <>
      {rowData.detalle_ventaMembresia[0].firma_cli==null?<a className='underline cursor-pointer'>SIN FIRMA</a>:'con firma'}
      </>
    )
  }
  const programaSemanasBodyTemplate = (rowData)=>{
    return (
      <>

      </>
    )
  }
  const contratosSociosBodyTemplate = (rowData)=>{

    return (
      <>
        {rowData.detalle_ventaMembresia[0].firma_cli==null?'':<a href={`${config.API_IMG.FILE_CONTRATOS_CLI}${rowData.detalle_ventaMembresia[0].contrato_x_serv?.name_image}`}>CONTRATO</a>}
        
      </>
    )
  }
  return (
    <>
      <DataTable value={dataContratos} paginator rows={10} dataKey="id"
                    globalFilterFields={['usuario', 'ip', 'accion', 'observacion', 'fecha_audit']} emptyMessage="Sin Contratos">
                <Column header="SOCIOS"  style={{ minWidth: '12rem' }} />
                <Column header="Programa | Semanas" body={programaSemanasBodyTemplate} style={{ minWidth: '12rem' }} />
                <Column header="Asesor comercial" style={{ maxWidth: '10rem' }} />
                <Column header="Firmas" body={firmaBodyTemplate} style={{ maxWidth: '5rem' }} />
                <Column header="Contratos" body={contratosSociosBodyTemplate} style={{ maxWidth: '20rem' }} />

            </DataTable>
    </>
  )
}
