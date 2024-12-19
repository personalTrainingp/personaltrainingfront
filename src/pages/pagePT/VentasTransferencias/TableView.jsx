import React, { useEffect, useState } from 'react'
import useTransferenciasStore from './useTransferenciasStore'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { Col, Row } from 'react-bootstrap'
import { IconField } from 'primereact/iconfield'
import { InputIcon } from 'primereact/inputicon'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'
import dayjs from 'dayjs'
import { ModalResumenTransferenciaDistritos } from './ModalResumenTransferenciaDistritos'

export const TableView = ({RANGE_DATE}) => {
    const {  obtenerTransferenciasxFecha, data } = useTransferenciasStore()
    const [isOpenModalResumenTransferenciaDistrito, setisOpenModalResumenTransferenciaDistrito] = useState(false)
    
        const [filters, setFilters] = useState(null);
        const [globalFilterValue, setGlobalFilterValue] = useState('');
    useEffect(() => {
        obtenerTransferenciasxFecha(RANGE_DATE)
    }, [])
    const onOpenModalResumenTransferenciaDistrito = ()=>{
      setisOpenModalResumenTransferenciaDistrito(true)
    }
    const onCloseModalResumenTransferenciaDistrito = ()=>{
      setisOpenModalResumenTransferenciaDistrito(false)
    }
    const onGlobalFilterChange = (e) => {
      const value = e.target.value;
      let _filters = { ...filters };

      _filters['global'].value = value;
      setFilters(_filters);
      setGlobalFilterValue(value);
  };
    const initFilters = () => {
      setFilters({
          global: { value: null, matchMode: FilterMatchMode.CONTAINS },
          // 'ProgramavsSemana': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      });
      setGlobalFilterValue('');
    };
    const clearFilter = () => {
    initFilters();
    };

    const transferenciaBodyTemplate = (rowData)=>{
      return (
        <>
        <span className='fw-bold fs-4'>
          {rowData.tb_benefeciario.tb_cliente.nombres_apellidos_cli}
        </span>
        <br/>
        <span className=' fs-4'>
          Distrito: 
          <span className='ml-2'>
           {rowData.tb_benefeciario.tb_cliente.distrito_cli}
          </span>
        </span>
        </>
      )
    }

    const ProgramaBodyTemplate = (rowData)=>{
      return (
        <>
        <span className='text-primary fw-bold fs-3'>{rowData.tb_transferencia.programa_Transferencia}</span>
        <br/>
        <span className='fs-4'>
          {/* {rowData.tb_transferencia.programa_Transferencia.sesiones_transferencia} SESIONES */}
        </span>
        </>
      )
    }

    const beneficiariaBodyTemplate = (rowData)=>{
      return (
        <>
        <span className='fw-bold fs-4'>
          {rowData.tb_transferencia.tb_cliente.nombres_apellidos_cli}
        </span>
        <br/>
        <span className='fs-4'>
          Distrito: 
          <span className='ml-2'>
          {rowData.tb_transferencia.tb_cliente.distrito_cli}
          </span>
        </span>
        </>
      )
    }
    const fechaVentaBodyTemplate = (rowData)=>{
      return(
        <span>
          {dayjs.utc(rowData.fecha_venta).format('dddd DD')} 
        <span className='text-primary mx-1 fw-bold'>
        {dayjs.utc(rowData.fecha_venta).format('MMMM')}
        </span>
        {dayjs.utc(rowData.fecha_venta).format('[/] YYYY')} 
        </span>
      )
    }
    
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscador general" />
                </IconField>
                <Button type="button" icon="pi pi-filter-slash" label="Limpiar filtros" outlined onClick={clearFilter} />
            </div>
        );
    };
    const ProgramaActualBodyTemplate = (rowData)=>{
      return (
        <>
        <span className='text-primary fw-bold fs-3'>{rowData.tb_transferencia.programa_Transferencia}</span>
        <br/>
        <span className='fs-4'>
          {/* {rowData.tb_transferencia.programa_Transferencia.sesiones_transferencia} SESIONES */}
        </span>
        </>
      )
    }
  return (
    <div>
      <Row>
        <Col lg={12}>
          <Button label='RESUMEN POR DISTRITO' onClick={onOpenModalResumenTransferenciaDistrito} text/>
        </Col>
        <Col lg={12}>
            <DataTable size='small' header={renderHeader} value={data} paginator rows={10} dataKey="id"
                    stripedRows
                    emptyMessage="Sin Registro de auditoria">
                <Column header={<span className='fs-3'>FECHA</span>} body={fechaVentaBodyTemplate} style={{ minWidth: '12rem' }} />
                <Column header={<span className='fs-3'>TRANSFERENCIAS <span className='ml-2'>({data.length})</span></span>} body={beneficiariaBodyTemplate} style={{ minWidth: '12rem' }} />
                <Column header={<span className='fs-3'>INSCRITO</span>} body={ProgramaBodyTemplate} style={{ maxWidth: '12rem' }} />
                <Column header={<span className='fs-3'>BENEFICIARIo</span>} body={transferenciaBodyTemplate} style={{ minWidth: '12rem' }} />
                <Column header={<span className='fs-3'>PROGRAMA ACTUAL</span>} body={ProgramaActualBodyTemplate} style={{ minWidth: '12rem' }} />
            </DataTable>
        </Col>
      </Row>
      <ModalResumenTransferenciaDistritos data={data} show={isOpenModalResumenTransferenciaDistrito} onHide={onCloseModalResumenTransferenciaDistrito}/>
    </div>
  )
}
