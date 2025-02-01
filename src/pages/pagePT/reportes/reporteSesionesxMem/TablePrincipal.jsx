import React, { useState, useEffect, useRef } from 'react';
import { FilterMatchMode, FilterOperator, locale } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { Calendar } from 'primereact/calendar';
import { useSelector } from 'react-redux';
import { useGf_GvStore } from '@/hooks/hookApi/useGf_GvStore';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog';
import { helperFunctions } from '@/common/helpers/helperFunctions';
import { arrayCargoEmpl, arrayFinanzas } from '@/types/type';
import dayjs from 'dayjs';
import { FormatoDateMask, FUNMoneyFormatter, MoneyFormatter } from '@/components/CurrencyMask';
import utc from 'dayjs/plugin/utc';
import { Skeleton } from 'primereact/skeleton';
import { Col, Modal, Row } from 'react-bootstrap';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { useReporteSesionesUsadasStore } from './useReporteSesionesUsadasStore';
import { ModalAsistencias } from './ModalAsistencias';
dayjs.extend(utc);
function contarAsistenciasConsecutivas(tb_marcacion, fecha_inicio_mem, numero) {
    const fechas = tb_marcacion.map(m => new Date(m.fecha).toISOString().split('T')[0]);
    fechas.sort();
    
    let cantidad = 0;
    let contador = 0;
    let inicio = null;

    for (let i = 0; i < fechas.length; i++) {
        if (inicio === null) {
            inicio = fechas[i];
            contador = 1;
        } else {
            let fechaActual = new Date(inicio);
            fechaActual.setDate(fechaActual.getDate() + 1);

            if (fechas[i] === fechaActual.toISOString().split('T')[0]) {
                contador++;
                if (contador === numero) {
                    cantidad++;
                    inicio = null;
                }
            } else {
                inicio = fechas[i];
                contador = 1;
            }
        }
    }

    return { numero, cantidad };
}

const calcularSemanas = (tb_marcacion, fecha_inicio_mem, fecha_fin_mem, numeroDias, incluirMayorIgual, diasConsecutivos) => {
    const resultadoSemanas = [];
    const fechaInicio = new Date(fecha_inicio_mem);
    const fechaFin = new Date(fecha_fin_mem);
  
    let semana = 1;
    let inicioSemana = new Date(fechaInicio);
  
    while (inicioSemana <= fechaFin) {
      const finSemana = new Date(inicioSemana);
      finSemana.setDate(finSemana.getDate() + 6); // Fin de la semana (7 días)
  
      // Filtrar marcaciones dentro de esta semana
      const marcacionesSemana = tb_marcacion
        .map((marcacion) => new Date(marcacion.fecha))
        .filter((fechaMarcacion) => fechaMarcacion >= inicioSemana && fechaMarcacion <= finSemana)
        .sort((a, b) => a - b); // Ordenar por fecha
  
      let cumpleCondicion = false;
  
      if (diasConsecutivos) {
        // Validar si hay días consecutivos
        let consecutivos = 1; // Contador para días consecutivos
        for (let i = 1; i < marcacionesSemana.length; i++) {
          const diferencia = (marcacionesSemana[i] - marcacionesSemana[i - 1]) / (1000 * 60 * 60 * 24);
          if (diferencia === 1) {
            consecutivos++;
          } else {
            consecutivos = 1; // Reiniciar si no es consecutivo
          }
          if (consecutivos >= numeroDias) {
            cumpleCondicion = true;
            break;
          }
        }
      } else {
        // Validar según `numeroDias` y `incluirMayorIgual`
        cumpleCondicion = incluirMayorIgual
          ? marcacionesSemana.length >= numeroDias
          : marcacionesSemana.length === numeroDias;
      }
  
      if (cumpleCondicion) {
        resultadoSemanas.push(`semana ${semana}`);
      }
  
      // Avanzar a la siguiente semana
      inicioSemana.setDate(inicioSemana.getDate() + 7);
      semana++;
    }
  
    return resultadoSemanas;
  };
