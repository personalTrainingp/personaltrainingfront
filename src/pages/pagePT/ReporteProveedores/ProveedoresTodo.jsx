import React, { useEffect, useState } from 'react'
import { PTApi } from '@/common'
import { Table } from 'react-bootstrap'
import { generarMesYanio } from './generarMesYanio'
import dayjs from 'dayjs'
import { NumberFormatMoney } from '@/components/CurrencyMask'
import { obtenerTipoDeCambio } from '@/middleware/obtenerTipoDeCambio'
import { aplicarTipoDeCambio } from '@/helper/aplicarTipoCambio'
import { formatDateToSQLServerWithDayjs } from '@/helper/formatDateToSQLServerWithDayjs'
import { ModalDetalleProveedor } from './ModalDetalleProveedor'

// Orden fijo de marcas para las sub-filas de cada proveedor, con el color de marca
// de cada una. sticky-td-{id_empresa} (definido en _tableStyle.scss para .tabla-egresos)
// pinta la columna con el color real de la marca y de paso la deja fija al hacer scroll,
// igual que ya hace GastosProveedor.jsx en las pestañas por marca.
const EMPRESAS = [
    { value: 598, label: 'CHANGE', bg: 'sticky-td-598' },
    { value: 800, label: 'RAL', bg: 'sticky-td-800' },
    { value: 601, label: 'CIRCUS', bg: 'sticky-td-601' },
    { value: 599, label: 'REDUCTO', bg: 'sticky-td-599' },
]

