import { DateMask, FormatoDateMask, MoneyFormatter } from '@/components/CurrencyMask';
import React, { useState } from 'react'
import { OverlayTrigger, Table, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ModalFirma } from './ModalFirma';
import { useSelector } from 'react-redux';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { PdfContrato } from '../pdfs/PdfContrato';
import { useDispatch } from 'react-redux';
import { onDeleteAllPrograma } from '@/store/uiNuevaVenta/uiNuevaVenta';
import { useVentasStore } from '../../../hooks/hookApi/useVentasStore';

export const ResumenVentaMembresia = ({dataVenta, detalle_cli_modelo}) => {
    console.log(dataVenta);
    const dispatch = useDispatch()
	const [modalFirma, setmodalFirma] = useState(false)
    const { obtenerPDFCONTRATOgenerado } = useVentasStore()
    const modalOpenFirma = ()=>{
        setmodalFirma(true)
    }
    const modalCloseFirma = ()=>{
        setmodalFirma(false)
    }
    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" className='tooltip-firma' {...props}>
            <img src={dataVenta.firmaCli} width={100} height={50}/>
        </Tooltip>
      );
      const deleteMembresia = () =>{
        dispatch(onDeleteAllPrograma())
      }
      const testClick = () =>{
        console.log("hace click");
    }
    const descargarPDFgenerado = () =>{
        obtenerPDFCONTRATOgenerado({dataVenta})
      }
  return (
    <Table responsive hover className="table-centered table-nowrap mb-0">
    <tbody>
        <tr>
            <td>
                <h5 className="font-14 my-1">
                    <Link to="" className="text-body">
                        {dataVenta.name_pgm} - {dataVenta.semanas} Semanas
                    </Link>
                </h5>
                <span className="text-muted font-13">Inicia: {FormatoDateMask(dataVenta.fechaInicio_programa, 'D [de] MMMM [de] YYYY')} a las {dataVenta.time_h} </span>
                <br/>
                <span className="text-muted font-13">Finaliza: {FormatoDateMask(dataVenta.fechaFinal, 'D [de] MMMM [de] YYYY')} </span>
            </td> 
            <td onClick={testClick}>
                <span className="text-muted font-13">Tarifa: </span> <br />
                <span>{<MoneyFormatter amount={dataVenta.tarifa}/>}</span>
            </td>
            <td>
            <OverlayTrigger
                placement="top"
                delay={{ show: 250, hide: 250 }}
                overlay={renderTooltip}
                >
                <a style={{cursor: 'pointer', color: 'blue'}} onClick={modalOpenFirma} className="font-14 mt-1 fw-normal">{dataVenta.firmaCli?'Con firma':'Sin firma'}</a>
                </OverlayTrigger>
                <ModalFirma show={modalFirma} onHide={modalCloseFirma} dataFirma={dataVenta.firmaCli}/>
            </td>
            <td>
                <span className="text-muted font-13">Contrato</span>
                    <h5 className='d-flex justify-content-center font-20' onClick={descargarPDFgenerado} style={{cursor: 'pointer'}}><i className='mdi mdi-file'></i></h5>
            </td>
            <td className="table-action" style={{ width: '90px' }}>
                <Link onClick={deleteMembresia} className="action-icon">
                    <i className="mdi mdi-delete"></i>
                </Link>
            </td>
        </tr>
    </tbody>
</Table>
  )
}
