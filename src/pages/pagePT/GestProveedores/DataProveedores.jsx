import { Row, Col, Card,  Modal } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';
import { useEffect, useState } from 'react';
import { ModalProveedor } from './ModalProveedor';
import { Button } from 'primereact/button';
import { CustomersProv } from './CustomersProv';
import { ColorEmpresa } from '@/components/ColorEmpresa';

export const DataProveedores = ({id_estado}) => {
  const [isModalOpenProv, setisModalOpenProv] = useState(false);
  const [idProv, setidProv] = useState(0);

  const modalProvClose = () => setisModalOpenProv(false);
  const modalProvOpen = () => setisModalOpenProv(true);
  const onOpenModalProvOpen=(id)=>{
    modalProvOpen()
    setidProv(id)
  }

  return (
    <>
      <PageBreadcrumb title="Gestion de proveedores" subName="E" />
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={5}>
                  <Button label="Agregar proveedor" onClick={()=>onOpenModalProvOpen(0)} />
                </Col>
              </Row>
              <ColorEmpresa
                childrenChange={
                      <CustomersProv onOpenModalProvOpen={onOpenModalProvOpen} estado_prov={id_estado} agente={true} id_empresa={598} />
                }
                childrenReducto={
                      <CustomersProv onOpenModalProvOpen={onOpenModalProvOpen} estado_prov={id_estado} agente={true} id_empresa={599} />
                }
                childrenCircus={
                      <CustomersProv onOpenModalProvOpen={onOpenModalProvOpen} estado_prov={id_estado} agente={true} id_empresa={601} />
                }
                childrenRal={
                      <CustomersProv onOpenModalProvOpen={onOpenModalProvOpen} estado_prov={id_estado} agente={true} id_empresa={0} />
                }
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ModalProveedor show={isModalOpenProv} id={idProv} onHide={modalProvClose} />
    </>
  );
};