import { PageBreadcrumb } from '@/components';
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
    			<PageBreadcrumb title="GESTION DE RESERVAS MONKEY FIT" subName="E-commerce" />
                
			<Row>
				<Col xs={12}>
							<Row className="mb-2">
								<Col sm={5}>
									<Button label='Agregar reservas' icon={'mdi mdi-plus-circle'} onClick={onModalRegClienteOpen}/>
								</Col>
							</Row>
					<Card>
						<Card.Body>
							<TabView>
                
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
