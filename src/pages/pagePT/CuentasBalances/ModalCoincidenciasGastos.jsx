import React, { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'
import { confirmDialog } from 'primereact/confirmdialog'
import Swal from 'sweetalert2'
import { PTApi } from '@/common'
import { DateMaskStr, NumberFormatMoney } from '@/components/CurrencyMask'
import { SymbolDolar, SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles'
import { ModalCustomGasto } from '../GestGastos/ModalCustomGasto'

const empresas = [
    { id_empresa: 598, nombre: 'CHANGE' },
    { id_empresa: 601, nombre: 'CIRCUS' },
    { id_empresa: 599, nombre: 'REDUCTO' },
    { id_empresa: 800, nombre: 'RAL' },
]

// Una sola carga de gastos de todas las empresas, compartida entre las pestañas.
// Al recargar se avisa a todas las tablas que la usan.
let promesaGastos = null
const suscriptores = new Set()

const cargarGastosTodasEmpresas = () => {
    if (!promesaGastos) {
        promesaGastos = Promise.allSettled(
            empresas.map(({ id_empresa }) => PTApi.get(`/egreso/empresa/${id_empresa}`))
        ).then((respuestas) =>
            respuestas.flatMap((r, i) =>
                r.status === 'fulfilled'
                    ? (r.value.data?.gastos || []).map((g) => ({
                          ...g,
                          empresaGasto: empresas[i].nombre,
                          idEmpresaGasto: empresas[i].id_empresa,
                      }))
                    : []
            )
        )
    }
    return promesaGastos
}

const recargarGastos = async () => {
    promesaGastos = null
    const data = await cargarGastosTodasEmpresas()
    suscriptores.forEach((notificar) => notificar(data))
}

export const useGastosTodasEmpresas = (activo = true) => {
    const [gastos, setgastos] = useState([])
    useEffect(() => {
        if (!activo) return
        suscriptores.add(setgastos)
        cargarGastosTodasEmpresas()
            .then((data) => { if (suscriptores.has(setgastos)) setgastos(data) })
            .catch((error) => console.log(error))
        return () => { suscriptores.delete(setgastos) }
    }, [activo])
    return gastos
}

const normalizarOperacion = (op) => String(op ?? '').trim()
const normalizarMonto = (monto) => Math.round((Number(monto) || 0) * 100)

// Gastos con el mismo n_operacion, monto y moneda que la cuenta
export const obtenerCoincidenciasGastos = (cuenta, gastos) => {
    const operacion = normalizarOperacion(cuenta?.n_operacion)
    if (operacion === '') return []
    return gastos.filter(
        (g) =>
            normalizarOperacion(g.n_operacion) === operacion &&
            normalizarMonto(g.monto) === normalizarMonto(cuenta.monto) &&
            g.moneda === cuenta.moneda
    )
}

// Pares cuenta-gasto 1 a 1: la cuenta tiene una sola coincidencia y ese gasto
// coincide solo con esa cuenta (entre las cuentas dadas).
// Se omiten los ya enlazados a esa cuenta y los gastos enlazados a otra cuenta.
export const obtenerEnlacesUnicos = (cuentas, gastos) => {
    const candidatos = cuentas
        .map((cuenta) => ({ cuenta, coincidencias: obtenerCoincidenciasGastos(cuenta, gastos) }))
        .filter(({ coincidencias }) => coincidencias.length === 1)
        .map(({ cuenta, coincidencias }) => ({ cuenta, gasto: coincidencias[0] }))

    const clave = (g) => `${g.idEmpresaGasto}-${g.id}`
    const vecesPorGasto = candidatos.reduce((acc, { gasto }) => {
        acc[clave(gasto)] = (acc[clave(gasto)] || 0) + 1
        return acc
    }, {})
    const unicos = candidatos.filter(({ gasto }) => vecesPorGasto[clave(gasto)] === 1)

    const idActual = (g) => Number(g.id_porCuenta) || 0
    return {
        porEnlazar: unicos.filter(({ cuenta, gasto }) => idActual(gasto) === 0),
        yaEnlazados: unicos.filter(({ cuenta, gasto }) => idActual(gasto) === Number(cuenta.id)),
        enlazadosAOtra: unicos.filter(({ cuenta, gasto }) => idActual(gasto) !== 0 && idActual(gasto) !== Number(cuenta.id)),
        gastoCompartido: candidatos.length - unicos.length,
    }
}

export const BotonEnlazarUnicos = ({ cuentas, gastos }) => {
    const [procesando, setprocesando] = useState(false)
    const { porEnlazar, yaEnlazados, enlazadosAOtra, gastoCompartido } = obtenerEnlacesUnicos(cuentas, gastos)

    const enlazar = async () => {
        setprocesando(true)
        const fallidos = []
        // De a 5 en paralelo para no saturar el servidor
        for (let i = 0; i < porEnlazar.length; i += 5) {
            const lote = porEnlazar.slice(i, i + 5)
            const resultados = await Promise.allSettled(
                lote.map(({ cuenta, gasto }) =>
                    PTApi.put(`/egreso/por-cuenta/id/${gasto.id}`, { id_porCuenta: cuenta.id })
                )
            )
            resultados.forEach((r, j) => {
                if (r.status === 'rejected') fallidos.push(lote[j])
            })
        }
        await recargarGastos()
        setprocesando(false)
        Swal.fire({
            icon: fallidos.length === 0 ? 'success' : 'warning',
            title: `Enlazados: ${porEnlazar.length - fallidos.length} de ${porEnlazar.length}`,
            text: fallidos.length
                ? `Fallaron los gastos: ${fallidos.map(({ gasto }) => gasto.id).join(', ')}`
                : undefined,
        })
    }

    const confirmar = () => {
        confirmDialog({
            header: 'Enlazar gastos con 1 sola coincidencia',
            message: (
                <div>
                    <div>Se pondra id_porCuenta en <b>{porEnlazar.length}</b> gastos.</div>
                    <div>Ya enlazados (se omiten): {yaEnlazados.length}</div>
                    <div>Gasto enlazado a otra cuenta (se omiten): {enlazadosAOtra.length}</div>
                    <div>Gasto que coincide con varias cuentas (se omiten): {gastoCompartido}</div>
                </div>
            ),
            accept: enlazar,
        })
    }

    return (
        <Button
            className="mb-2"
            label={procesando ? 'Enlazando...' : `Enlazar gastos con 1 coincidencia (${porEnlazar.length})`}
            icon="pi pi-link"
            disabled={procesando || porEnlazar.length === 0}
            onClick={confirmar}
        />
    )
}

// Ultimo gasto enlazado a la cuenta con el check (id_porCuenta = id de la cuenta), por updatedAt
export const obtenerUltimoGastoEnlazado = (cuenta, gastos) =>
    gastos
        .filter((g) => Number(g.id_porCuenta) === Number(cuenta?.id))
        .reduce(
            (ultimo, g) =>
                !ultimo || new Date(g.updatedAt) > new Date(ultimo.updatedAt) ? g : ultimo,
            null
        )

const Monto = ({ moneda, monto }) => (
    <div className={moneda === 'PEN' ? '' : 'text-color-dolar fw-bold'}>
        {moneda === 'PEN' ? <SymbolSoles fontSizeS={'font-15'} /> : <SymbolDolar fontSizeS={'font-15'} />}
        <NumberFormatMoney amount={monto} />
    </div>
)

export const ModalCoincidenciasGastos = ({ cuenta, gastos, onHide }) => {
    // Gasto que se esta editando; mientras tanto se oculta este modal
    const [gastoEditar, setgastoEditar] = useState(null)
    const coincidencias = cuenta ? obtenerCoincidenciasGastos(cuenta, gastos) : []

    const onCerrarEditar = async () => {
        setgastoEditar(null)
        await recargarGastos()
    }

    // Id del gasto que se esta guardando, para deshabilitar su check mientras tanto
    const [gastoGuardando, setgastoGuardando] = useState(null)

    // check_gasto_cuentas: al marcar, el gasto queda enlazado a esta cuenta (id_porCuenta = id de la cuenta);
    // al desmarcar, id_porCuenta vuelve a 0
    const onCheckGastoCuenta = async (gasto, marcado) => {
        setgastoGuardando(gasto.id)
        try {
            await PTApi.put(`/egreso/por-cuenta/id/${gasto.id}`, { id_porCuenta: marcado ? cuenta.id : 0 })
            await recargarGastos()
        } catch (error) {
            console.log(error)
            Swal.fire({
                icon: 'error',
                title: 'PROBLEMA',
                text: error?.response?.data?.error || error?.response?.data?.msg || error?.message,
            })
        } finally {
            setgastoGuardando(null)
        }
    }

    const confirmarEliminar = (gasto) => {
        confirmDialog({
            message: `¿Estas seguro de eliminar el gasto ${gasto.id}?`,
            accept: async () => {
                try {
                    await PTApi.put(`/egreso/delete/id/${gasto.id}`)
                    await recargarGastos()
                    Swal.fire({ icon: 'success', title: 'GASTO ELIMINADO CORRECTAMENTE', showConfirmButton: false, timer: 2500 })
                } catch (error) {
                    console.log(error)
                    Swal.fire({ icon: 'error', title: 'PROBLEMA', showConfirmButton: false, timer: 2500 })
                }
            },
        })
    }

    return (
        <>
            {/* Se monta solo al editar: ModalCustomGasto toma la empresa en su estado inicial */}
            {gastoEditar && (
                <ModalCustomGasto
                    show
                    onHide={onCerrarEditar}
                    id={gastoEditar.id}
                    isCopy={false}
                    id_enterprice={gastoEditar.idEmpresaGasto}
                    onOpenModalGasto={() => {}}
                    onOpenModalProveedor={() => {}}
                />
            )}
            <Dialog
                visible={cuenta !== null && gastoEditar === null}
                onHide={onHide}
                header={`Coincidencias de gastos - Cuenta ${cuenta?.id ?? ''} | Op. ${cuenta?.n_operacion ?? ''}`}
                style={{ width: '80rem' }}
            >
                {coincidencias.length === 0 ? (
                    <div className="fs-4 p-3 text-center">No hay gastos con el mismo n° de operacion, monto y moneda</div>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-bordered table-hover">
                            <thead>
                                <tr>
                                    <th>CHECK_GASTO_CUENTAS</th>
                                    <th>ID GASTO</th>
                                    <th>EMPRESA</th>
                                    <th>FECHA COMPROBANTE</th>
                                    <th>N° OPERACION</th>
                                    <th>CONCEPTO</th>
                                    <th>PROVEEDOR</th>
                                    <th>DESCRIPCION</th>
                                    <th>MONTO</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {coincidencias.map((g) => (
                                    <tr key={`${g.empresaGasto}-${g.id}`}>
                                        <td className="text-center">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                style={{ width: '1.5rem', height: '1.5rem', cursor: 'pointer' }}
                                                checked={Number(g.id_porCuenta) === Number(cuenta.id)}
                                                disabled={gastoGuardando === g.id}
                                                onChange={(e) => onCheckGastoCuenta(g, e.target.checked)}
                                            />
                                        </td>
                                        <td>{g.id}</td>
                                        <td>{g.empresaGasto}</td>
                                        <td>{g.fec_comprobante ? DateMaskStr(g.fec_comprobante, 'DD/MM/YYYY') : '-'}</td>
                                        <td>{g.n_operacion}</td>
                                        <td>{g.tb_parametros_gasto?.nombre_gasto || '-'}</td>
                                        <td>{g.tb_Proveedor?.razon_social_prov || '-'}</td>
                                        <td>{g.descripcion || '-'}</td>
                                        <td><Monto moneda={g.moneda} monto={g.monto} /></td>
                                        <td className="text-nowrap">
                                            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => setgastoEditar(g)} />
                                            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmarEliminar(g)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </Dialog>
        </>
    )
}
