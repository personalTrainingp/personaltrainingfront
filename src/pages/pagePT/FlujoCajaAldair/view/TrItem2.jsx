import React, { useEffect } from 'react';
import { generarMesYanio } from '../helpers/generarMesYanio';
import { NumberFormatMoney } from '@/components/CurrencyMask';

export const TrItemVentas2 = ({ label = '', anio=2024,
    arrayFechas = [], arrayFechaAnterior=[],
    mesDiaDesde,
    mesDiaDespues, id_empresa = 0, classNameTotal='', className='', dataAnio, dataAnioAnterior }) => {
    
    const alter = generarMesYanio(
                new Date(`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`), new Date(`2024-${mesDiaDespues} 15:45:47.6640000 +00:00`)
            ).map(e=>{
                const dataIngresos = arrayFechas.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                const dataIngresosAnterior = arrayFechaAnterior.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                return {
                    dataIngresos,
                    dataIngresosAnterior
                }
            })
    return (
        <TrItem
            id_empresa={id_empresa}
            label={label}
            alter={alter}
            total={alter.reduce((a, b) => a + b.dataIngresos, 0)}
            getMonto={(e) => e.dataIngresos}
            getPorcentaje={(e) =>
                e.dataIngresosAnterior > 0
                    ? Math.max((e.sumaIngresos * 100) / e.dataIngresosAnterior - 100, 0)
                    : 0
            }
        />
    );
};

export const TrItemGastos2 = ({ label = '', anio=2024,
    arrayFechas = [], arrayFechaAnterior=[],
    mesDiaDesde,
    mesDiaDespues, id_empresa = 0, classNameTotal='', className='', dataAnio, dataAnioAnterior }) => {
    
    const alter = generarMesYanio(
                new Date(`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`), new Date(`2024-${mesDiaDespues} 15:45:47.6640000 +00:00`)
            ).map(e=>{
                const dataIngresos = arrayFechas.flujoxGrupo?.filter(f=>f.id!==153).flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                const dataIngresosAnterior = arrayFechaAnterior.flujoxGrupo?.filter(f=>f.id!==153).flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                return {
                    dataIngresos,
                    dataIngresosAnterior
                }
            })
    return (
        <TrItem
            id_empresa={id_empresa}
            label={label}
            className='text-change'
            alter={alter}
            total={-alter.reduce((a, b) => a + b.dataIngresos, 0)}
            getMonto={(e) => -e.dataIngresos}
            getPorcentaje={(e) =>
                e.dataIngresosAnterior > 0
                    ? Math.max((e.sumaIngresos * 100) / e.dataIngresosAnterior - 100, 0)
                    : 0
            }
        />
    );
};

export const TrItemUtilidades2 = ({ label = '', anio=2024,
    arrayFechasGastos = [], arrayFechaAnteriorGastos=[],
    arrayFechasIngresos = [], arrayFechaAnteriorIngresos=[],
    mesDiaDesde,
    mesDiaDespues, id_empresa=598 }) => {
    const alter = generarMesYanio(
                new Date(`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`), new Date(`2024-${mesDiaDespues} 15:45:47.6640000 +00:00`)
            ).map(e=>{
                const dataGastos = arrayFechasGastos.flujoxGrupo?.filter(f=>f.id!==153).flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                const dataGastosAnterior = arrayFechaAnteriorGastos.flujoxGrupo?.filter(f=>f.id!==153).flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                const dataIngresos = arrayFechasIngresos.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                const dataIngresosAnterior = arrayFechaAnteriorIngresos.flujoxGrupo?.filter(f=>f.id!==121).flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                return {
                    dataGastos,
                    dataGastosAnterior,
                    dataIngresos,
                    dataIngresosAnterior
                }
            })
    return (
        <TrItem
        label={label}
        alter={alter}
        id_empresa={id_empresa}
        className=''
        total={
            alter.reduce((a, b) => a + b.dataIngresos - b.dataGastos, 0)
        }
        getMonto={(e) => e.dataIngresos - e.dataGastos}
        getPorcentaje={(e) =>
            e.dataGastosAnterior > 0
                ? Math.max((e.dataGastos * 100) / e.dataGastosAnterior - 100, 0)
                : 0
        }
    />
    );
};

