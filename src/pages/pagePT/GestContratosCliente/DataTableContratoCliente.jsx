import config from '@/config'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { ModalTipoCambio } from '../GestTipoCambio/ModalTipoCambio'
import { ModalIsFirma } from '@/components/ModalIsFirma'
import { useSelector } from 'react-redux'
import { Card, Col, Row } from 'react-bootstrap'
import { TabPanel, TabView } from 'primereact/tabview'

export const DataTableContratoCliente = () => {
  const { obtenerContratosDeClientes, dataContratos } = useVentasStore()
  // const {  } = useState(0)
  const [idVenta, setidVenta] = useState(0)
  const [idCli, setidCli] = useState(0)
  const [isOpenModalTipoCambio, setisOpenModalTipoCambio] = useState(false)
  const { dataView } =useSelector(e=>e.DATA)
    const onOpenModalTipoCambio = (id_venta, idCli) =>{
        setisOpenModalTipoCambio(true)
        setidVenta(id_venta)
        setidCli(idCli)
    }
    
    const onCloseModalTipoCambio = () =>{
        setisOpenModalTipoCambio(false)
    }
  useEffect(() => {
    obtenerContratosDeClientes()
  }, [])
  
  const firmaBodyTemplate = (rowData)=>{
    return (
      <>
      {rowData.detalle_ventaMembresia[0].firma_cli==null?<a onClick={()=>onOpenModalTipoCambio(rowData.id, rowData.id_cli)} className='underline cursor-pointer'>SIN FIRMA</a>:'con firma'}
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
  const nombreSocioBodyTemplate = (rowData)=>{
    return (
      <>
      {rowData.tb_cliente?.nombres_apellidos_cli}
      </>
    )
  }
  const nombreAsesorBodyTemplate = (rowData)=>{
    return (
      <>
      {rowData.tb_empleado?.nombres_apellidos_empl}
      </>
    )
  }
  const programaSemanaBodyTemplate = (rowData)=>{
    return (
      <>
      {rowData.detalle_ventaMembresia[0]?.tb_ProgramaTraining?.name_pgm} | {rowData.detalle_ventaMembresia[0].tb_semana_training.semanas_st*5} SESIONES
      </>
    )
  }
// Función para agrupar por nombres_apellidos_empl y contar firmados y sinFirmas
function agruparFirmasxEmpl(dataView) {
  const groupedData = dataView?.reduce((acc, current) => {
    const empleado = current.tb_empleado?.nombres_apellidos_empl;
  
    // Buscamos si ya existe una entrada para este empleado
    let empleadoEntry = acc.find(item => item.nombres_empl === empleado);
  
    // Si no existe, la inicializamos
    if (!empleadoEntry) {
      empleadoEntry = {
        nombres_empl: empleado,
        items: [],
        firmados: 0,
        sinFirmas: 0
      };
      acc.push(empleadoEntry);
    }
  
    // Contamos firmados y sinFirmas en detalle_ventaMembresia
    const { detalle_ventaMembresia } = current;
    detalle_ventaMembresia?.forEach(detalle => {
      if (detalle.firma_cli) {
        empleadoEntry.firmados += 1;
      } else {
        empleadoEntry.sinFirmas += 1;
      }
    });
  
    // Agregamos el elemento actual a los items de este empleado
    empleadoEntry.items.push(current);
  
    return acc;
  }, []);
  return groupedData;
}
  console.log(agruparFirmasxEmpl(dataView));
  
  return (
    <>
      <Row>
        {agruparFirmasxEmpl(dataView).map(f=>(
          <Col lg={3} className=''>
            <Card className='p-2 hover-border-card-primary' style={{height: '130px'}}>
              <Card.Title>
                {f.nombres_empl}
              </Card.Title>
              <ul className='text-decoration-none'>
                <li className=''>FIRMADOS: {f.firmados}</li>
                <li>SIN FIRMA: {f.sinFirmas}</li>
              </ul>
            </Card>
          </Col>
        ))
        }
      </Row>
      <TabView>
        {
          agruparFirmasxEmpl(dataView).map(f=>(
            <TabPanel header={f.nombres_empl}>

          <DataTable value={f.items} paginator rows={10} dataKey="id"
                              globalFilterFields={['usuario', 'ip', 'accion', 'observacion', 'fecha_audit']} emptyMessage="Sin Contratos">
                          <Column header="SOCIOS" body={nombreSocioBodyTemplate} style={{ minWidth: '12rem' }} />
                          <Column header="Programa | Semanas" body={programaSemanaBodyTemplate} style={{ minWidth: '12rem' }} />
                          <Column header="Asesor comercial" body={nombreAsesorBodyTemplate} style={{ maxWidth: '10rem' }} />
                          <Column header="Firmas" body={firmaBodyTemplate} style={{ maxWidth: '5rem' }} />
                          <Column header="Contratos" body={contratosSociosBodyTemplate} style={{ maxWidth: '20rem' }} />

                      </DataTable>
            </TabPanel>
          ))
        }
      </TabView>
            <ModalIsFirma idCli={idCli} idVenta={idVenta} show={isOpenModalTipoCambio} onHide={onCloseModalTipoCambio}/> 
    </>
  )
}
