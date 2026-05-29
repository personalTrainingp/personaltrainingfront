import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney, NumberFormatter } from '@/components/CurrencyMask';
import { Column } from 'primereact/column'
import { DataTable } from 'primereact/datatable'
import React, { useEffect, useState } from 'react'
import { useGrouped } from '../hooks/useGrouped';
import { FilterMatchMode, FilterOperator } from 'primereact/api';

export const FormatDataTable = ({arrayEstadistico}) => {
    // console.log({arrayEstadistico});
    const { agruparPorSexo } = useGrouped()
        const estadisticas = arrayEstadistico.map(d=>{
            const arrayGeneral = arrayEstadistico.map(f=>f.items).flat()
            const cantidad = d.items?.length
            const cantidadEstadisticas =  arrayEstadistico?.reduce((acc, item)=>acc+item.items?.length, 0)
            const sumaMontoTotal =  arrayGeneral.reduce((acc, item)=>acc+item?.tarifa_monto, 0)
            const monto_total =  d.items?.reduce((acc, item)=>acc+item?.tarifa_monto, 0)
            const ticketMedio = (monto_total/cantidad)||0
            const porcentajeCantidad = (cantidad/cantidadEstadisticas)*100
            const porcentajeMonto = (monto_total/sumaMontoTotal)*100
            const agrupadoPorSexo = agruparPorSexo(d.items)
            // console.log(agrupadoPorSexo);
            return {
                nombreTarifa_tt: d.nombreTarifa_tt,
                pFem: agrupadoPorSexo[0].items,
                pMasc: agrupadoPorSexo[1].items,
                cantidad,
                monto_total,
                ticketMedio,
                porcentajeCantidad,
                porcentajeMonto,
                items: d.items || [],
                propiedad: d.propiedad
            }
        }).sort((a,b)=>{
            if (a.cantidad === b.cantidad) {
                // Si las cantidades son iguales, ordenar por monto
                return b.monto_total-a.monto_total;
              }
              // Ordenar por cantidad
              return b.cantidad-a.cantidad;
        })
            const [filters, setFilters] = useState(null);
                const [globalFilterValue, setGlobalFilterValue] = useState('');
                    const [customers, setCustomers] = useState(null);
            
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    
        const initFilters = () => {
            setFilters({
                // global: { value: null, matchMode: FilterMatchMode.CONTAINS },
                // id: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                propiedad:{ operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                monto_total: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                ticketMedio: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                porcentajeCantidad: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                porcentajeMonto: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
                cantidad: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
            });
            // setGlobalFilterValue('');
        };
        
                useEffect(() => {
                // const fetchData = () => {
                //     setCustomers(getCustomers(dataGastos));
                //     setLoading(false);
                // };
                setCustomers(getCustomers(estadisticas));
                // fetchData()
                initFilters();
                }, []);
                
                    const getCustomers = (data) => {
                        return data.map(item => {
                            // Crea una copia del objeto antes de modificarlo
                            let newItem = { ...item };
                            return newItem;
                            });
                    };
    const propiedadBodyTemplate = (rowData)=>{
        return (
        <div className={`fw-bold text-primary fs-1 ${rowData.isTime && (`${rowData.propiedad}`.split(' ')[1]=='PM'&&'bg-primary text-white')}`} style={{fontSize: '20px', color: 'black'}}>
        {rowData.propiedad}
        {/* {rowData.nombreTarifa_tt} <br/> <div className='text-black'>{(rowData.sesiones/5).toFixed(0)} SEMANAS</div> <span className='font-24 mr-3'>x</span> <SymbolSoles isbottom={true}  numero={<NumberFormatMoney amount={rowData.tarifaCash_tt}/>}/>  */}
        </div>

        )
    }
    const montoVentaTotalBodyTemplate = (rowData)=>{
        return (
            <div className="fw-bold text-black fs-1">
                <NumberFormatMoney amount={rowData.monto_total}/>
            {/* {rowData.monto_total} */}
            </div>
    
            )
    }
    const cantidadSociosBodyTemplate = (rowData)=>{
        return(
            <div className="fw-bold text-black fs-1">
                <NumberFormatter amount={rowData.cantidad}/>
            {/* {rowData.cantidad} */}
            </div>
        )
    }
    const porcentajeVentaTotalBodyTemplate = (rowData)=>{
        return(
            <div className="fw-bold text-black fs-1">
                <NumberFormatMoney amount={rowData.porcentajeMonto}/>
            {/* {rowData.porcentajeMonto} */}
            </div>
        )
    }
    const porcentajeSociosBodyTemplate = (rowData)=>{
        return (
            <div className="fw-bold text-black fs-1">
                {/* <Format */}
                <NumberFormatMoney amount={rowData.porcentajeCantidad}/>
            {/* {rowData.porcentajeCantidad} */}
            </div>
        )
    }
    const ticketMedioBodyTemplate = (rowData)=>{
        return (
            <div className="fw-bold text-black fs-1">
                <NumberFormatMoney amount={rowData.ticketMedio}/>
            </div>
        )
    }
    const headerItemBodyTemplate = (head)=>{
        return (
            <div className='fs-2'>
                {head}
            </div>
        )
    }
  return (
    <div className='d-flex justify-content-center' style={{width: '100%'}}>
        <div style={{width: '130rem'}}>
                            <DataTable
                                size='normal' 
                                value={customers} 
                                // paginator 
                                // header={header}
                                rows={10} 
                                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                                rowsPerPageOptions={[10, 25, 50, 100, 250]} 
                                dataKey="id"
                                // selection={selectedCustomers}
                                // onSelectionChange={(e) => setselectedCustomers(e.value)}
                                filters={filters} 
                                filterDisplay="menu" 
                                globalFilterFields={['cantidad', 'monto_total', 'porcentajeMonto', 'porcentajeCantidad', 'ticketMedio']} 
                                emptyMessage="Egresos no encontrados."
                                showGridlines 
                                // loading={loading} 
                                stripedRows
                                scrollable
                                // onValueChange={valueFiltered}
                                >
                        <Column header={headerItemBodyTemplate('PROMOCION')} body={propiedadBodyTemplate} style={{ width: '4rem' }}/>
                        <Column header={headerItemBodyTemplate('S/. VENTA TOTAL')}  body={montoVentaTotalBodyTemplate} filterField="monto_total" field='monto_total' style={{ width: '4rem' }} sortable/>
                        <Column header={headerItemBodyTemplate('SOCIOS')} body={cantidadSociosBodyTemplate} filterField="cantidad" field='cantidad' style={{ width: '4rem' }} sortable/>
                        <Column header={headerItemBodyTemplate('% VENTA TOTAL')} body={porcentajeVentaTotalBodyTemplate} filterField="porcentajeMonto" field='porcentajeMonto' style={{ width: '4rem' }} sortable/>
                        <Column header={headerItemBodyTemplate('% SOCIOS')} body={porcentajeSociosBodyTemplate} filterField="porcentajeCantidad" field='porcentajeCantidad' style={{ width: '4rem' }} sortable/>
                        <Column header={headerItemBodyTemplate('TICKET MEDIO')} body={ticketMedioBodyTemplate} filterField="ticketMedio" field='ticketMedio' style={{ width: '4rem' }} sortable/>
                    </DataTable>
        </div>
    </div>
  )
}
