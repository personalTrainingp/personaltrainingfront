import { Row, Col, Card,  Modal } from 'react-bootstrap';
import { PageBreadcrumb } from '@/components';
import { Proveedores } from '../data';
import { columns, sizePerPageList } from './ColumnsSet';
import { useToggle } from '@/hooks';
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { use } from 'i18next';
import { useForm } from '@/hooks/useForm';
import { useDispatch } from 'react-redux';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { useOptionsStore } from '@/hooks/useOptionsStore';
import Select from 'react-select';
import { ModalProveedor } from './ModalProveedor';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Link } from 'react-router-dom';
import { FilterMatchMode } from 'primereact/api';
import { TabPanel, TabView } from 'primereact/tabview';
import { CustomersProv } from './CustomersProv';
import { SelectButton } from 'primereact/selectbutton';

const ESTADOS = [
  { label: 'ACTIVOS', value: true },
  { label: 'INACTIVOS', value: false },
];

export const DataProveedores = ({id_estado}) => {
  const [isModalOpenProv, setisModalOpenProv] = useState(false);
  const [idProv, setidProv] = useState(0);
  const [estado, setEstado] = useState(true); // true = ACTIVO, false = INACTIVO

  const modalProvClose = () => setisModalOpenProv(false);
  const modalProvOpen = () => setisModalOpenProv(true);
  const onOpenModalProvOpen=(id)=>{
    modalProvOpen()
    setidProv(id)
  }
  // plantilla visual para que cada botón sea bloque sólido
  const estadoTemplate = (option) => (
    <div className="estado-btn">{option.label}</div>
  );

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

              <TabView>
                <TabPanel header={'PROVEEDORES'}>
                  <TabView>
                    <TabPanel header={'CHANGE'}>
                      <CustomersProv onOpenModalProvOpen={onOpenModalProvOpen} estado_prov={id_estado} agente={true} id_empresa={598} />
                    </TabPanel>

                    <TabPanel header={'CIRCUS'}>
                      <CustomersProv estado_prov={id_estado} agente={true} id_empresa={601} />
                    </TabPanel>
                    <TabPanel header={'REDUCTO'}>
                      <CustomersProv estado_prov={id_estado} agente={true} id_empresa={599} />
                    </TabPanel>
                                        <TabPanel header={'RAL'}>
                      {/* {estado ? (
                        <CustomersProv estado_prov={true}  agente={true} id_empresa={0} />
                      ) : (
                      )} */}
                      <CustomersProv estado_prov={id_estado} agente={true} id_empresa={0} />
                    </TabPanel>
                  </TabView>
                </TabPanel>
              </TabView>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ModalProveedor show={isModalOpenProv} id={idProv} onHide={modalProvClose} />
    </>
  );
};