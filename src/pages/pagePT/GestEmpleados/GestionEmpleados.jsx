import { PageBreadcrumb } from '@/components';
import React, { useState, useEffect, useMemo } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { SelectButton } from 'primereact/selectbutton';
import { TableEmpleados } from './TableEmpleados';
const EMPRESAS = [
  { label: 'CIRCUS', id: 599 },
  { label: 'CHANGE', id: 598 },
  { label: 'HISTORICO', id: 0 },
];

const ESTADOS = [
  { label: 'ACTIVOS', value: 1 },
  { label: 'INACTIVOS', value: 0 },
];

export const GestionEmpleados = ({id_activo}) => {
  const [empresa, setEmpresa] = useState(EMPRESAS[0]);
  const [estado, setEstado] = useState(1);

  useEffect(() => {
    if (empresa.id === 0) setEstado(0);
  }, [empresa]);

  const mostrarSelectorEstado = empresa.id !== 0;

  const isOpenButtonRegister = useMemo(
    () => estado === 1 && empresa.id !== 0,
    [estado, empresa.id]
  );

  const estadoTemplate = (option) => {
    return (
      <div className="estado-btn">
        {option.label}
      </div>
    );
  };

  return (
    <>
      <PageBreadcrumb title="COLABORADORES" subName="E-commerce" />
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row className="mb-3 g-2 align-items-center">
                <Col sm={12} md="auto">
                  <SelectButton
                    value={empresa}
                    onChange={(e) => setEmpresa(e.value)}
                    options={EMPRESAS}
                    optionLabel="label"
                    multiple={false}
                  />
                </Col>
              </Row>

              <TableEmpleados
                id_empresa={empresa.id}
                id_estado={id_activo}
                isOpenButtonRegister={isOpenButtonRegister}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};
