import React, { useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
const convertirDataTodosMeses = (vendddD) => {
    const fila = { product: 'ventas' };

    vendddD.forEach((mesData) => {
        const mes = mesData.mes.toUpperCase();

        mesData.itemVendedores.forEach((vendedor) => {
            const vendedorKey = vendedor.nombre_empl.toUpperCase();

            const socios = vendedor.items.length;
            const ventas = vendedor.items.reduce(
                (acc, item) => acc + (item.detalle_ventaMembresium?.tarifa_monto || 0),
                0
            );
            const ticket = socios > 0 ? ventas / socios : 0;

            fila[`${mes}_${vendedorKey}_SOCIOS`] = socios;
            fila[`${mes}_${vendedorKey}_VENTAS`] = ventas;
            fila[`${mes}_${vendedorKey}_TICKET`] = ticket;
        });
    });

    return [fila];
};
const generarColumnGroup = (vendddD) => {
    const vendedoresUnicos = new Set();
    vendddD.forEach(mes => {
        mes.itemVendedores.forEach(v => vendedoresUnicos.add(v.nombre_empl.toUpperCase()));
    });
    const vendedores = Array.from(vendedoresUnicos);

    return (
        <ColumnGroup>
            <Row>
                <Column header="" rowSpan={3} />
                {vendddD.map(mes => (
                    <Column key={mes.mes} header={mes.mes.toUpperCase()} colSpan={vendedores.length * 3} />
                ))}
            </Row>
            <Row>
                {vendddD.map(mes => (
                    vendedores.map(v => (
                        <Column key={`${mes.mes}_${v}`} header={v} colSpan={3} />
                    ))
                ))}
            </Row>
            <Row>
                {vendddD.map(mes => (
                    vendedores.map(v => (
                        <>
                            <Column key={`${mes.mes}_${v}_SOCIOS`} header="SOCIOS" field={`${mes.mes.toUpperCase()}_${v}_SOCIOS`} />
                            <Column key={`${mes.mes}_${v}_VENTAS`} header="VENTAS" field={`${mes.mes.toUpperCase()}_${v}_VENTAS`} />
                            <Column key={`${mes.mes}_${v}_TICKET`} header="TICKET MEDIO" field={`${mes.mes.toUpperCase()}_${v}_TICKET`} />
                        </>
                    ))
                ))}
            </Row>
        </ColumnGroup>
    );
};

export const TableDataComparativaVendedores = ({data}) => {
    // console.log();
        const formatCurrency = (value) =>
        value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    const convertirDataTodosMeses = (vendddD) => {
        const fila = { product: 'ventas' };

        vendddD.forEach((mesData) => {
            const mes = mesData.mes.toUpperCase();

            mesData.itemVendedores.forEach((vendedor) => {
                const vendedorKey = vendedor.nombre_empl.toUpperCase();

                const socios = vendedor.items.length;
                const ventas = vendedor.items.reduce(
                    (acc, item) => acc + (item.detalle_ventaMembresium?.tarifa_monto || 0),
                    0
                );
                const ticket = socios > 0 ? ventas / socios : 0;

                fila[`${mes}_${vendedorKey}_SOCIOS`] = socios;
                fila[`${mes}_${vendedorKey}_VENTAS`] = ventas;
                fila[`${mes}_${vendedorKey}_TICKET`] = ticket;
            });
        });

        return [fila];
    };

    const generarColumnGroup = (vendddD) => {
        const vendedoresUnicos = new Set();
        vendddD.forEach(mes =>
            mes.itemVendedores.forEach(v => vendedoresUnicos.add(v.nombre_empl.toUpperCase()))
        );
        const vendedores = Array.from(vendedoresUnicos);

        return (
            <ColumnGroup>
                <Row>
                    <Column header="" rowSpan={3} />
                    {vendddD.map(mes => (
                        <Column key={mes.mes} header={mes.mes.toUpperCase()} colSpan={vendedores.length * 3} />
                    ))}
                </Row>
                <Row>
                    {vendddD.map(mes => (
                        vendedores.map(v => (
                            <Column key={`${mes.mes}_${v}`} header={v} colSpan={3} />
                        ))
                    ))}
                </Row>
                <Row>
                    {vendddD.map(mes => (
                        vendedores.map(v => (
                            <>
                                <Column key={`${mes.mes}_${v}_SOCIOS`} header="SOCIOS" field={`${mes.mes.toUpperCase()}_${v}_SOCIOS`} />
                                <Column key={`${mes.mes}_${v}_VENTAS`} header="VENTAS" field={`${mes.mes.toUpperCase()}_${v}_VENTAS`} body={formatCurrencyCell} />
                                <Column key={`${mes.mes}_${v}_TICKET`} header="TICKET MEDIO" field={`${mes.mes.toUpperCase()}_${v}_TICKET`} body={formatCurrencyCell} />
                            </>
                        ))
                    ))}
                </Row>
            </ColumnGroup>
        );
    };

    const formatCurrencyCell = (rowData, column) => {
        const value = rowData[column.field];
        return formatCurrency(value || 0);
    };

    const sales = convertirDataTodosMeses(data);
    const headerGroup = generarColumnGroup(data);


    return (
        <div className="card">
            {/* {JSON.stringify(data[0])} */}
            <DataTable value={sales} headerColumnGroup={headerGroup}  tableStyle={{ minWidth: '50rem' }}>
                <Column field="product" />
                {/* <Column field="lastYearSale" body={lastYearSaleBodyTemplate} />
                <Column field="thisYearSale" body={thisYearSaleBodyTemplate} />
                <Column field="lastYearProfit" body={lastYearProfitBodyTemplate} />
                <Column field="thisYearProfit" body={thisYearProfitBodyTemplate} /> */}
            </DataTable>
        </div>
    );
}
