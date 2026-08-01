import React, { useMemo, useState } from "react";
import { NumberFormatMoney } from "@/components/CurrencyMask";

const DIAS = [
  "DOMINGO",
  "LUNES",
  "MARTES",
  "MIÉRCOLES",
  "JUEVES",
  "VIERNES",
  "SÁBADO",
];

export const DataCalendario = ({
  data = [],
  initialYear = 2026,
  initialMonth = 1,
  diaInicio,
  diaFin=31
}) => {

  const [{ anio, mes }] = useState({
    anio: initialYear,
    mes: initialMonth,
  });

  const totalDias = new Date(anio, mes, 0).getDate();

  // COLUMNAS
const columnas = useMemo(() => {
  const inicio = Math.max(1, diaInicio ?? 1);
  const fin = Math.min(totalDias, diaFin);

  return Array.from({ length: fin - inicio + 1 }, (_, i) => {
    const dia = inicio + i;
    const fecha = new Date(anio, mes - 1, dia);

    return {
      dia,
      nombre: DIAS[fecha.getDay()],
    };
  });
}, [anio, mes, totalDias, diaInicio, diaFin]);

  // EMPLEADOS
  const empleados = useMemo(() => {

    const ventas = {};
    const socios = {};

    data.forEach(dia => {

      dia.items.forEach(v => {

        const nombre = v.empl;

        if (!ventas[nombre]) {

          ventas[nombre] = {
            nombre,
            dias: {},
            total: 0,
          };

          socios[nombre] = {
            nombre,
            dias: {},
            total: 0,
          };

        }

        ventas[nombre].dias[dia.dia] =
          (ventas[nombre].dias[dia.dia] || 0) + v.montoTotal;

        ventas[nombre].total += v.montoTotal;

        socios[nombre].dias[dia.dia] =
          (socios[nombre].dias[dia.dia] || 0) + 1;

        socios[nombre].total++;

      });

    });

    return { ventas, socios };

  }, [data]);

  // RESUMEN
  const resumen = useMemo(() => {

    const ventasDia = {};
    const sociosDia = {};

    data.forEach(dia => {

      ventasDia[dia.dia] = dia.items.reduce(
        (t, x) => t + x.montoTotal,
        0
      );

      sociosDia[dia.dia] = dia.items.length;

    });

    return { ventasDia, sociosDia };

  }, [data]);

  return (

    <div className="table-responsive">
      {initialMonth}
      <table className="table table-bordered text-center align-middle">

        <thead>

          <tr>
            <th>Asesor</th>
            {
              columnas.map(c => (

                <th key={c.dia}>
                  {c.nombre}
                  <br />
                  {c.dia}
                </th>

              ))
            }
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {
            Object.values(empleados.ventas).map(emp => (

              <tr key={emp.nombre}>

                <td>{emp.nombre}</td>

                {
                  columnas.map(c => (

                    <td key={c.dia}>
                      <NumberFormatMoney
                        amount={emp.dias[c.dia] || 0}
                      />
                    </td>

                  ))
                }

                <td>
                  <NumberFormatMoney amount={emp.total} />
                </td>

              </tr>

            ))
          }

          {
            Object.values(empleados.socios).map(emp => (

              <tr key={emp.nombre + "socios"}>


                <td>{emp.nombre} SOCIOS</td>

                {
                  columnas.map(c => (

                    <td key={c.dia}>
                      {emp.dias[c.dia] || 0}
                    </td>

                  ))
                }

                <td>{emp.total}</td>

              </tr>

            ))
          }

          <tr className="fw-bold">

            <td colSpan={1}>VENTA X DÍA</td>

            {
              columnas.map(c => (

                <td key={c.dia}>
                  <NumberFormatMoney
                    amount={resumen.ventasDia[c.dia] || 0}
                  />
                </td>

              ))
            }

            <td></td>

          </tr>

          <tr className="fw-bold">

            <td colSpan={1}>SOCIOS X DÍA</td>

            {
              columnas.map(c => (

                <td key={c.dia}>
                  {resumen.sociosDia[c.dia] || 0}
                </td>

              ))
            }

            <td></td>

          </tr>

        </tbody>

      </table>

    </div>

  );

};