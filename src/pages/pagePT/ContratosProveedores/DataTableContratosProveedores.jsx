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
import { ButtonCopy } from './ButtonCopy';
import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';

export const DataTableContratosProveedores = ({id_empresa, onOpenModalCustomContratosProv}) => {
    const [isOpenModalIframe, setisOpenModalIframe] = useState({isOpen: false, url: ''})
    const { dataEstadoContrato } = TerminosOnShow(true)
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
    { id: 'razon_social', header: 'razon social', accessor: 'row?.prov?.razon_social_prov',  render: (row)=>{
        return (
            <>
            {row?.prov?.id} | {row?.prov?.razon_social_prov}
            </>
        )
    } },
    { id: 'observacion', header: 'Conceptos', accessor: 'observacion', render: (row)=>{
        return (
            <div style={{width: '400px'}}>
                {recortarTexto(row.observacion, 25, '...')}<ButtonCopy text={row.observacion}/>
            </div>
        )
    } },
    { id: 'fecha_inicio', header: 'FECHA INICIO', render: (row)=>{
        return (
            <>
            {
                dayjs(row.fecha_inicio).format('dddd DD [DE] MMMM [DEL] YYYY')
            }
            </>
        )
    } },
    { id: 'fecha_fin', header: 'FECHA FIN', render: (row)=>{
        return (
            <>
            {
                dayjs(row.fecha_fin).format('dddd DD [DE] MMMM [DEL] YYYY')
            }
            </>
        )
    }  },
    { id: 'compra_activos', header: <div className='text-center'>COMPRA <br/> ACTIVOS</div>, sortable: true, accessor: 'compra_activos',  render: (row)=>{
        return (
            <div className={row?.tipo_moneda === 'PEN'?'':'text-ISESAC fw-bold'}>
                                    {row?.tipo_moneda === 'PEN' ? <SymbolSoles fontSizeS={'font-15'}/> : <SymbolDolar fontSizeS={'font-15'}/>}
            <NumberFormatMoney
                amount=
                {row?.mano_obra_soles}
            />
            </div>
        )
    }},
    { id: 'monto_contrato', header: <div className='text-center'>MANO OBRA <br/> soles</div>, sortable: true, accessor: 'monto_contrato',  render: (row)=>{
        return (
            <>
            <NumberFormatMoney
                amount=
                {row?.monto_contrato}
            />
            </>
        )
    }},
    { id: 'mano_obra_dolares', header: <div className='text-center'>MANO OBRA <br/> DOLARES</div>, render: (row)=>{
        return (
            <>
            <NumberFormatMoney
                amount=
                {row?.mano_obra_dolares}
            />
            </>
        )
    } },
    { id: 'estado_contrato', header: 'ESTADO', accessor: 'estado_contrato', render: (row)=>{
        return (
            <>
            <div className={`${dataEstadoContrato.find(e=>e.value===row.estado_contrato)?.bg} d-flex justify-content-center align-items-center text-white p-1 fs-2`}>
                {dataEstadoContrato.find(e=>e.value===row.estado_contrato)?.label}
            </div>
            </>
        )
    } },
    
    { id: 'pdfCompromiso', header: <>COMPROMISO <br/> pago / LETRA</>, sortable: true, width: 70,  render: (row)=>{
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

    { id: 'penalidad', header: 'PENALIDAD', sortable: true, width: 70, headerAlign: 'right', cellAlign: 'right', render: (row)=>{
        return (
            <>
            <NumberFormatMoney
                amount=
                {row?.provPenalidad?.reduce((total, item) => total + (item?.monto || 0), 0)}
            />
            </>
        )
    } },
    
    {
        id: 'zona', header: 'zona', accessor: 'zona', render: (row)=>{
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
            <i className='pi pi-copy p-2 border border-2 border-black my-2' onClick={()=>onClickCopyContratoProv(row?.id)}></i>
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
    const onClickCopyContratoProv = (id)=>{
        onOpenModalCustomContratosProv(id, true)
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
