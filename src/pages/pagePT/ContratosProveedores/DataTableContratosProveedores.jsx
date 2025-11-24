import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect, useState } from 'react'
import { useContratosProveedores } from './useContratosProveedores';
import config from '@/config';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { confirmDialog } from 'primereact/confirmdialog';
import { useSelector } from 'react-redux';
import { ModalIframe } from './ModalIframe';
import { Badge } from 'react-bootstrap';
import { TerminosOnShow } from '@/hooks/usePropiedadesStore';
import { recortarTexto } from '@/helper/recortarTexto';
import dayjs from 'dayjs';

export const DataTableContratosProveedores = ({id_empresa, onOpenModalCustomContratosProv}) => {
    const [isOpenModalIframe, setisOpenModalIframe] = useState({isOpen: false, url: ''})
    const { dataEstadoContrato } = TerminosOnShow(true)
    const onOpenModalIframe = (url)=>{
        setisOpenModalIframe({url, isOpen: true})
    }
    const onCloseModalIframe = ()=>{
        setisOpenModalIframe({isOpen: false, url: ''})
    }
        const columns = [
    { id: 'id', header: 'ID', accessor: 'id', sortable: true, render: (row)=>{
        return (
            <div style={{width: '70px'}}>
                {row.id}
            </div>
        )
    } },
    { id: 'observacion', header: 'Observacion', render: (row)=>{
        return (
            <div style={{width: '400px'}}>
                {recortarTexto(row.observacion, 25, '...')}
            </div>
        )
    } },
    { id: 'fecha_inicio', header: 'FECHA DE INICIO', render: (row)=>{
        return (
            <>
            {
                dayjs(row.fecha_inicio).format('dddd DD [DE] MMMM [DEL] YYYY')
            }
            </>
        )
    } },
    { id: 'fecha_fin', header: 'FECHA DE FIN', render: (row)=>{
        return (
            <>
            {
                dayjs(row.fecha_fin).format('dddd DD [DE] MMMM [DEL] YYYY')
            }
            </>
        )
    }  },
    { id: 'monto_contrato', header: <div className='text-center'>MANO DE OBRA <br/> soles</div>, sortable: true, accessor: 'monto_contrato',  render: (row)=>{
        return (
            <>
            <NumberFormatMoney
                amount=
                {row?.monto_contrato}
            />
            </>
        )
    }},
    { id: 'mano_obra_dolares', header: <div className='text-center'>MANO DE OBRA <br/> DOLARES</div>, render: (row)=>{
        return (
            <>
            <NumberFormatMoney
                amount=
                {row?.mano_obra_dolares}
            />
            </>
        )
    } },
    { id: 'estado_contrato', header: 'ESTADO', render: (row)=>{
        return (
            <>
            <Badge bg={dataEstadoContrato.find(e=>e.value===row.estado_contrato)?.severity}>{dataEstadoContrato.find(e=>e.value===row.estado_contrato)?.label}</Badge>
            </>
        )
    } },
    { id: 'pdfContrato', header: 'contrato', sortable: true, width: 70,  render: (row)=>{
        return (
            <>
            {
                row.contratoProv && (
                    <a href={`${config.API_IMG.FILES_CONTRATO_PROV}${row.contratoProv?.name_image}`}>
                        <i className='pi pi-file-pdf' style={{ fontSize: '80px' }}></i>
                    </a>
                )
            }
            </>
        )
    } },
    
    { id: 'pdfCompromiso', header: 'compromiso pago', sortable: true, width: 70,  render: (row)=>{
        return (
            <>
            {
                row?.compromisoPago && (
                    <a href={`${config.API_IMG.FILES_COMPROMISO_PAGO_PROV}${row?.compromisoPago?.name_image}`}>
                        <i className='pi pi-file-pdf' style={{ fontSize: '80px' }}></i>
                    </a>
                )
            }
            </>
        )
    } },

    { id: 'penalidad', header: 'MONTO PENALIDAD', sortable: true, width: 70, headerAlign: 'right', cellAlign: 'right', render: (row)=>{
        return (
            <>
            <NumberFormatMoney
                amount=
                {row?.provPenalidad?.reduce((total, item) => total + (item?.monto || 0), 0)}
            />
            </>
        )
    } },
    { id: 'razon_social', header: 'razon social',  render: (row)=>{
        return (
            <>
            {row?.prov?.id} | {row?.prov?.razon_social_prov}
            </>
        )
    } },
    
    {
        id: 'zona', header: 'zona', render: (row)=>{
        return (
            <>
            <div className='' style={{width: '100px'}}>
                {row?.zona?.nombre_zona}
            </div>
            </>
        )
    } 
    },
    { id: 'abono', header: 'ABONO', sortable: true, width: 70, headerAlign: 'right', cellAlign: 'right', render: (row)=>{
        return (
            <>
            <NumberFormatMoney
                amount=
            {row?.gasto?.reduce((total, item) => total + (item?.monto || 0), 0)}
            />
            </>
        )
    }  },
    
    { id: 'accion', header: '', sortable: true, width: 70, headerAlign: 'right', cellAlign: 'right', render: (row)=>{
        return (
            <>
            <i className='pi pi-pencil p-2 border border-2 border-black my-2 '  onClick={()=>onClickEditContratoProv(row?.id)}></i>
            <i className='pi pi-trash p-2 border border-2 border-black my-2' onClick={()=>onClickDeleteContratoProv(row?.id)}></i>
            </>
        )
    }  },
  ];
  const { obtenerContratosProveedores, onDeleteContratosProveedoresxID } = useContratosProveedores()
	const { dataView } = useSelector((e) => e.CONTRATOPROV);
    useEffect(() => {
        obtenerContratosProveedores(id_empresa)
    }, [id_empresa])
    const onClickDeleteContratoProv= (id)=>{
        confirmDialog({
            message: 'Estas seguro',
            accept: ()=>{
                onDeleteContratosProveedoresxID(id, id_empresa)
            }
        })
    }
    const onClickEditContratoProv = (id)=>{
        onOpenModalCustomContratosProv(id)
    }
  
  return (
    <>
        <DataTableCR
            data={dataView}
            columns={columns}
            responsive={true}
            
        />
        <ModalIframe onHide={onCloseModalIframe}  show={isOpenModalIframe.isOpen} url={isOpenModalIframe.url}/>
    </>
  )
}
