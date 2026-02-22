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
  const [dataMembresiaPorCliente, setdataMembresiaPorCliente] = useState([]);
  const [dataIdPgmCero, setdataIdPgmCero] = useState({});
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
        ventasProgramas.reduce((acc, item) => {
          const { id_pgm, detalle_ventaMembresium, tb_image } = item || {};
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

          if (detalle_ventaMembresium && typeof detalle_ventaMembresium === 'object') {
            const yaExiste = acc[id_pgm].detalle_ventaMembresium.some((m) =>
              m?.horario === detalle_ventaMembresium?.horario &&
              m?.fec_fin_mem === detalle_ventaMembresium?.fec_fin_mem &&
              m?.fec_inicio_mem === detalle_ventaMembresium?.fec_inicio_mem &&
              m?.tarifa_monto === detalle_ventaMembresium?.tarifa_monto &&
              m?.tb_ventum?.id === detalle_ventaMembresium?.tb_ventum?.id
            );
            if (!yaExiste) {
              acc[id_pgm].tarifa_total += Number(detalle_ventaMembresium?.tarifa_monto || 0);
              acc[id_pgm].sesiones_total += Number(detalle_ventaMembresium?.tb_semana_training?.sesiones || 0);
              acc[id_pgm].detalle_ventaMembresium.push({
                horario: detalle_ventaMembresium?.horario ?? null,
                tarifa_monto: Number(detalle_ventaMembresium?.tarifa_monto || 0),
                fec_fin_mem: detalle_ventaMembresium?.fec_fin_mem,
                fec_inicio_mem: detalle_ventaMembresium?.fec_inicio_mem,
                id_tarifa: detalle_ventaMembresium?.id_tarifa || 0,
                tb_semana_training: detalle_ventaMembresium?.tb_semana_training ?? null,
                tb_ventum: detalle_ventaMembresium?.tb_ventum ?? null,
                tarifa_venta: detalle_ventaMembresium?.tarifa_venta ?? null,
              });
            }
          }

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

  const obtenerClientesConMarcacion = async () => {
    try {
      const { data } = await PTApi.get(`/usuario/get-marcacions/cliente`);
      setdataClientesxMarcacion(data);
    } catch (error) {
      console.log(error);
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
    obtenerClientesConMarcacion,
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


function agruparMarcacionesPorSemana(data) {
  return data.map((obj) => {
    const inicioMem = dayjs(obj.fec_inicio_mem);

    // Filtrar la primera marcación de cada día
    const primerasMarcaciones = Object.values(
      obj.tb_marcacions.reduce((acumulador, marcacion) => {
        const fechaDia = dayjs(marcacion.tiempo_marcacion).format('YYYY-MM-DD');
        if (
          !acumulador[fechaDia] ||
          dayjs(marcacion.tiempo_marcacion).isBefore(
            acumulador[fechaDia].tiempo_marcacion
          )
        ) {
          acumulador[fechaDia] = marcacion; // Guardar la más temprana del día
        }
        return acumulador;
      }, {})
    );

    // Agrupar las primeras marcaciones por semana
    const marcacionPorSemana = primerasMarcaciones.reduce((acumulador, marcacion) => {
      const fechaMarcacion = dayjs(marcacion.tiempo_marcacion);

      // Calcular la semana desde el inicio de la membresía
      const diasDesdeInicio = fechaMarcacion.diff(inicioMem, 'day');
      const semana = Math.floor(diasDesdeInicio / 7) + 1;

      // Buscar o crear el grupo para esta semana
      let grupo = acumulador.find((g) => g.semana === semana);
      if (!grupo) {
        grupo = { semana, items: [] };
        acumulador.push(grupo);
      }

      // Añadir la marcación al grupo
      grupo.items.push(marcacion);

      return acumulador;
    }, []);

    // Retornar el objeto original con el nuevo array `marcacionPorSemana`
    return { ...obj, marcacionPorSemana };
  });
}

function agruparPrimeraMarcacionGlobal(data) {
  const marcacionesPorSemanaGlobal = {};

  data.forEach((obj) => {
    const inicioMem = dayjs(obj.fec_inicio_mem);

    // Filtrar la primera marcación de cada día
    const primerasMarcaciones = Object.values(
      obj.tb_marcacions.reduce((acumulador, marcacion) => {
        const fechaDia = dayjs(marcacion.tiempo_marcacion).format('YYYY-MM-DD');
        if (
          !acumulador[fechaDia] ||
          dayjs(marcacion.tiempo_marcacion).isBefore(
            acumulador[fechaDia].tiempo_marcacion
          )
        ) {
          acumulador[fechaDia] = marcacion; // Guardar la más temprana del día
        }
        return acumulador;
      }, {})
    );

    // Agrupar las primeras marcaciones por semana
    primerasMarcaciones.forEach((marcacion) => {
      const fechaMarcacion = dayjs(marcacion.tiempo_marcacion);

      // Calcular la semana desde el inicio de la membresía
      const diasDesdeInicio = fechaMarcacion.diff(inicioMem, 'day');
      const semana = Math.floor(diasDesdeInicio / 7) + 1;

      // Inicializar el grupo de la semana si no existe
      if (!marcacionesPorSemanaGlobal[semana]) {
        marcacionesPorSemanaGlobal[semana] = { semana, items: [] };
      }

      // Añadir la marcación al grupo global
      marcacionesPorSemanaGlobal[semana].items.push({
        ...marcacion,
        fec_inicio_mem: obj.fec_inicio_mem,
        tb_marcacions: obj.tb_marcacions,
        marcacionPorSemana: obj.marcacionPorSemana,
      });
    });
  });

  // Convertir el objeto en un array
  return Object.values(marcacionesPorSemanaGlobal);
}

// const { data: dataRenovacion } = await PTApi.get(
// 	`/venta/reporte/obtener-estado-cliente-resumen/691`,
// 	{
// 		params: {
// 			arrayDate: [
// 				formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
// 				formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
// 			],
// 			id_empresa: 598,
// 		},
// 	}
// );

// const { data: dataReinscritos } = await PTApi.get(
// 	`/venta/reporte/obtener-estado-cliente-resumen/692`,
// 	{
// 		params: {
// 			arrayDate: [
// 				formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
// 				formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
// 			],
// 			id_empresa: 598,
// 		},
// 	}
// );

// const { data: dataNuevos } = await PTApi.get(
// 	`/venta/reporte/obtener-nuevos-clientes-resumen`,
// 	{
// 		params: {
// 			arrayDate: [
// 				formatDateToSQLServerWithDayjs(RANGE_DATE[0]),
// 				formatDateToSQLServerWithDayjs(RANGE_DATE[1]),
// 			],
// 			id_empresa: 598,
// 		},
// 	}
// );
const groupByIdOrigen = (data) => {
  return data.reduce((acc, item) => {
    const idOrigen = item.tb_ventum.id_origen;

    // Busca si ya existe un grupo para este id_origen
    let group = acc.find((g) => g.id_origen === idOrigen);

    if (!group) {
      // Si no existe, crea uno nuevo
      group = { id_origen: idOrigen, items: [] };
      acc.push(group);
    }

    // Agrega el elemento al grupo correspondiente
    group.items.push(item);
    return acc;
  }, []);
};

// Agrupar por id_pgm con categorías separadas
function agruparVentasConDetalles({
  ventasProgramaNuevo = [],
  ventasProgramaReinscritos = [],
  ventasProgramaRenovaciones = [],
  ventasProgramaTraspasos = [],
  ventasProgramaTransferencias = [],
}) {
  const agrupados = {};

  const agregarDetalles = (array, tipo) => {
    array?.forEach((venta) => {
      const { name_pgm, id_pgm, tb_image, detalle_ventaMembresium } = venta;

      // Generar una clave única para el agrupamiento
      const key = `${name_pgm}_${id_pgm}`;

      // Si el grupo no existe, se inicializa
      if (!agrupados[key]) {
        agrupados[key] = {
          name_pgm,
          id_pgm,
          tb_image: [],
          detallesNuevos: [],
          detallesReinscritos: [],
          detallesRenovaciones: [],
          detallesTraspasos: [],
          detalleTransferencias: [],
        };
      }

      // Agregar `tb_image` solo si no está ya incluido
      if (!agrupados[key].tb_image.some((img) => img === tb_image)) {
        agrupados[key].tb_image.push(tb_image);
      }
      console.log(tipo, 'dddd');

      // Agregar el detalle al tipo correspondiente
      agrupados[key][tipo].push(detalle_ventaMembresium);
    });
  };

  // Procesar cada tipo de ventas
  agregarDetalles(ventasProgramaNuevo, 'detallesNuevos');
  agregarDetalles(ventasProgramaReinscritos, 'detallesReinscritos');
  agregarDetalles(ventasProgramaRenovaciones, 'detallesRenovaciones');
  agregarDetalles(ventasProgramaTraspasos, 'detallesTraspasos');
  agregarDetalles(ventasProgramaTransferencias, 'detalleTransferencias');

  // Convertir el objeto agrupado en un array
  return Object.values(agrupados);
}
