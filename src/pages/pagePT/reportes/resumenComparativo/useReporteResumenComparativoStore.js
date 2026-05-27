import { PTApi } from '@/common';
import dayjs, { utc } from 'dayjs';
import { useState } from 'react';
import { fetchComparativoCached } from '../resumenCache'; // Centralized cache
dayjs.extend(utc);

// ───────────────── helpers ─────────────────
function formatDateToSQLServerWithDayjs(date, isStart = true) {
  const base = dayjs.utc(date);
  return isStart
    ? base.startOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]')
    : base.endOf('day').format('YYYY-MM-DDTHH:mm:ss.SSS[-05:00]');
}

const agruparPorIdPgm = (data = []) =>
  data.reduce((resultado, item) => {
    let grupo = resultado.find((g) => g.id_pgm === item.id_pgm);
    if (!grupo) {
      grupo = { id_pgm: item.id_pgm, items: [] };
      resultado.push(grupo);
    }
    grupo.items.push(item);
    return resultado;
  }, []);

function agruparPorCliente(detalle_ventaMembresium = []) {
  const ids = new Set();
  for (const it of detalle_ventaMembresium) {
    // usa un identificador real del cliente si existe
    const idCli =
      it?.tb_ventum?.id_cli ??
      it?.tb_ventum?.tb_cliente?.id_cli ??
      it?.tb_cliente?.id_cli ??
      null;
    if (idCli != null && it?.tb_ventum?.id_tipoFactura === 701) ids.add(idCli);
  }
  return Array.from(ids);
}