// Junta, para todas las marcas, los egresos (gestion-gasto) con las cuentas por cobrar,
// sumando por proveedor y por mes usando fecha_comprobante en ambos casos.
// El proveedor de una cuenta por cobrar sale de descripcion, formateada como
// "NOMBRE PROVEEDOR: detalle" (ej. "J&T NEGOCIOS BAZAR SUE E.I.R.L.: 2 CHAPLIN"),
// y se hace calzar con egreso.tb_Proveedor.razon_social_prov para sumarlos juntos.
// El título de cada bloque es el proveedor; debajo, una fila por marca (CHANGE, RAL,
// CIRCUS, REDUCTO) para ver de cuál marca sale cada monto.
export const ProveedoresTodo = ({ arrayDate }) => {
    const [data, setdata] = useState([])
    const [modalDetalle, setmodalDetalle] = useState({ show: false, title: '', items: [] })
    useEffect(() => {
        obtenerTodo()
    }, [])
    const abrirModalDetalle = (title, items) => {
        setmodalDetalle({ show: true, title, items })
    }
    const cerrarModalDetalle = () => {
        setmodalDetalle({ show: false, title: '', items: [] })
    }
    const obtenerTodo = async () => {
        try {
            const params = {
                arrayDate: [
                    formatDateToSQLServerWithDayjs(arrayDate[0], true),
                    formatDateToSQLServerWithDayjs(arrayDate[1], false),
                ],
            }
            const [gastosResponses, cuentasResponses] = await Promise.all([
                Promise.all(EMPRESAS.map(({ value: id_empresa }) =>
                    PTApi.get(`/egreso/fecha-comprobante/${id_empresa}`, { params }).then(r => ({ id_empresa, data: r.data }))
                )),
                Promise.all(EMPRESAS.map(({ value: id_empresa }) =>
                    PTApi.get(`/cuenta-balance/fecha-comprobante/${id_empresa}/PorCobrar`, { params }).then(r => ({ id_empresa, data: r.data }))
                )),
            ])
            const dataGastos = gastosResponses.flatMap(({ id_empresa, data }) =>
                (data.gastos || []).map(g => ({
                    ...g,
                    id_empresa,
                    empresaLabel: EMPRESAS.find(e => e.value == id_empresa)?.label,
                    fecha_primaria: g.fecha_comprobante,
                    razon_social_prov: g.tb_Proveedor?.razon_social_prov?.trim() || 'SIN PROVEEDOR',
                    tipo: 'EGRESO',
                }))
            )
            const dataCuentasCobrar = cuentasResponses.flatMap(({ id_empresa, data }) =>
                (data.cuentasBalances || []).map(c => ({
                    ...c,
                    id_empresa,
                    empresaLabel: EMPRESAS.find(e => e.value == id_empresa)?.label,
                    fecha_primaria: c.fecha_comprobante,
                    fec_pago: c.fecha_comprobante,
                    razon_social_prov: c.descripcion?.split(':')[0]?.trim() || 'SIN PROVEEDOR',
                    tipo: 'CUENTA POR PAGAR',
                }))
            )
            const dataTipoTC = await obtenerTipoDeCambio()
            setdata(aplicarTipoDeCambio(dataTipoTC, [...dataGastos, ...dataCuentasCobrar]))
        } catch (error) {
            console.log(error)
        }
    }
    const meses = generarMesYanio(new Date(arrayDate[0]), new Date(arrayDate[1]))
    const proveedorAgrupado = agruparPorProveedorYEmpresa(data)
    return (
        <div>
            <Table responsive className="tabla-egresos fs-3">
                <thead>
                    <tr>
                        <th className='bg-change'></th>
                        {
                            meses.map(g => {
                                return (
                                    <th className='fs-3 bg-change text-white'>{dayjs(`${g.fecha}-15`, 'YYYY-M-DD').format('MMMM')}</th>
                                )
                            })
                        }
                        <th className='fs-3 bg-change text-white'>TOTAL</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        proveedorAgrupado.map(prov => {
                            const itemsMesTotal = agruparPorFecha(Object.values(prov.porEmpresa).flat())
                            return (
                                <React.Fragment key={prov.razon_social_prov}>
                                    <tr>
                                        <th colSpan={meses.length + 2} className='fs-2 bg-secondary text-white'>
                                            {prov.razon_social_prov}
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='bg-change'></th>
                                        {
                                            meses.map(g => {
                                                return (
                                                    <th className='fs-3 bg-change text-white'>{dayjs(`${g.fecha}-15`, 'YYYY-M-DD').format('MMMM')}</th>
                                                )
                                            })
                                        }
                                        <th className='fs-3 bg-change text-white'>TOTAL</th>
                                    </tr>
                                    {
                                        EMPRESAS.map(empresa => {
                                            const itemsMes = agruparPorFecha(prov.porEmpresa[empresa.value] || [])
                                            return (
                                                <tr key={empresa.value}>
                                                    <th className={`fs-3 text-white ${empresa.bg}`} style={{ width: '40px' }}>
                                                        {empresa.label}
                                                    </th>
                                                    {
                                                        meses.map(g => {
                                                            const items = itemsMes.filter(f => `${f.anio}-${f.mes}` == `${g.anio}-${g.mes}`)
                                                            const itemsDetalle = items[0]?.items || []
                                                            return (
                                                                <td
                                                                    className='fs-3 text-center cursor-pointer text-decoration-underline'
                                                                    onClick={() => abrirModalDetalle(
                                                                        `${prov.razon_social_prov} - ${empresa.label} - ${dayjs(`${g.fecha}-15`, 'YYYY-M-DD').format('MMMM YYYY')}`,
                                                                        itemsDetalle
                                                                    )}
                                                                >
                                                                    <NumberFormatMoney amount={items[0]?.monto_total || 0} />
                                                                </td>
                                                            )
                                                        })
                                                    }
                                                    <td
                                                        className='fs-3 text-center cursor-pointer text-decoration-underline'
                                                        onClick={() => abrirModalDetalle(
                                                            `${prov.razon_social_prov} - ${empresa.label} - TOTAL`,
                                                            itemsMes.flatMap(m => m.items)
                                                        )}
                                                    >
                                                        <NumberFormatMoney amount={itemsMes?.reduce((a, b) => b.monto_total + a, 0)} />
                                                    </td>
                                                </tr>
                                            )
                                        })
                                    }
                                    <tr>
                                        <th className='fs-3 text-white sticky-td-total' style={{ width: '40px' }}>
                                            TOTAL
                                        </th>
                                        {
                                            meses.map(g => {
                                                const items = itemsMesTotal.filter(f => `${f.anio}-${f.mes}` == `${g.anio}-${g.mes}`)
                                                const itemsDetalle = items[0]?.items || []
                                                return (
                                                    <td
                                                        className='fs-3 text-center fw-bold cursor-pointer text-decoration-underline'
                                                        onClick={() => abrirModalDetalle(
                                                            `${prov.razon_social_prov} - TODAS LAS MARCAS - ${dayjs(`${g.fecha}-15`, 'YYYY-M-DD').format('MMMM YYYY')}`,
                                                            itemsDetalle
                                                        )}
                                                    >
                                                        <NumberFormatMoney amount={items[0]?.monto_total || 0} />
                                                    </td>
                                                )
                                            })
                                        }
                                        <td
                                            className='fs-3 text-center fw-bold cursor-pointer text-decoration-underline'
                                            onClick={() => abrirModalDetalle(
                                                `${prov.razon_social_prov} - TODAS LAS MARCAS - TOTAL`,
                                                itemsMesTotal.flatMap(m => m.items)
                                            )}
                                        >
                                            <NumberFormatMoney amount={itemsMesTotal?.reduce((a, b) => b.monto_total + a, 0)} />
                                        </td>
                                    </tr>
                                </React.Fragment>
                            )
                        })
                    }
                </tbody>
            </Table>
            <ModalDetalleProveedor
                show={modalDetalle.show}
                onHide={cerrarModalDetalle}
                title={modalDetalle.title}
                items={modalDetalle.items}
            />
        </div>
    )
}

// Agrupa primero por proveedor (título) y, dentro de cada uno, por id_empresa
// (para las sub-filas CHANGE/RAL/CIRCUS/REDUCTO).
const agruparPorProveedorYEmpresa = (data) => {
    const result = Object.values(
        data.reduce((acc, item) => {
            const key = item.razon_social_prov
            if (!acc[key]) {
                acc[key] = {
                    razon_social_prov: key,
                    porEmpresa: {},
                };
            }
            if (!acc[key].porEmpresa[item.id_empresa]) {
                acc[key].porEmpresa[item.id_empresa] = []
            }
            acc[key].porEmpresa[item.id_empresa].push(item);
            return acc
        }, {})
    );
    return result
};

const agruparPorFecha = (data) => {
    const resultado = Object.values(
        data.reduce((acc, item) => {
            const fecha = new Date(item.fecha_primaria);

            const mes = fecha.getMonth() + 1;
            const anio = fecha.getFullYear();

            const key = `${anio}-${mes}`;

            if (!acc[key]) {
                acc[key] = {
                    mes,
                    anio,
                    monto_total: 0,
                    items: [],
                };
            }

            acc[key].monto_total += Number(Number(item.monto || 0) * Number(item.tc || 0));

            acc[key].items.push(item);

            return acc
        }, {})
    );
    return resultado
};
