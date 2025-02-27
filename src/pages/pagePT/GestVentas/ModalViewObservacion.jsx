import { DateMask, FormatoDateMask, FUNMoneyFormatter, MoneyFormatter } from '@/components/CurrencyMask';
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
import React, { useEffect, useState } from 'react'
import { Modal, Tab, Table, Tabs } from 'react-bootstrap'
import { classNames } from 'primereact/utils';
import { TimelineItem } from '@/components';
import { Link } from 'react-router-dom';
import { ItemVentaMembresia } from '@/components/ItemsResumenVenta/ItemVentaMembresia';
import { ItemVentaTransferenciaMembresia } from '@/components/ItemsResumenVenta/ItemVentaTransferenciaMembresia';
import Select from 'react-select'
import { useGestVentasStore } from './useGestVentasStore';
export const ModalViewObservacion = ({onHide, show, data, id}) => {
    // console.log(data);
    const closeModal = ()=>{
        onHide();
    }
    const { obtenerVentaporId, dataVentaxID, isLoading } = useVentasStore()
    const { putVentas } = useGestVentasStore()
    const [isProcedenciaCustom, setisProcedenciaCustom] = useState(false)
    const [formOrigen, setformOrigen] = useState({
        id_origen: dataVentaxID[0]?.id_origen,
      })
      const handleChange = (e, name) => {
        setformOrigen({ ...formOrigen, [name]: e.value });
      };
    useEffect(() => {
        if(id==0)return;
        obtenerVentaporId(id)
    }, [id])
    useEffect(() => {
      if(id!=0)return;
    }, [id])
    const productDialogFooter = (
        <React.Fragment>
            <Button className='float-left' label="GENERAR PDF" icon="pi pi-file-pdf fs-3" outlined onClick={closeModal} />
            <Button label="Cancel" icon="pi pi-times" outlined onClick={closeModal} />
        </React.Fragment>
    );
    const onCustomProcedencia = ()=>{
        setisProcedenciaCustom(true)
    }
    const onCloseCustomProcedencia = ()=>{
        setisProcedenciaCustom(false)
    }
    const onSubmitCustomProcedencia = ()=>{
        putVentas(formOrigen.id_origen, dataVentaxID[0].id, obtenerVentaporId)
        onCloseCustomProcedencia()
    }
  return (
    <Dialog visible={show} style={{ width: '50rem', height: '80rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={`Venta #${id}`} modal className="p-fluid" footer={productDialogFooter} onHide={closeModal}>
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
                        <span>Socio: </span>
                        <span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>{dataVentaxID[0]?.tb_cliente?.nombres_apellidos_cli}</span>
                    </li>
                    <li className='mb-4'>
                        <span>Procedencia: </span>
                        <span className='d-flex align-items-center' style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>
                            {
                                isProcedenciaCustom?(
                                    <>
                                        <Select
                                            onChange={(e)=>handleChange(e, 'id_origen')}
                                            name={"id_origen"}
                                            placeholder={'Seleccionar el origen'}
                                            className="react-select"
                                            classNamePrefix="react-select"
                                            options={arrayOrigenDeCliente}
                                            value={arrayOrigenDeCliente.find(
                                                (option) => option.value === formOrigen
                                            )}
                                            //   defaultValue={optionsAlmacenProd[id_almacen]}
                                            required
                                        ></Select>
                                    <i className='pi pi-check hover-text cursor-pointer ml-4' onClick={onSubmitCustomProcedencia}></i>
                                    <i className='pi pi-times hover-text cursor-pointer ml-4' onClick={onCloseCustomProcedencia}></i>
                                    </>
                                ):(
                                    <>
                                    {arrayOrigenDeCliente.find(e=>e.value===dataVentaxID[0]?.id_origen)?.label} 
                                    <i className='pi pi-pencil hover-text cursor-pointer ml-4' onClick={onCustomProcedencia}></i>
                                    </>
                                )
                            }
                        </span>
                    </li>
                    <li className='mb-4'>
                        <span>{arrayFacturas.find(e=>e.value===dataVentaxID[0]?.id_tipoFactura)?.label}</span>
                        <span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>{dataVentaxID[0]?.numero_transac}</span>
                    </li>
                    <li className='mb-4'>
                        <span>Fecha en la que realizo la venta:</span>
                        <span style={{textAlign: 'left', float: 'right', paddingRight: '40px'}}>{FormatoDateMask(dataVentaxID[0]?.fecha_venta, 'D [de] MMMM [del] YYYY')}</span>
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
                            dataVentaxID[0]?.detalle_ventaMembresia.map(e=>{
                                return(
                                    <>
                                        <ItemVentaMembresia e={e}/>
                                    </>
                                )
})
                        )
                    }
                    {
                        dataVentaxID[0]?.detalle_ventaTransferencia?.length>0 && (
                            <>
                            <div className="text-2xl font-bold text-800">
                                TRANSFERENCIAS:
                            </div>
                            </>
                        )
                    }
                    {
                        dataVentaxID[0]?.detalle_ventaTransferencia?.length>0 && (
                            dataVentaxID[0]?.detalle_ventaTransferencia.map(e=>{
                                return(
                                    <>
                                        <ItemVentaTransferenciaMembresia e={e}/>
                                    </>
                                )
                            })
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
                                                    {e.tb_producto?.nombre_producto}
                                                    </Link>
                                                </h5>
                                                <span className="text-muted font-13">TIPO: {arrayCategoriaProducto.find(i=>i.value===e.tb_producto?.id_categoria)?.label}</span>
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
                                                    {e.tb_producto?.nombre_producto}
                                                    </Link>
                                                </h5>
                                                <span className="text-muted font-13">TIPO: {arrayCategoriaProducto.find(i=>i.value===e.tb_producto?.id_categoria)?.label}</span>
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
                        // dataVentaxID[0]?.detalle_ventaCitas.length>0 && (
                        //     <>
                        //             <div className="container">
                        //                 <div className="row">
                        //                     <div className="col-lg-12 bg-white rounded shadow-sm mb-5">
                        //                         <div className="table-responsive">
                        //                             <table className="table">
                        //                                 <thead>
                        //                                     <tr>
                        //                                         <th scope="col" className="border-0 bg-light p-1">
                        //                                             <div className="p-0 px-3 text-uppercase">CITA</div>
                        //                                         </th>
                        //                                         <th scope="col" className="border-0 bg-light p-1">
                        //                                             <div className="py-0 text-uppercase">PRECIO</div>
                        //                                         </th>
                        //                                         <th scope="col" className="border-0 bg-light p-1">
                        //                                             <div className="py-0 text-uppercase">CONTRATO</div>
                        //                                         </th>
                        //                                     </tr>
                        //                                 </thead>
                        //                                 <tbody>
                        //                                     <tr>
                        //                                         <td className="border-0">
                        //                                         <a
                        //                                                             href="#"
                        //                                                             className="text-dark d-inline-block"
                        //                                                         >
                        //                                                             {e?.tb_ProgramaTraining.name_pgm} | {e?.tb_semana_training.semanas_st} SEMANAS
                        //                                                         </a>
                        //                                         </td>
                        //                                         <td className="border-0">
                        //                                                 {<MoneyFormatter amount={e.tarifa_monto} />}
                        //                                         </td>
                        //                                         <td className="border-0">
                        //                                             <a style={{color: 'blue', textDecoration: 'underline', cursor: 'pointer', fontSize: '15px'}}>CONTRATO</a>
                        //                                         {/* <i className='mdi mdi-file-document fs-4' style={{cursor: 'pointer'}}></i> */}
                        //                                             {/* <h5 className='fs-3' style={{cursor: 'pointer'}}></h5> */}
                        //                                         </td>
                        //                                     </tr>
                        //                                 </tbody>
                        //                             </table>
                        //                         </div>
                        //                     </div>
                        //                 </div>
                        //             </div>
                        //         </>
                        // )
                    }
                </TabPanel>
                <TabPanel header="Pagos">
                    {
                        dataVentaxID[0]?.detalleVenta_pagoVenta.length>0 && (
                            dataVentaxID[0]?.detalleVenta_pagoVenta.map(e=>(
                                <>
                                <div className="timeline-item-info border border-4 p-2 border-gray">
                                        <h4 to="" className="fw-bold mb-1 d-block">
                                            | FORMA DE PAGO: {e.parametro_forma_pago?.label_param} 
                                            {e.parametro_tipo_tarjeta?`|| TIPO DE TARJETA: ${e.parametro_tipo_tarjeta.label_param}` :''} 
                                            {e.parametro_banco?`|| BANCO: ${e.parametro_banco.label_param}`:''} 
                                            {e.parametro_tarjeta?`|| TARJETA: ${e.parametro_tarjeta.label_param}`:''} |
                                        </h4>
                                        <small>
                                            MONTO PARCIAL: 
                                            <span className="fw-bold"> {FUNMoneyFormatter(e.parcial_monto, e.parametro_forma_pago?.id_param==535?'$':'S/.')}</span>
                                        </small>
                                        <br/>
                                        <small>
                                            FECHA DE PAGO: 
                                            <span className="fw-bold"> {DateMask({date: e.fecha_pago, format: 'D [de] MMMM [del] YYYY [a las] h:mm A'})}</span>
                                        </small>
                                        <br/>
                                        <small>
                                            N° OPERACION: 
                                            <span className="fw-bold"> {e.n_operacion}</span>
                                        </small>
                                        <p className="mb-0 pb-2">
                                            <small className="text-muted">{e.observacion}</small>
                                        </p>
                                    </div>
                                </>
                            ))
                        )
                    }
                </TabPanel>
            </TabView>
        }
    </Dialog>
  )
}


/* */