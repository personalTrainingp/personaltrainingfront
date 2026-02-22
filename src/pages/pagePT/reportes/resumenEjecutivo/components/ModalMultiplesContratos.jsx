
import React from "react";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useMultiplesContratos } from "../hooks/useMultiplesContratos";

export const ModalMultiplesContratos = ({ show, onHide, id_empresa = 598 }) => {
    const { socios, loading, expandedRows, setExpandedRows } =
        useMultiplesContratos(show, id_empresa);

    // --- TEMPLATES DE FORMATO ---
    const formatCurrency = (value) => {
        return Number(value).toLocaleString("es-PE", {
            style: "currency",
            currency: "PEN",
        });
    };

    const formatDate = (date) => {
        if (!date) return "N/D";
        // Si viene como string ISO, convertimos
        const d = new Date(date);
        if (isNaN(d.getTime())) return "N/D";
        return d
            .toLocaleDateString("es-PE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
            })
            .toUpperCase();
    };

    // --- TEMPLATES DE CELDAS (UI) ---
    const nameTemplate = (rowData) => (
        <div className="d-flex flex-column">
            <span className="fw-bold text-dark">{rowData.nombre_completo}</span>
            <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                {rowData.email}
            </small>
            <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                <i className="pi pi-phone mr-1" style={{ fontSize: "0.7rem" }}></i>
                {rowData.telefono}
            </small>
        </div>
    );

    const metricasTemplate = (rowData) => (
        <div className="d-flex flex-column justify-content-center">
            <div className="d-flex align-items-center mb-1">
                <span className="badge bg-primary rounded-pill me-2">
                    {rowData.cantidad_contratos} Contratos
                </span>
                <span className="fw-bold text-success fs-5">
                    {formatCurrency(rowData.monto_total)}
                </span>
            </div>
            <span
                className="text-secondary"
                style={{ fontSize: "0.9rem", fontWeight: "500" }}
            >
                <i className="pi pi-calendar mr-1 fs-5"></i>
                {formatDate(rowData.fecha_min)} — {formatDate(rowData.fecha_max)}
            </span>
        </div>
    );

    const rowExpansionTemplate = (data) => (
        <div className="p-3 bg-light rounded border border-light-subtle">
            <h6 className="mb-3 text-primary">
                <i className="pi pi-list mr-2"></i>Historial de {data.nombre_completo}
            </h6>
            <DataTable
                value={data.contratos}
                size="small"
                responsiveLayout="scroll"
                className="shadow-sm"
            >
                <Column
                    field="name_pgm"
                    header="Programa / Plan"
                    className="fw-medium"
                />
                <Column
                    header="Fecha Inicio"
                    body={(r) => formatDate(r.fec_inicio_mem)}
                />
                <Column header="Fecha Fin" body={(r) => formatDate(r.fec_fin_mem)} />
                <Column
                    header="Inversión"
                    body={(r) => (
                        <span className="text-success fw-bold">
                            {formatCurrency(r.tarifa_monto)}
                        </span>
                    )}
                />
            </DataTable>
        </div>
    );

    const footer = (
        <div className="d-flex justify-content-between align-items-center w-100">
            <span className="text-muted fst-italic" style={{ fontSize: "0.85rem" }}>
                Socios encontrados: <b>{socios.length}</b>
            </span>
        </div>
    );

    return (
        <Dialog
            header={
                <div>
                    <i className="pi pi-users mr-2 text-primary"></i>Socios con Múltiples
                    Contratos Activos
                </div>
            }
            visible={show}
            style={{ width: "85vw", maxWidth: "900px" }}
            onHide={onHide}
            footer={footer}
            maximizable
        >
            <DataTable
                value={socios}
                loading={loading}
                paginator
                rows={8}
                expandedRows={expandedRows}
                onRowToggle={(e) => setExpandedRows(e.data)}
                rowExpansionTemplate={rowExpansionTemplate}
                dataKey="id_cli"
                size="small"
                stripedRows
                emptyMessage="No se encontraron socios con múltiples contratos."
                className="p-datatable-sm"
            >
                <Column expander style={{ width: "3em" }} />

                <Column
                    header="Datos del Socio"
                    body={nameTemplate}
                    sortable
                    field="nombre_completo"
                    filter
                    filterPlaceholder="Buscar socio..."
                    style={{ minWidth: "250px" }}
                />

                <Column
                    header="Resumen de Inversión y Periodo"
                    body={metricasTemplate}
                    sortable
                    field="cantidad_contratos"
                />
            </DataTable>
        </Dialog>
    );
};