export const TrItemBolsa2 = ({ label = '', anio=2024,
    arrayFechasGastos = [], arrayFechaAnteriorGastos=[],
    arrayFechasIngresos = [], arrayFechaAnteriorIngresos=[],
    mesDiaDesde,
    mesDiaDespues, id_empresa=598 }) => {
    const alter = generarMesYanio(
                new Date(`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`), new Date(`2024-${mesDiaDespues} 15:45:47.6640000 +00:00`)
            ).map(e=>{
                const dataGastos = arrayFechasGastos.flujoxGrupo?.filter(f=>f.id===153).flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                const dataGastosAnterior = arrayFechaAnteriorGastos.flujoxGrupo?.filter(f=>f.id===153).flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                const dataIngresos = arrayFechasIngresos.flujoxGrupo?.filter(f=>f.id===121).flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                const dataIngresosAnterior = arrayFechaAnteriorIngresos.flujoxGrupo?.filter(f=>f.id===121).flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                return {
                    dataGastos,
                    dataGastosAnterior,
                    dataIngresos,
                    dataIngresosAnterior
                }
            })
    return (
        <TrItem
        label={label}
        alter={alter}
        id_empresa={id_empresa}
        total={
            alter.reduce((a, b) => a + b.dataIngresos - b.dataGastos, 0)
        }
        getMonto={(e) => e.dataIngresos - e.dataGastos}
        getPorcentaje={(e) =>
            e.dataGastosAnterior > 0
                ? Math.max((e.dataGastos * 100) / e.dataGastosAnterior - 100, 0)
                : 0
        }
    />
    );
};


export const TrItemBolsaChange2 = ({ label = '', anio=2024,
    arrayFechasGastos = [], arrayFechaAnteriorGastos=[],
    arrayFechasIngresos = [], arrayFechaAnteriorIngresos=[],
    mesDiaDesde,
    mesDiaDespues, id_empresa=598 }) => {
    const alter = generarMesYanio(
                new Date(`2024-${mesDiaDesde} 15:45:47.6640000 +00:00`), new Date(`2024-${mesDiaDespues} 15:45:47.6640000 +00:00`)
            ).map(e=>{
                const dataGastosBolsa = arrayFechasGastos.flujoxGrupo?.flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                const dataGastosAnteriorBolsa = arrayFechaAnteriorGastos.flujoxGrupo?.flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                const dataIngresosBolsa = arrayFechasIngresos.flujoxGrupo?.flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                const dataIngresosAnteriorBolsa = arrayFechaAnteriorIngresos.flujoxGrupo?.flatMap((f) => f.itemsxDia)
                                ?.filter((f) => f.mes === e.mes)
                                .flatMap((f) => f.items)
                                ?.reduce((total, item) => total + item.monto, 0)
                return {
                    dataGastosBolsa,
                    dataGastosAnteriorBolsa,
                    dataIngresosBolsa,
                    dataIngresosAnteriorBolsa
                }
            })
    return (
        <TrItem
        label={label}
        alter={alter}
        id_empresa={id_empresa}
        total={
            alter.reduce((a, b) => a + b.dataIngresosBolsa - b.dataGastosBolsa, 0)
        }
        getMonto={(e) => e.dataIngresosBolsa - e.dataGastosBolsa}
        getPorcentaje={(e) =>
            e.dataGastosAnteriorBolsa > 0
                ? Math.max((e.dataGastosBolsa * 100) / e.dataGastosAnteriorBolsa - 100, 0)
                : 0
        }
    />
    );
};
export const TrItem = ({
    label = '',
    anio = 2024,
    id_empresa = 0,
    classNameTotal = '',
    className = '',
    alter = [],
    getMonto,
    getPorcentaje,
    total,
}) => {
    return (
        <tr>
            <td className={`border-left-10 border-right-10 sticky-td-${id_empresa} text-center text-white fs-1`}>
                {label}
            </td>

            {alter.map((e, i) => (
                <React.Fragment key={i}>
                    <td className={`text-center `}>
                        <div className={`${getMonto(e)<0?'text-change':''}`}>
                            {anio !== 2020 && (
                                <NumberFormatMoney
                                    className={className}
                                    amount={getMonto(e)}
                                />
                            )}
                            
                        </div>
                    </td>
                    <td className="text-center">
                        {anio !== 2020 && (
                            <NumberFormatMoney
                                className={className}
                                amount={getPorcentaje(e)}
                            />
                        )}
                    </td>
                </React.Fragment>
            ))}

            <td className={`${classNameTotal}`}>
                <div className={`${total<0?'text-change':''}`}>
                    <NumberFormatMoney
                        style={{ fontSize: anio !== 2020 ? '35px' : '45px' }}
                        amount={total}
                    />
                </div>
            </td>

            <td className={classNameTotal}>
                <div className={`${(total/3)<0?'text-change':''}`}>
                    <NumberFormatMoney
                        style={{ fontSize: anio !== 2020 ? '35px' : '45px' }}
                        amount={total / 3}
                    />
                </div>
            </td>
        </tr>
    );
};