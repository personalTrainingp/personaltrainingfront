import { Row, Col, Card,  Modal } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';
import { useEffect, useState } from 'react';
import { ModalProveedor } from './ModalProveedor';
import { Button } from 'primereact/button';
import { CustomersProv } from './CustomersProv';
import { ColorEmpresa } from '@/components/ColorEmpresa';

export const DataProveedores = ({id_estado, tipo}) => {
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
      <PageBreadcrumb title="Gestion de Ingresantes" subName="E" />
      <Row>
        <Col xs={12}>
          <Card>
            <Card.Body>
              <Row className="mb-3">
                <Col sm={5}>
                  <Button label="Agregar ingresantes" onClick={()=>onOpenModalProvOpen(0)} />
                </Col>
              </Row>
              <ColorEmpresa
                childrenChange={
                      <CustomersProv tipo={tipo} onOpenModalProvOpen={onOpenModalProvOpen}  estado_prov={id_estado} agente={true} id_empresa={598} />
                }
                childrenReducto={
                      <CustomersProv tipo={tipo} onOpenModalProvOpen={onOpenModalProvOpen} estado_prov={id_estado} agente={true} id_empresa={599} />
                }
                childrenCircus={
                      <CustomersProv tipo={tipo} onOpenModalProvOpen={onOpenModalProvOpen} estado_prov={id_estado} agente={true} id_empresa={601} />
                }
                childrenRal={
                      <CustomersProv tipo={tipo} onOpenModalProvOpen={onOpenModalProvOpen} estado_prov={id_estado} agente={true} id_empresa={800} />
                }
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ModalProveedor tipo={tipo} show={isModalOpenProv} id={idProv} onHide={modalProvClose} />
    </>
  );
};