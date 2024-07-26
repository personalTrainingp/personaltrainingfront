import { DateMask, FormatoDateMask, FUNMoneyFormatter } from '@/components/CurrencyMask';
import { useVentasStore } from '@/hooks/hookApi/useVentasStore';
import { useForm } from '@/hooks/useForm'
import { arrayCategoriaProducto, arrayFacturas, arrayOrigenDeCliente } from '@/types/type';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { TabPanel, TabView } from 'primereact/tabview';
import React, { useEffect } from 'react'
import { Modal, Tab, Table, Tabs } from 'react-bootstrap'
import { classNames } from 'primereact/utils';
import { TimelineItem } from '@/components';
import { Link } from 'react-router-dom';

export const ModalViewObservacion = ({onHide, show, data, id}) => {
    // console.log(data);
    const closeModal = ()=>{
        onHide();
    }
    const { obtenerVentaporId, dataVentaxID, isLoading } = useVentasStore()
    console.log(dataVentaxID);
    useEffect(() => {
        if(id==0)return;
        obtenerVentaporId(id)
    }, [id])
    useEffect(() => {
      if(id!=0)return;
    }, [id])
    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={closeModal} />
        </React.Fragment>
    );
  return (
    <Dialog visible={show} style={{ width: '40rem', height: '80rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`Venta #${id}`} modal className="p-fluid" footer={productDialogFooter} onHide={closeModal}>
        {
            isLoading ?'Cargando...': 

            <TabView>
                <TabPanel header="Informacion de venta">
                <ul className='list-none'>
                    <li className='mb-4'>
                        <span>Asesor: </span>
                        <span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>{dataVentaxID[0]?.tb_empleado?.nombres_apellidos_empl}</span>
                    </li>
                    <li className='mb-4'>
                        <span>Cliente: </span>
                        <span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>{dataVentaxID[0]?.tb_cliente?.nombres_apellidos_cli}</span>
                    </li>
                    <li className='mb-4'>
                        <span>Procedencia: </span>
                        <span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>{arrayOrigenDeCliente.find(e=>e.value===dataVentaxID[0]?.id_origen)?.label}</span>
                    </li>
                    <li className='mb-4'>
                        <span>{arrayFacturas.find(e=>e.value===dataVentaxID[0]?.id_tipoFactura)?.label}</span>
                        <span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>{dataVentaxID[0]?.numero_transac}</span>
                    </li>
                    <li className='mb-4'>
                        <span>Fecha en la que realizo la venta:</span>
                        <span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>{FormatoDateMask(dataVentaxID[0]?.fecha_venta, 'D [de] MMMM [de] YYYY')}</span>
                    </li>
                    <li className='mb-4'>
                        <span>Observacion:</span>
                        <span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>{dataVentaxID[0]?.observacion}</span>
                    </li>
                    </ul>
                </TabPanel>
                <TabPanel    Panel header="Compras">
                    {
                        dataVentaxID[0]?.detalle_ventaMembresia.length>0 && (
                            <>
                            <b className='text-800'>MEMBRESIA: </b>
                            </>
                        )
                    }
                    {
                        dataVentaxID[0]?.detalle_ventaMembresia.length>0 && (
                            dataVentaxID[0]?.detalle_ventaMembresia.map(e=>(
                                <>
                                <div className="col-12">
                                    <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-0 gap-4')}>
                                        <div className="flex flex-row sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                            <div className="flex flex-column sm:align-items-start gap-3">
                                                <div className="text-2xl font-bold text-800">{e.tb_ProgramaTraining.name_pgm} / {e.tb_semana_training.semanas_st} SEMANAS</div>
                                                <div className="flex gap-2">
                                                    <span className="flex align-items-center gap-2">
                                                        <i className="pi pi-tag"></i>
                                                        <span className="font-semibold">{}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                                <span className="text-2xl font-semibold">
                                                    PEN {e.tarifa_monto}
                                                    </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                </>
                            ))
                        )
                    }
                    {
                        dataVentaxID[0]?.detalle_ventaProductos.length>0 && (
                            <>
                            <div className="text-2xl font-bold text-800">
                                PRODUCTOS:
                            </div>
                            </>
                        )
                    }
                    {
                        dataVentaxID[0]?.detalle_ventaProductos.length>0 && (
                            dataVentaxID[0]?.detalle_ventaProductos.map(e=>(
                                <>
                                
				<Table responsive hover className="table-centered table-nowrap mb-0">
					<tbody>
						<tr>
							<td>
								<h5 className="font-14 my-1">
									<Link to="" className="text-body">
                                    {e.tb_producto.nombre_producto}
									</Link>
								</h5>
								<span className="text-muted font-13">TIPO: {arrayCategoriaProducto.find(i=>i.value===e.tb_producto.id_categoria)?.label}</span>
							</td>
							<td>
								<span className="text-muted font-13">CANTIDAD</span> <br />
								<span className="font-14 mt-1 fw-normal">{e.cantidad}</span>
							</td>
							<td>
                                <span className="text-muted font-13">MONTO</span> <br />
                                <span className="font-14 mt-1 fw-normal">{FUNMoneyFormatter(e.tarifa_monto)}</span>
							</td>
						</tr>
					</tbody>
				</Table>
                                {/* <div className="col-12">
                                    <div className={classNames('flex flex-column xl:flex-row xl:align-items-start p-0 gap-4')}>
                                        <div className="flex flex-row sm:flex-row justify-content-between align-items-center xl:align-items-start flex-1 gap-4">
                                            <div className="flex flex-column sm:align-items-start gap-3">
                                                <b className='text-800'>
                                                    {e.tb_producto.nombre_producto}
                                                </b>
                                                <div className="flex gap-2">
                                                    <span className="flex align-items-center gap-2">
                                                        <i className="pi pi-tag"></i>
                                                        <span className="font-semibold">{arrayCategoriaProducto.find(i=>i.value===e.tb_producto.id_categoria)?.label}</span>
                                                    </span>
                                                    <span className="flex align-items-center gap-2">
                                                        <span className="font-semibold">
                                                            Cantidad: {e.cantidad}</span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex sm:flex-column align-items-center sm:align-items-end gap-3 sm:gap-2">
                                                <span className="text-2xl font-semibold">
                                                    PEN {e.tarifa_monto}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                                </>
                            ))
                        )
                    }
                    {
                        dataVentaxID[0]?.detalle_ventaCitas.length>0 && (
                            <>
                            <b className='text-800'>Citas: </b>
                            </>
                        )
                    }
                    {
                        dataVentaxID[0]?.detalle_ventaCitas.length>0 && (
                            <>
                            
                            </>
                        )
                    }
                </TabPanel>
                <TabPanel header="Pagos">
                                <div className="timeline-item-info border border-4 p-2 border-gray">
                                    <h4 to="" className="fw-bold mb-1 d-block">
                                        | FORMA DE PAGO: IZIPAY || TIPO DE TARJETA: CREDITO || BANCO: INTERBANK || TARJETA: INTERBANK |
                                    </h4>
                                    <small>
                                        FECHA DE PAGO: 
                                        <span className="fw-bold"> 25 DE JUNIO DE 2024</span>
                                    </small>
                                    <br/>
                                    <small>
                                        N° OPERACION: 
                                        <span className="fw-bold"> 00000</span>
                                    </small>
                                    <p className="mb-0 pb-2">
                                        <small className="text-muted"></small>
                                    </p>
                                </div>
                </TabPanel>
            </TabView>
        }
    </Dialog>
  )
}
