import { Menu } from 'primereact/menu';
import React, { useEffect, useState } from 'react'
import { DataTableTerminologiaSistema } from './TermSistema/DataTableTerminologiaSistema';
import { Col, Row } from 'react-bootstrap';

export const TerminologiaSistemas = () => {
    const [contenido, setContenido] = useState({entidad: "todos", grupo: 'todos'});
    const items = [
        {
            label: 'OFICIOS DE PROVEEDORES',
            command: () => setContenido({entidad: 'proveedor', grupo: 'tipo_oficio'}),
        },
    ];
    useEffect(() => {
      
    }, [])
    
  return (
    <>
    <Row>
      <Col lg={3}>
        <Menu model={items}/>
      </Col>
      <Col lg={9}>
        <DataTableTerminologiaSistema entidad={contenido.entidad} grupo={contenido.grupo} dataTerm={contenido}/>
      </Col>
    </Row>
    </>
  )
}
