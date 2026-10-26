import React from 'react';
import { Dialog } from 'primereact/dialog';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { fmtMoney } from '../../resumenEjecutivo/adapters/executibleLogic';
import { limaFromISO } from '../../resumenEjecutivo/hooks/useResumenUtils';

// Celda clicable: solo abre el modal si tiene ventas detrás
export const ClickableTd = ({ style, items, onOpen, children }) => {
    const clickable = items?.length > 0;
    return (
        <td
            style={clickable ? { ...style, cursor: 'pointer', textDecoration: 'underline dotted' } : style}
            onClick={clickable ? onOpen : undefined}
            title={clickable ? 'Ver detalle' : undefined}
        >
            {children}
        </td>
    );
};

const getCliente = (v) => {
    const c = v?.tb_cliente;
    if (!c) return 'Sin cliente';
    return c.nombres_apellidos_cli || [c.nombre_cli, c.apPaterno_cli, c.apMaterno_cli].filter(Boolean).join(' ') || 'Sin cliente';
};

const getPrograma = (v) => {
    const details = v?.detalle_ventaMembresia || v?.detalle_venta_membresia || [];
    const names = details
        .map(d => d?.tb_ProgramaTraining?.name_pgm || d?.tb_programa_training?.name_pgm)
        .filter(Boolean);
    return names.length ? [...new Set(names)].join(', ') : '-';
};

const fmtFecha = (v) => {
    const d = limaFromISO(v?.fecha_venta || v?.fecha || v?.createdAt);
    if (!d) return '-';
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

export const DetalleVentasModal = ({ detalle, onHide }) => {
    const items = detalle?.items || [];

    const rows = items
        .map(({ venta, amount }, idx) => ({
            key: `${venta?.id ?? 'v'}-${idx}`,
            fechaSort: limaFromISO(venta?.fecha_venta || venta?.fecha || venta?.createdAt)?.getTime() || 0,
            fecha: fmtFecha(venta),
            cliente: getCliente(venta),
            programa: getPrograma(venta),
            asesor: venta?.tb_empleado?.nombres_apellidos_empl || venta?.usu_venta_nombre || 'Sin Asignar',
            amount,
        }))
        .sort((a, b) => a.fechaSort - b.fechaSort)
        .map((r, i) => ({ ...r, n: i + 1 }));

    const total = rows.reduce((acc, r) => acc + r.amount, 0);

    return (
        <Dialog
            header={detalle?.titulo}
            visible={!!detalle}
            onHide={onHide}
            style={{ width: '70vw' }}
            breakpoints={{ '960px': '95vw' }}
            dismissableMask
        >
            <div className="d-flex justify-content-end gap-4 mb-2 fw-bold">
                <span>SOCIOS: {rows.length}</span>
                <span>IMPORTE: {fmtMoney(total)}</span>
            </div>
            <DataTable value={rows} dataKey="key" size="small" stripedRows scrollable scrollHeight="60vh">
                <Column field="n" header="#" style={{ width: '50px' }} />
                <Column field="fecha" header="Fecha" sortable sortField="fechaSort" />
                <Column field="cliente" header="Cliente" sortable />
                <Column field="programa" header="Programa" sortable />
                <Column field="asesor" header="Asesor" sortable />
                <Column
                    field="amount"
                    header="Importe"
                    sortable
                    body={(r) => fmtMoney(r.amount)}
                    style={{ textAlign: 'right' }}
                />
            </DataTable>
        </Dialog>
    );
};