export function TablePrincipal({showToast}) {
    locale('es')
    const [customers, setCustomers] = useState(null);
    const [filters, setFilters] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedCustomers, setselectedCustomers] = useState([])
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [isOpenModalMarcacion, setisOpenModalMarcacion] = useState(false)
    const [dataModalMarcacion, setdataModalMarcacion] = useState([])
    const { obtenerGastos, obtenerProveedoresUnicos } = useGf_GvStore()
    const { obtenerSesionesActivas, dataSesionesActivas, isLoadingData } = useReporteSesionesUsadasStore()
    // const isLoadingData = false
    const [valueFilter, setvalueFilter] = useState([])
    const onOpenModalMarcacion = (data)=>{
        setisOpenModalMarcacion(true)
        setdataModalMarcacion(data)
    }
    const onCloseModalMarcacion = ()=>{
        setdataModalMarcacion([])
        setisOpenModalMarcacion(false)
    }
    useEffect(() => {
        // obtenerGastos(id_enterprice)
        obtenerSesionesActivas(598)
        // obtenerProveedoresUnicos()
    }, [])
        useEffect(() => {
        const fetchData = () => {
            setCustomers(getCustomers(dataSesionesActivas));
            setLoading(false);
        };
        fetchData()
        initFilters();
        }, [dataSesionesActivas]);
        
    const getCustomers = (data) => {
        return data.map(item => {
            let newItem = { ...item };
            newItem.alterSemanas = calcularSemanas(item.marcacion, item.fecha_inicio_mem, item.fecha_fin_mem, 5, true, false).join(', ')
            // console.log(contarAsistenciasConsecutivas(item.marcacion, item.fecha_inicio_mem, 5));
            newItem.alterSemanas_consecutivas_len = calcularSemanas(item.marcacion, item.fecha_inicio_mem, item.fecha_fin_mem, 5, true, true).length
            const porcenta = (((newItem.alterSemanas_consecutivas_len*5)/item.sesiones_vendidas)*100).toFixed(2)
            newItem.porcentAsistencia5PrimeroDiasConsecutivos = porcenta
            newItem.alterSemanas_len = calcularSemanas(item.marcacion, item.fecha_inicio_mem, item.fecha_fin_mem, 5, true, false).length
            newItem.alterSemanas_consecutivas = calcularSemanas(item.marcacion, item.fecha_inicio_mem, item.fecha_fin_mem, 5, true, true).join(', ')
            return newItem;
            });
    };
    console.log({customers});
    
    const highlightText = (text, search) => {
        if (!search) {
            return text;
        }
        if (!text) {
            return text;
        }
        const regex = new RegExp(`(${search})`, 'gi');
        return text?.split(regex).map((part, index) =>
            part.toLowerCase() === search.toLowerCase() ? (
                <span key={index} style={{ backgroundColor: 'yellow' }}>{part}</span>
            ) : (
                part
            )
        );
    };
    const clearFilter = () => {
        initFilters();
        setGlobalFilterValue('');
    };

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const actionBodyTemplate = (rowData)=>{
        
        return (
            <React.Fragment>
                <a className='underline' onClick={()=>onOpenModalMarcacion(rowData.marcacion)}>Ver Asistencias</a>
            </React.Fragment>
        );
    }

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            tipoFactura: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            alterSemanas_consecutivas: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            // id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            // ['tb_Proveedor.razon_social_prov']:{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            // fec_registro: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
            fecha_fin_mem: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            fecha_inicio_mem: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            // 'tb_parametros_gasto.nombre_gasto': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            // 'tb_parametros_gasto.grupo': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            nombre_programa: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            nombres_apellidos_cli: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            sesiones_vendidas: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            sesiones_usadas: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        });
        setGlobalFilterValue('');
    };
    const [showModalImportadorData, setshowModalImportadorData] = useState(false)
    const renderHeader = () => {
        return (
            <div className="d-flex justify-content-between">
                <div className='d-flex'>
                    <IconField iconPosition="left">
                        <InputIcon className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscador general" />
                    </IconField>
                    <Button type="button" icon="pi pi-filter-slash" outlined onClick={clearFilter} />
                </div>
                <div className='d-flex'>
                    <Button label="IMPORTAR" icon='pi pi-file-import' onClick={()=>setshowModalImportadorData(true)} disabled text/>
                    {/* <ExportToExcel data={valueFilter}/> */}
                </div>
            </div>
        );
    };
    
    const fechaFinBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText(`${rowData.fecha_fin_mem}`, globalFilterValue)}</span>
            </div>
        );
    };
    // console.log(customers, 'ggg');
    
    const {daysUTC} = helperFunctions()
    const nombres_apellidos_cliBodyTemplate = (rowData)=>{
        return (
            <div className="flex align-items-center gap-2">
                <span>{ highlightText(rowData.nombres_apellidos_cli, globalFilterValue) }</span>
            </div>
        );
    }
    const programaTrainingBodyTemplate = (rowData)=>{
        return (
            <div className="align-items-center gap-2">
                <span>{highlightText(rowData.nombre_programa, globalFilterValue)}</span>
                <br/>
                
                {/* <span>{formatDate(rowData.fec_pago) }</span> */}
                <div className='text-primary font-bold'>{highlightText(rowData.tipoFactura, globalFilterValue)}</div>
            </div>
        );
    }
    const cantidadSesionesUsadasBodyTemplate = (rowData) => {
        console.log(rowData.porcentAsistencia5PrimeroDiasConsecutivos);
        
        return (
            <div className="align-items-center gap-2">
                <span>{highlightText( `${rowData.sesiones_usadas}`, globalFilterValue)}</span>
                <br/>
                <span className='font-bold'>PORCENTAJE: {highlightText( `${rowData.porcentAsistencia5PrimeroDiasConsecutivos}`, globalFilterValue)}</span>
            </div>
        );
    };
    
    const cantidadSemanaVendidasBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{highlightText( `${rowData.sesiones_vendidas/5}`, globalFilterValue)}</span>
            </div>
        );
    };
    const fechaInicioBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.fecha_inicio_mem}</span>
            </div>
        );
    };
    const dateFilterTemplate = (options) => {
        return <Calendar value={options.value} onChange={(e) => options.filterCallback(e.value, options.index)} dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };
    
    const valueFiltered = (e)=>{
        setvalueFilter(e)
    }
    
    const header = renderHeader();
    const [isOpenModalEgresos, setisOpenModalEgresos] = useState(false)
    const onCloseModalIvsG = ()=>{
        setisOpenModalEgresos(false)
    }
    const onOpenModalIvsG = ()=>{
        setisOpenModalEgresos(true)
    }
    const cantidadSesionesVendidasBodyTemplate = (rowData)=>{
        return (
            
            <div className="flex align-items-center gap-2">
                <span>{highlightText( `${rowData.sesiones_vendidas}`, globalFilterValue)}</span>
            </div>
        )
    }
    const cantidadSemanasAsistidas = (rowData)=>{
        return (
            
            <div className="align-items-center gap-2">
                <span className='font-bold fs-3'>{highlightText( `${rowData.alterSemanas_len} veces`, globalFilterValue)}</span>
                <br/>
                <span>{highlightText( `${rowData.alterSemanas}`, globalFilterValue)}</span>
            </div>
        )
    }

    const nutricionBodyTemplate = (rowData)=>{
        console.log({cn: rowData.citas_nutricion, cna:rowData.citas_nutricion_asistidas});
        
        return(
            <div className="align-items-center gap-2">
                <span className='font-bold fs-3'>adquiridas: {highlightText( `${rowData.citas_nutricion}`, globalFilterValue)}</span>
                <br/>
                <span>utilizadas {highlightText( `${rowData.citas_nutricion_asistidas.length}`, globalFilterValue)}</span>
            </div>
        )
    }
    
    const cantidadSemanasConsecutivas = (rowData)=>{
        return (
            
            <div className="align-items-center gap-2">
                <span className='font-bold fs-3'>{highlightText( `${rowData.alterSemanas_consecutivas_len} veces`, globalFilterValue)}</span>
                <br/>
                <span>{highlightText( `${rowData.alterSemanas_consecutivas}`, globalFilterValue)}</span>
            </div>
        )
    }
    return (
        <>
            {
                isLoadingData?(
                    <>
                    <DataTable 
                        size='small' 
                        value={customers} 
                        paginator 
                        header={header}
                        rows={10} 
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[10, 25, 50, 100, 250]} 
                        dataKey="id"
				        selection={selectedCustomers}
                        onSelectionChange={(e) => setselectedCustomers(e.value)}
                        filters={filters} 
                        filterDisplay="menu" 
                        globalFilterFields={['tipoFactura', 'nombres_apellidos_cli', 'alterSemanas', 'nombre_programa', 'sesiones_usadas', 'sesiones_vendidas', 'fecha_fin_mem', 'fecha_inicio_mem']} 
                        emptyMessage="Egresos no encontrados."
                        showGridlines 
                        loading={loading} 
                        stripedRows
                        scrollable
                        onValueChange={valueFiltered}
                        >
                <Column field='nombres_apellidos_cli' header="Nombre del cliente" sortable style={{ width: '15rem' }} body={nombres_apellidos_cliBodyTemplate} filter />
                <Column field='nombre_programa' header="Programa"  style={{ width: '7rem' }} body={programaTrainingBodyTemplate} filter  />
                <Column field='sesiones_usadas' header="Cantidad de semanas Vendidas" sortable style={{ minWidth: '10rem' }} body={cantidadSemanaVendidasBodyTemplate} filter />
                <Column field='sesiones_vendidas' header="Sesiones Vendidas" style={{ minWidth: '10rem' }} sortable body={cantidadSesionesVendidasBodyTemplate} filter/>
                <Column field='sesiones_usadas' header="sesiones asistidas" sortable style={{ minWidth: '10rem' }} body={cantidadSesionesUsadasBodyTemplate} filter />
                <Column field='alterSemanas_consecutivas_len' header="semanas cumplidos" sortable style={{ minWidth: '10rem' }} body={cantidadSemanasConsecutivas} filter />
                {/* <Column field='alterSemanas_len' header="semanas" sortable style={{ minWidth: '10rem' }} body={cantidadSemanasAsistidas} filter /> */}
                <Column field='alterSemanas_len' header="nutricion" sortable style={{ minWidth: '10rem' }} body={nutricionBodyTemplate} filter />
                <Column field='fecha_inicio_mem' header="Fecha de inicio" style={{ minWidth: '10rem' }} sortable body={fechaInicioBodyTemplate} filter/>
                <Column field='fecha_fin_mem' header="Fecha fin" style={{ minWidth: '10rem' }} sortable body={fechaFinBodyTemplate} filter/>
                <Column header="Action" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={actionBodyTemplate}/>
            </DataTable>
            </>
                )
                :(
                    //Array.from({ length: 10 }, (v, i) => i)
                    <DataTable size='large' 
                    value={Array.from({ length: 10 }, (v, i) => i)} 
                    className="p-datatable-striped"
                    >
                        <Column header="Nombre del cliente" style={{ width: '15rem' }} body={<Skeleton/>} />
                        <Column header="Programa" style={{ width: '7rem' }} body={<Skeleton/>} />
                        <Column header="Cantidad Sesiones Vendidas" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Cantidad de sesiones asistidas" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Fecha de inicio" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Fecha fin" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                        <Column header="Action" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
                    </DataTable>
                )
            }
            <ModalAsistencias onHide={onCloseModalMarcacion} visible={isOpenModalMarcacion} dataMarcacion={dataModalMarcacion}/>
        </>
    );
}