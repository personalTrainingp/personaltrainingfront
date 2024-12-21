import { PageBreadcrumb, Table } from '@/components';
import React, { useEffect, useState } from 'react'
import {Card, Col, Row } from 'react-bootstrap';
import { columns, sizePerPageList } from './ColumnsSet';
import { ModalCliente } from './ModalCliente';
import { useSelector } from 'react-redux';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';
import { Button } from 'primereact/button';
import { useProspectoLeadsStore } from '@/hooks/hookApi/useProspectoLeadsStore';
import { TabPanel, TabView } from 'primereact/tabview';
import { Calendar } from 'primereact/calendar';
import { useForm } from '@/hooks/useForm';
import TableNoClientes from './TableNoClientes';

const rangoFechas = {
  rangoDate:new Date(),
  id_programa: 0
}
export const GestComercial = () => {
  const { formState, rangoDate, id_programa, onInputChange, onInputChangeReact, onResetForm } = useForm(rangoFechas)
    const [showModalCliente, setshowModalCliente] = useState(false)
    // const  { obtenerProspectosLeads } = useProspectoLeadsStore()
	// const { dataView } = useSelector(e=>e.DATA)
	
    const  { obtenerProspectosLeads } = useProspectoLeadsStore()
	const { dataView } = useSelector(e=>e.DATA)
    useEffect(() => {
      if(dataView.length<=0){
        obtenerProspectosLeads()
      }
    }, [])
    const onModalRegClienteOpen=()=>{
        setshowModalCliente(true)
    }
    const  onModalRegClienteClose =()=>{
        setshowModalCliente(false)
    }
	
  return (
    <>
    			<PageBreadcrumb title="GESTION COMERCIAL" subName="E-commerce" />
                
			<Row>
				<Col xs={12}>
							<Row className="mb-2">
								<Col sm={5}>
									<Button label='Agregar' icon={'mdi mdi-plus-circle'} onClick={onModalRegClienteOpen}/>
								</Col>
							</Row>
					<Card>
						<Card.Body>
							<TabView>
								{
									agruparPorEstados(dataView).map(d=>(
										<TabPanel header={d.label_estado}>
                      <Col lg={12}>
                          <div className="flex-auto">
                            <label htmlFor="buttondisplay" className="font-bold block mb-2">
                                MES
                            </label>
                            <Calendar id="buttondisplay"
                      view="month"
                      locale='es'
                      value={rangoDate}
                      name="rangoDate"
                      dateFormat="MM/yy"
                      onChange={onInputChange}
                      showIcon
                      readOnlyInput />
                          </div>
                          </Col>
											<TableNoClientes dataV={d.items}/>
										</TabPanel>
									))
								}
							</TabView>
						</Card.Body>
					</Card>
				</Col>
            <ModalCliente show={showModalCliente} onHide={onModalRegClienteClose}/>
			</Row>
    </>
  )
}


// Función para agrupar por label_canal
const agruparPorEstados = (data) => {
    return data.reduce((result, item) => {
      const labelEstado = item.parametro_estado_lead?.label_param;
      
      // Encuentra el canal en el resultado
      let canal = result.find(group => group.label_estado === labelEstado);
      
      // Si no existe, lo crea
      if (!canal) {
        canal = { label_estado: labelEstado, items: [] };
        result.push(canal);
      }
      
      // Agrega el item al canal correspondiente
      canal.items.push(item);
      
      return result;
    }, []);
  };