// ───────────────── hook ─────────────────
export const useReporteResumenComparativoStore = () => {
  const [dataGroup, setdataGroup] = useState([]);
  const [dataClientesxMarcacion, setdataClientesxMarcacion] = useState([]);
  const [dataIdPgmCero, setdataIdPgmCero] = useState({ detalle_ventaMembresium: [], ventas_transferencias: [], tb_image: [] });
  const [dataHorarios, sethorarios] = useState([]);
  const [dataAsesoresFit, setdataAsesoresFit] = useState([]);
  const [dataTarifas, settarifas] = useState([]);
  const [dataGroupTRANSFERENCIAS, setdataGroupTRANSFERENCIAS] = useState([]);
  const [loading, setloading] = useState(false);
  const [dataEstadoGroup, setdataEstadoGroup] = useState([]);

  const obtenerComparativoResumen = async (RANGE_DATE) => {
    setloading(true);
    try {
      // Use centralized cache to avoid race conditions between concurrent hook instances
      const data = await fetchComparativoCached(RANGE_DATE);

      // ─── defensas ───
      const ventasProgramas = Array.isArray(data?.ventasProgramas) ? data.ventasProgramas : [];
      const ventasTransferencias = Array.isArray(data?.ventasTransferencias) ? data.ventasTransferencias : [];

      // TRANSFERENCIAS ► id_pgm asociado
      const dataTransferencias = ventasTransferencias.flatMap((f) => {
        const detalle = f?.venta_venta?.[0]?.venta_transferencia?.[0]?.detalle_ventaMembresia?.[0];
        const id_pgm = detalle?.id_pgm ?? null;
        return id_pgm == null ? [] : [{ ...f, id_pgm }];
      });

      // AGRUPAR ventasProgramas por id_pgm con totales y detalle “normalizado”
      const agruparxIdPgm = Object.values(
        ventasProgramas.reduce((acc, group) => {
          const { id_pgm, detalle_ventaMembresium, tb_image } = group || {};
          if (id_pgm == null) return acc;

          if (!acc[id_pgm]) {
            acc[id_pgm] = {
              id_pgm,
              tarifa_total: 0,
              sesiones_total: 0,
              detalle_ventaMembresium: [],
              tb_image: [],
            };
          }

          const items = Array.isArray(detalle_ventaMembresium) ? detalle_ventaMembresium : [detalle_ventaMembresium];

          items.forEach((detalle, index) => {
            // if (index === 0) console.log("DEBUG: First detalle item structure:", detalle);
            if (detalle && typeof detalle === 'object') {
              const yaExiste = acc[id_pgm].detalle_ventaMembresium.some((m) =>
                m?.horario === detalle?.horario &&
                m?.fec_fin_mem === detalle?.fec_fin_mem &&
                m?.fec_inicio_mem === detalle?.fec_inicio_mem &&
                m?.tarifa_monto === detalle?.tarifa_monto &&
                m?.tb_ventum?.id === detalle?.tb_ventum?.id
              );
              if (!yaExiste) {
                acc[id_pgm].tarifa_total += Number(detalle?.tarifa_monto || 0);
                acc[id_pgm].sesiones_total += Number(detalle?.tb_semana_training?.sesiones || 0);
                acc[id_pgm].detalle_ventaMembresium.push({
                  horario: detalle?.horario ?? null,
                  tarifa_monto: Number(detalle?.tarifa_monto || 0),
                  fec_fin_mem: detalle?.fec_fin_mem,
                  fec_inicio_mem: detalle?.fec_inicio_mem,
                  id_tarifa: detalle?.id_tarifa || 0,
                  tb_semana_training: detalle?.tb_semana_training ?? null,
                  tb_ventum: detalle?.tb_ventum ?? null,
                  tarifa_venta: detalle?.tarifa_venta ?? null,
                });
              }
            }
          });

          if (tb_image?.name_image) {
            if (!acc[id_pgm].tb_image.some((img) => img.name_image === tb_image.name_image)) {
              acc[id_pgm].tb_image.push(tb_image);
            }
          }

          return acc;
        }, {})
      );

      // Unificar con transferencias y agrupar por cliente
      const ventasUnificadas = agruparxIdPgm.map((venta) => {
        const transferencia = agruparPorIdPgm(dataTransferencias).find(
          (t) => t.id_pgm === venta.id_pgm
        );
        return {
          ...venta,
          agrupadoPorIdCli: agruparPorCliente(venta.detalle_ventaMembresium),
          ventas_transferencias: transferencia ? transferencia.items : [],
        };
      });

      // Crear objeto TOTAL (id_pgm = 0)
      const totalObject = ventasUnificadas.reduce(
        (total, current) => {
          total.ventas_transferencias.push(...(current.ventas_transferencias || []));
          total.tarifa_total += Number(current.tarifa_total || 0);
          total.sesiones_total += Number(current.sesiones_total || 0);
          total.detalle_ventaMembresium.push(...(current.detalle_ventaMembresium || []));
          total.tb_image.push(...(current.tb_image || []));
          return total;
        },
        { id_pgm: 0, tarifa_total: 0, sesiones_total: 0, detalle_ventaMembresium: [], ventas_transferencias: [], tb_image: [] }
      );

      // set de estados
      setdataGroup(ventasUnificadas);
      setdataGroupTRANSFERENCIAS(agruparPorIdPgm(dataTransferencias));
      setdataIdPgmCero(totalObject);

      return ventasUnificadas;
    } catch (err) {
      console.error('[comparativo] fallo', {
        status: err?.response?.status,
        url: err?.config?.url,
        payload: err?.response?.data,
      });
      setdataGroup([]);
      return [];
    } finally {
      setloading(false);
    }
  };

  const obtenerHorariosPorPgm = async () => {
    try {
      const { data } = await PTApi.get('/programaTraining/horario/get-tb-pgm');
      const dataAlter = data.map((e) => ({ id: e.id_horarioPgm, ...e }));
      sethorarios(dataAlter);
    } catch (error) { console.log(error); }
  };

  const obtenerTarifasPorPgm = async () => {
    try {
      const { data } = await PTApi.get('/programaTraining/tarifa/obtener-toda-tarifas');
      const dataAlter = data.map((d) => ({ value: d.id_tt, label: d.nombreTarifa_tt, ...d }));
      settarifas(dataAlter);
    } catch (error) { console.log(error); }
  };

  const obtenerAsesoresFit = async () => {
    try {
      const { data: asesoresFit } = await PTApi.get(`/parametros/get_params/empleados/2`);
      setdataAsesoresFit(asesoresFit);
    } catch (error) { console.log(error); }
  };

  // 👉 el return del hook AHORA sí está al final del cuerpo del hook (no al nivel superior)
  return {
    obtenerComparativoResumen,
    obtenerHorariosPorPgm,
    obtenerTarifasPorPgm,
    obtenerAsesoresFit,
    dataClientesxMarcacion,
    dataAsesoresFit,
    dataIdPgmCero,
    dataTarifas,
    dataHorarios,
    dataGroupTRANSFERENCIAS,
    dataGroup,
    loading,
  };
};
