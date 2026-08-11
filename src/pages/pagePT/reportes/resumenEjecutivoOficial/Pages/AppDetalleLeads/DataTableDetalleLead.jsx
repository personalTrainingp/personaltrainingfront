import React from 'react'
import { Table } from 'react-bootstrap'
import { NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import { useSelector } from 'react-redux';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Devuelve info de formateo de un mes/año (evita repetir dayjs(...) por todos lados) */
function getMesInfo(anio, mes) {
    const fecha = dayjs(`${anio}-${mes}-1`, 'YYYY-M-D');
    const mesNombre = fecha.format('MMMM');
    return {
        anioLabel: fecha.format('YYYY'),
        mesLabel: mesNombre,
        esDiciembre: mesNombre === 'diciembre',
    };
}

/** Suma montoTotal de los items cuyo id_origen esté en idsOrigen, agrupando por día */
function sumarMontoPorIdOrigen(dias, idsOrigen) {
    return dias.reduce((total, dia) => {
        const subtotal = dia.items
            .filter((item) => idsOrigen.includes(item.id_origen))
            .reduce((sum, item) => sum + (item.montoTotal || 0), 0);
        return total + subtotal;
    }, 0);
}

/** Cuenta items cuyo id_origen esté en idsOrigen, agrupando por día */
function contarPorIdOrigen(dias, idsOrigen) {
    return dias.reduce((total, dia) => {
        return total + dia.items.filter((item) => idsOrigen.includes(item.id_origen)).length;
    }, 0);
}

function agruparxIdOrigen(data) {
    return data.reduce((acc, item) => {
        let grupo = acc.find((g) => g.id_origen === item.id_origen);
        if (!grupo) {
            grupo = { id_origen: item.id_origen, data: [], monto_total: 0 };
            acc.push(grupo);
        }
        grupo.data.push(item);
        grupo.monto_total += item.montoTotal;
        return acc;
    }, []);
}

const ID_ORIGEN_META = [693, 694];
const ID_ORIGEN_TIKTOK = [695];

/** Arma la data derivada (ventas, leads, montos, etc.) para un mes/año puntual */
function construirDataMes({ arr, data, dataLeads, corte, dataCuotaMetaDelMes }) {
    const dataFiltradaMes = data?.filter((f) => f.mes === arr.mes && f.anio === arr.anio) || [];
    const dataCorte = dataFiltradaMes.filter((el) => corte.dia.includes(el.dia));
    const dataMetaFiltradaMes =
        dataCuotaMetaDelMes?.filter((f) => f.mes === arr.mes && f.anio === arr.anio) || [];

    const dataLeadMes1515 = dataLeads.leadsRed1515?.filter((f) => f.mes === arr.mes && f.anio === arr.anio) || [];
    const dataLeadMesCorte1515 = dataLeadMes1515.filter((el) => corte.dia.includes(el.dia));
    const montoTotalLead1515 = dataLeadMes1515.reduce((t, item) => t + (item?.montoTotal || 0), 0);
    const cantidadTotalLead1515 = dataLeadMesCorte1515.reduce((t, item) => t + (item?.cantidadTotal || 0), 0);
    console.log({dataLeadMes1515});
    
    const montoCorteLead1515 = dataLeadMesCorte1515.reduce((t, item) => t + (item?.montoTotal || 0), 0);

    const dataLeadMes1514 = dataLeads.leadsRed1514?.filter((f) => f.mes === arr.mes && f.anio === arr.anio) || [];
    const cantidadTotalLead1514 = dataLeadMes1514.reduce((t, item) => t + (item?.cantidadTotal || 0), 0);
    const dataLeadMesCorte1514 = dataLeadMes1514.filter((el) => corte.dia.includes(el.dia));
    const montoTotalLead1514 = dataLeadMes1514.reduce((t, item) => t + (item?.montoTotal || 0), 0);
    const montoCorteLead1514 = dataLeadMesCorte1514.reduce((t, item) => t + (item?.montoTotal || 0), 0);

    const montoTotalVentaMeta = sumarMontoPorIdOrigen(dataCorte, ID_ORIGEN_META);
    const montoCorteVentaMeta = sumarMontoPorIdOrigen(dataCorte, ID_ORIGEN_META);
    const montoTotalVentaTiktok = sumarMontoPorIdOrigen(dataCorte, ID_ORIGEN_TIKTOK);
    const montoCorteVentaTikTok = sumarMontoPorIdOrigen(dataCorte, ID_ORIGEN_TIKTOK);

    const cantTotalVentaMeta = contarPorIdOrigen(dataCorte, ID_ORIGEN_META);
    const cantCorteVentaMeta = contarPorIdOrigen(dataCorte, ID_ORIGEN_META);
    const cantTotalVentaTikTok = contarPorIdOrigen(dataCorte, ID_ORIGEN_TIKTOK);
    const cantCorteVentaTikTok = contarPorIdOrigen(dataCorte, ID_ORIGEN_TIKTOK);

    const montoTotal = dataFiltradaMes.reduce((t, item) => t + (item?.montoTotal || 0), 0);
    const montoCorte = dataCorte.reduce((t, item) => t + (item?.montoTotal || 0), 0);
    const montoMeta = dataMetaFiltradaMes.reduce((t, item) => t + (item?.meta || 0), 0);

    return {
        ...arr,
        ...getMesInfo(arr.anio, arr.mes),
        cantTotalVentaMeta,
        cantCorteVentaMeta,
        cantTotalVentaTikTok,
        cantCorteVentaTikTok,
        cantidadTotalLead1515,
        dataLeadMesCorte1515,
        cantidadTotalLead1514,
        dataLeadMesCorte1514,
        montoTotalVentaMeta,
        montoCorteVentaMeta,
        montoCorteVentaTikTok,
        montoTotalVentaTiktok,
        montoCorteLead1515,
        montoTotalLead1515,
        montoTotalLead1514,
        montoCorteLead1514,
        montoTotal,
        montoCorte,
        montoMeta,
        dataVentaCorte: dataCorte.map((d) => ({ ...d, agrupadoxIdOrigen: agruparxIdOrigen(d.items) })),
        dataVentaTotal: dataFiltradaMes.map((d) => ({ ...d, agrupadoxIdOrigen: agruparxIdOrigen(d.items) })),
    };
}

// ---------------------------------------------------------------------------
// Presentational sub-components
// ---------------------------------------------------------------------------

const HeaderCell = ({ mes }) => (
    <th
        className={`fs-2 text-center text-white ${mes.esDiciembre ? 'border-right-10' : ''}`}
        style={{ width: '240px' }}
    >
        {mes.anioLabel}
        <br />
        {mes.mesLabel}
    </th>
);

/** Celda de dinero, reutilizada por todas las filas de tipo "monto" */
const MoneyCell = ({ mes, value, style }) => (
    <td className={`fs-3 text-center ${mes.esDiciembre ? 'border-right-10' : ''}`} style={style}>
        <NumberFormatMoney className="fs-1" amount={value} />
    </td>
);

/** Celda numérica simple (cantidades) */
const NumberCell = ({ mes, value, big }) => (
    <td className={`${big ? 'fs-2' : 'fs-1'} text-center ${mes.esDiciembre ? 'border-right-10' : ''}`}>
        {big ? <div className="fs-2">{value}</div> : value}
    </td>
);

/**
 * Una fila completa de la tabla: etiqueta a la izquierda + una celda por mes.
 * `renderCell` recibe (mes) y decide qué pintar, para no repetir el .map en cada fila.
 */
const FilaTabla = ({ label, dataConMes, renderCell, labelStyle, rowStyle }) => (
    <tr style={rowStyle}>
        <td className="sticky-td-598 fs-3 text-white text-center" style={labelStyle}>
            <div>{label}</div>
        </td>
        {dataConMes.map((mes) => (
            <React.Fragment key={`${label}-${mes.anio}-${mes.mes}`}>{renderCell(mes)}</React.Fragment>
        ))}
    </tr>
);

// ---------------------------------------------------------------------------
// Componente principal
// ---------------------------------------------------------------------------

export const DataTableDetalleLead = ({
    label,
    data,
    dataLeads,
    arrayFechas = [],
    corte,
    nombreCategoriaVenta,
    dataCuotaMetaDelMes = [],
}) => {
    const { fecha } = useSelector((e) => e.DATA);
    const fechaSeleccionada = `${fecha.split('-')[0]}-${fecha.split('-')[1]}`;

    const dataConMes = arrayFechas.map((arr) =>
        construirDataMes({ arr, data, dataLeads, corte, dataCuotaMetaDelMes })
    );

    return (
        <Table className="tabla-egresos" style={{ width: '100%' }} bordered>
            <thead>
                <tr className="bg-change">
                    <th className="fs-2 bg-change" style={{ width: '250px' }}>
                        <div className="text-change">{nombreCategoriaVenta}</div>
                    </th>
                    {dataConMes.map((mes) => (
                        <HeaderCell key={`head-${mes.anio}-${mes.mes}`} mes={mes} />
                    ))}
                </tr>
            </thead>
            <tbody>
                {/* ---------------- META ---------------- */}
                <FilaTabla
                    label="INVERSION META"
                    dataConMes={dataConMes}
                    renderCell={(mes) => (
                        <td className={`fs-2 text-center ${mes.esDiciembre ? 'border-right-10' : ''}`}>
                            <div className="text-color-dolar">
                                $<NumberFormatMoney className="fs-1" amount={mes.montoCorteLead1515} />
                            </div>
                        </td>
                    )}
                />
                <FilaTabla
                    label="VENTA MEMBRESIAS META"
                    dataConMes={dataConMes}
                    renderCell={(mes) => <MoneyCell mes={mes} value={mes.montoTotalVentaMeta} />}
                />
                <FilaTabla
                    label="ROAS META"
                    labelStyle={{ backgroundColor: '#2196F3' }}
                    dataConMes={dataConMes}
                    renderCell={(mes) => (
                        <MoneyCell
                            mes={mes}
                            value={mes.montoTotalVentaMeta / (mes.montoCorteLead1515 * 3.37)}
                            style={{ backgroundColor: '#2195f358' }}
                        />
                    )}
                />
                <FilaTabla
                    label="CANTIDAD LEADS META"
                    dataConMes={dataConMes}
                    renderCell={(mes) => <NumberCell mes={mes} value={mes.cantidadTotalLead1515} big />}
                />
                
                <FilaTabla
                    label="COSTO POR LEAD META"
                    dataConMes={dataConMes}
                    renderCell={(mes) => (
                        <td className={`fs-2 text-center ${mes.esDiciembre ? 'border-right-10' : ''}`}>
                            <div className="text-color-dolar">
                                $<NumberFormatMoney className="fs-1" amount={(mes.montoCorteLead1515/1.18) / mes.cantidadTotalLead1515} />
                            </div>
                        </td>
                    )}
                />
                <FilaTabla
                    label="COSTO ADQUISICION DE CLIENTES META"
                    dataConMes={dataConMes}
                    renderCell={(mes) => (
                        <MoneyCell mes={mes} value={mes.montoCorteLead1515 / mes.cantCorteVentaMeta} />
                    )}
                />
                <FilaTabla
                    label="TICKET PROMEDIO META"
                    dataConMes={dataConMes}
                    renderCell={(mes) => (
                        <MoneyCell mes={mes} value={mes.montoTotalVentaMeta / mes.cantCorteVentaMeta} />
                    )}
                />
                <FilaTabla
                    label="CANTIDAD CLIENTES META"
                    dataConMes={dataConMes}
                    renderCell={(mes) => <NumberCell mes={mes} value={mes.cantCorteVentaMeta} />}
                />
                <FilaTabla
                    label="% CONVERSION META"
                    dataConMes={dataConMes}
                    renderCell={(mes) => (
                        <MoneyCell
                            mes={mes}
                            value={(mes.cantCorteVentaMeta / mes.dataLeadMesCorte1515.length) * 100}
                        />
                    )}
                />

                {/* ---------------- TIKTOK ---------------- */}
                <FilaTabla
                    label="Inversion Tiktok"
                    rowStyle={{ borderTop: '4px solid black' }}
                    dataConMes={dataConMes}
                    renderCell={(mes) => (
                        <td
                            className={`fs-2 text-center ${mes.esDiciembre ? 'border-right-10' : ''}`}
                            style={{ borderTop: '4px solid black' }}
                        >
                            <NumberFormatMoney className="fs-1" amount={mes.montoCorteLead1514} />
                        </td>
                    )}
                />
                <FilaTabla
                    label="VENTA MEMBRESIAS TIKTOK"
                    dataConMes={dataConMes}
                    renderCell={(mes) => <MoneyCell mes={mes} value={mes.montoCorteVentaTikTok} />}
                />
                <FilaTabla
                    label="ROAS TIKTOK"
                    labelStyle={{ backgroundColor: '#2196F3' }}
                    dataConMes={dataConMes}
                    renderCell={(mes) => (
                        <MoneyCell
                            mes={mes}
                            value={mes.montoTotalVentaTiktok / mes.montoCorteLead1514}
                            style={{ backgroundColor: '#2196F3' }}
                        />
                    )}
                />
                <FilaTabla
                    label="CANTIDAD LEADS TIKTOK"
                    dataConMes={dataConMes}
                    renderCell={(mes) => <NumberCell mes={mes} value={mes.dataLeadMesCorte1514.length} big />}
                />
                <FilaTabla
                    label="COSTO POR LEAD TIKTOK"
                    dataConMes={dataConMes}
                    renderCell={(mes) => (
                        <MoneyCell mes={mes} value={mes.montoCorteLead1514 / mes.montoCorteVentaTikTok} />
                    )}
                />
                <FilaTabla
                    label="COSTO ADQUISICION DE CLIENTES TIKTOK"
                    dataConMes={dataConMes}
                    renderCell={(mes) => (
                        <MoneyCell mes={mes} value={mes.montoCorteVentaTikTok / mes.cantCorteVentaTikTok} />
                    )}
                />
                <FilaTabla
                    label="CANTIDAD CLIENTES TIKTOK"
                    dataConMes={dataConMes}
                    renderCell={(mes) => <NumberCell mes={mes} value={mes.cantCorteVentaTikTok} />}
                />
                <FilaTabla
                    label="% CONVERSION TIKTOK"
                    dataConMes={dataConMes}
                    renderCell={(mes) => (
                        <MoneyCell
                            mes={mes}
                            value={(mes.cantCorteVentaTikTok / mes.dataLeadMesCorte1514.length) * 100}
                        />
                    )}
                />
            </tbody>
        </Table>
    );
};