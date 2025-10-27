import { Row, Col, Card,  Modal } from 'react-bootstrap';
import { Table, PageBreadcrumb } from '@/components';
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
import { App } from './PagosProveedores/App';
import { SelectButton } from 'primereact/selectbutton';

const ESTADOS = [
  { label: 'ACTIVOS', value: true },
  { label: 'INACTIVOS', value: false },
];

export const DataProveedores = ({id_estado}) => {
  const [isModalOpenProv, setisModalOpenProv] = useState(false);
  const [estado, setEstado] = useState(true); // true = ACTIVO, false = INACTIVO

  const modalProvClose = () => setisModalOpenProv(false);
  const modalProvOpen = () => setisModalOpenProv(true);

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
                  <Button label="Agregar proveedor" onClick={modalProvOpen} />
                </Col>
              </Row>

              <TabView>
                <TabPanel header={'PROVEEDORES'}>
                  <TabView>
                    <TabPanel header={'CHANGE'}>
                      {/* ⬇️ Botones ACTIVO/INACTIVO */}
                      <div className={`estado-select ${estado ? 'activo' : 'inactivo'} mb-3`}>
                        <SelectButton
                          value={estado}
                          onChange={(e) => setEstado(e.value)}
                          options={ESTADOS}
                          itemTemplate={estadoTemplate}
                        />
                      </div>

                      {/* Render según botón */}
                      {/* {estado ? (
                        <CustomersProv estado_prov={id_estado}  agente={true} id_empresa={598} />
                      ) : (
                      )} */}
                      <CustomersProv estado_prov={id_estado} agente={true} id_empresa={598} />
                    </TabPanel>

                    <TabPanel header={'CIRCUS'}>
                      <div className={`estado-select ${estado ? 'activo' : 'inactivo'} mb-3`}>
                        <SelectButton
                          value={estado}
                          onChange={(e) => setEstado(e.value)}
                          options={ESTADOS}
                          itemTemplate={estadoTemplate}
                        />
                      </div>

                      {/* {estado ? (
                        <CustomersProv estado_prov={id_estado}  agente={true} id_empresa={601} />
                      ) : (
                      )} */}
                      <CustomersProv estado_prov={id_estado} agente={true} id_empresa={601} />
                    </TabPanel>

                    <TabPanel header={'REDUCTO'}>
                      <div className={`estado-select ${estado ? 'activo' : 'inactivo'} mb-3`}>
                        <SelectButton
                          value={estado}
                          onChange={(e) => setEstado(e.value)}
                          options={ESTADOS}
                          itemTemplate={estadoTemplate}
                        />
                      </div>

                      {/* {estado ? (
                        <CustomersProv estado_prov={true}  agente={true} id_empresa={599} />
                      ) : (
                      )} */}
                      <CustomersProv estado_prov={id_estado} agente={true} id_empresa={599} />
                    </TabPanel>
                                        <TabPanel header={'RAL'}>
                      <div className={`estado-select ${estado ? 'activo' : 'inactivo'} mb-3`}>
                        <SelectButton
                          value={estado}
                          onChange={(e) => setEstado(e.value)}
                          options={ESTADOS}
                          itemTemplate={estadoTemplate}
                        />
                      </div>

                      {/* {estado ? (
                        <CustomersProv estado_prov={true}  agente={true} id_empresa={0} />
                      ) : (
                      )} */}
                      <CustomersProv estado_prov={id_estado} agente={true} id_empresa={0} />
                    </TabPanel>
                  </TabView>
                </TabPanel>
                

                <TabPanel header={'CONTRATOS POR PROVEEDOR'}>
                  <TabView>
                    <TabPanel header={<div className='fs-1'>CHANGE</div>}>
                      <App id_empresa={598} bgEmpresa='bg-change' classNameTablePrincipal='bg-change p-2' />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1 text-circus'>CIRCUS</div>}>
                      <App id_empresa={601} bgEmpresa='bg-circus' classNameTablePrincipal='bg-circus p-2' />
                    </TabPanel>
                    <TabPanel header={<div className='fs-1 text-ISESAC'>REDUCTO</div>}>
                      <App id_empresa={599} bgEmpresa='bg-greenISESAC' classNameTablePrincipal='bg-greenISESAC p-2' />
                    </TabPanel>
                  </TabView>
                </TabPanel>
              </TabView>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ModalProveedor show={isModalOpenProv} onHide={modalProvClose} />
    </>
  );
};