import { Button } from 'primereact/button'
import React, { useEffect } from 'react'
import { Card, Col, Row } from 'react-bootstrap'
import useCitasEstadosStore from './useCitasEstadosStore'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'

export const PrincipalView = () => {
  const { dataCitas, obtenerTodaCitas } = useCitasEstadosStore()
  useEffect(() => {
    obtenerTodaCitas()
  }, [])
  console.log(dataCitas, agruparEstadosCitasxEmpl(dataCitas));
  
  return (
    <Card>
    <Row className='d-flex justify-content-center'>
      {
        agruparEstadosCitasxEmpl(dataCitas).map(emp=>{
          return (
            <Col lg={3} className=''>
            <Card className='p-2'>
              <Card.Title className='fs-3 text-primary'>
                {emp.nombres_empl}
              </Card.Title>
              <ul className='text-decoration-none'>
                <li className='hover-border-card-primary m-1 fs-3'>Confirmada: {emp.confirmadas.length}</li>
                <li className='hover-border-card-primary m-1 fs-3'>Asistio: {emp.asistio.length}</li>
                <li className='hover-border-card-primary m-1 fs-3'>Canceladas: {emp.canceladas.length}</li>
                <li className='hover-border-card-primary m-1 fs-3'>no Asistio: {emp.noAsistio.length}</li>
              </ul>
            </Card>
          </Col>
          )
        })
      }
    </Row>
    <DataTable size='small' stripedRows value={[]} paginator rows={10} dataKey="id"
                      globalFilterFields={['usuario', 'ip', 'accion', 'observacion', 'fecha_audit']} emptyMessage="Sin Contratos">
                  <Column header="Nutricionista" style={{ maxWidth: '15rem' }} />
                  <Column header="Cliente" style={{ maxWidth: '15rem' }} />
                  <Column header="Estado" style={{ maxWidth: '15rem' }} />
              </DataTable>
    </Card>
  )
}

// Función para agrupar por nombres_apellidos_empl y contar firmados y sinFirmas
function agruparEstadosCitasxEmpl(dataView) {
  const groupedData = dataView?.reduce((acc, current) => {
    const empleado = current.tb_empleado?.nombres_apellidos_empl;
  
    // Buscamos si ya existe una entrada para este empleado
    let empleadoEntry = acc.find(item => item.nombres_empl === empleado);
  
    // Si no existe, la inicializamos
    if (!empleadoEntry) {
      empleadoEntry = {
        nombres_empl: empleado,
        items: [],
        confirmadas: [],
        asistio: [],
        canceladas: [],
        noAsistio: []
      };
      acc.push(empleadoEntry);
    }
  
    // Contamos firmados y sinFirmas en detalle_ventaMembresia
    const { status_cita } = current;
    if (status_cita==="500") {
      empleadoEntry.confirmadas.push(current);
    }
    if(status_cita=="501"){
      empleadoEntry.asistio.push(current);
    }
    if(status_cita=="502"){
      empleadoEntry.noAsistio.push(current);
    }
    if(status_cita=="503"){
      empleadoEntry.canceladas.push(current);
    }
  
    // Agregamos el elemento actual a los items de este empleado
    empleadoEntry.items.push(current);
  
    return acc;
  }, []);
  return groupedData;
}