import React, { useMemo } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import dayjs from "dayjs";

function generarSlots(inicio = "06:00", fin = "20:30") {
  const slots = [];
  let cursor = dayjs(inicio, "HH:mm");
  const end = dayjs(fin, "HH:mm");

  while (cursor.isBefore(end) || cursor.isSame(end)) {
    slots.push(cursor.format("HH:mm"));
    cursor = cursor.add(30, "minute");
  }

  return slots; // ["06:00","06:30","07:00",...]
}

// ¿slotTime está dentro del bloque?
function slotDentroDeBloque(slotTime, bloque) {
  const t = dayjs(slotTime, "HH:mm");
  const ini = dayjs(bloque.inicio, "HH:mm");
  const fin = dayjs(bloque.fin, "HH:mm");
  // incluimos inicio, excluimos fin para no "sangrar" al siguiente bloque
  return t.isSame(ini) || (t.isAfter(ini) && t.isBefore(fin));
}

function getColorForTipo(tipo, legendColors) {
  const found = legendColors.find((e) => e.tipo_horario === tipo);
  return found ? found.color : "#dcdcdc"; // gris default
}

const dias = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO", "DOMINGO"];
const horas = Array.from({ length: 29 }, (_, i) =>
  dayjs("06:00", "HH:mm").add(i * 30, "minute").format("HH:mm")
);

export const ViewDataHorarios = ({   data = [],
  legendColors = [],
  horaInicio = "06:00",
  horaFin = "20:30" }) => {
  // todos los slots de 30 minutos
  const slots = useMemo(
    () => generarSlots(horaInicio, horaFin),
    [horaInicio, horaFin]
  );

  // para cada empleado y slot => qué tipo_horario aplica
  const buildMatrixEmpleadoSlot = (empleado) => {
    return slots.map((slot) => {
      const bloque = empleado.bloques.find((b) =>
        slotDentroDeBloque(slot, b)
      );
      return bloque ? bloque.tipo_horario : null;
    });
  };

  // precalculamos una "matriz": fila = empleado, col = slot
  const rowsWithSlots = useMemo(() => {
    return data.map((empleado) => {
      const slotTypes = buildMatrixEmpleadoSlot(empleado);
      return { ...empleado, slotTypes };
    });
  }, [data, slots]);

  // calculamos la fila de totales por slot
  const totalesPorSlot = useMemo(() => {
    return slots.map((_, idx) => {
      let count = 0;
      rowsWithSlots.forEach((emp) => {
        if (emp.slotTypes[idx]) count += 1;
      });
      return count;
    });
  }, [rowsWithSlots, slots]);

  // Header de las columnas de slots (ej "6:00 AM", "6:30 AM"...)
  const headerSlotHumano = (slot) => dayjs(slot, "HH:mm").format("h:mm A");

  // celda individual pintada
  const CeldaSlot = ({ tipo }) => (
    <div
      style={{
        width: "100%",
        height: "24px",
        backgroundColor: tipo
          ? getColorForTipo(tipo, legendColors)
          : "#666666", // gris oscuro como en tu imagen
        border: "1px solid #000",
      }}
    />
  );

  // render de una fila normal (empleado)
  const rowBodyTemplate = (rowData, colSlotIdx) => {
    const tipo = rowData.slotTypes[colSlotIdx];
    return <CeldaSlot tipo={tipo} />;
  };

  // fila totales (la amarilla final)
  const TotalesRow = () => {
    return (
      <tr>
        {/* celdas fijas de la izquierda */}
        <td
          style={{
            position: "sticky",
            left: 0,
            background: "#fff200",
            border: "1px solid #000",
            fontWeight: "bold",
            minWidth: "250px",
          }}
          colSpan={3}
        >
          CANT. COLABORADORES
        </td>

        {/* una celda por slot con el número */}
        {totalesPorSlot.map((n, i) => (
          <td
            key={i}
            style={{
              background: "#fff200",
              border: "1px solid #000",
              textAlign: "center",
              fontWeight: "bold",
              minWidth: "60px",
            }}
          >
            {n}
          </td>
        ))}
      </tr>
    );
  };

  return (
    <div
      style={{
        border: "2px solid #000",
        fontSize: "12px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          overflowX: "auto",
          overflowY: "auto",
          maxHeight: "70vh",
          position: "relative",
        }}
      >
        <table
          style={{
            borderCollapse: "collapse",
            minWidth: 250 + slots.length * 60 + "px",
          }}
        >
          <thead>
            {/* fila header grande (HORA / DIA / horas por slot) */}
            <tr>
              <th
                style={{
                  position: "sticky",
                  left: 0,
                  background: "#fff200",
                  border: "1px solid #000",
                  minWidth: "150px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                HORA
              </th>
              <th
                style={{
                  position: "sticky",
                  left: 150,
                  background: "#fff200",
                  border: "1px solid #000",
                  minWidth: "100px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              >
                DIA
              </th>
              <th
                style={{
                  position: "sticky",
                  left: 250,
                  background: "#fff200",
                  border: "1px solid #000",
                  minWidth: "0px",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
              ></th>

              {slots.map((slot, idx) => (
                <th
                  key={idx}
                  style={{
                    background: "#fff200",
                    border: "1px solid #000",
                    minWidth: "60px",
                    textAlign: "center",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                  }}
                >
                  {headerSlotHumano(slot)}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rowsWithSlots.map((emp, rowIdx) => (
              <tr key={emp.id || rowIdx}>
                {/* Columna izquierda fija: NOMBRE */}
                <td
                  style={{
                    position: "sticky",
                    left: 0,
                    background: "#fff",
                    border: "1px solid #000",
                    minWidth: "150px",
                    fontWeight: "bold",
                    verticalAlign: "top",
                  }}
                >
                  {emp.nombre}
                </td>

                {/* Columna fija: los textos de días / rangos */}
                <td
                  style={{
                    position: "sticky",
                    left: 150,
                    background: "#fff",
                    border: "1px solid #000",
                    minWidth: "100px",
                    verticalAlign: "top",
                    textAlign: "center",
                    fontSize: "11px",
                    lineHeight: "14px",
                  }}
                >
                  {emp.diasTexto?.map((linea, i) => (
                    <div key={i}>{linea}</div>
                  ))}
                </td>
                {/* Columna separadora gris fina como en tu excel */}
                <td
                  style={{
                    position: "sticky",
                    left: 250,
                    background: "#666",
                    border: "1px solid #000",
                    minWidth: "0px",
                    width: "4px",
                  }}
                ></td>
                {/* slots pintados */}
                {slots.map((slot, colIdx) => (
                  <td
                    key={slot}
                    style={{
                      border: "1px solid #000",
                      padding: 0,
                      minWidth: "60px",
                    }}
                  >
                    {rowBodyTemplate(emp, colIdx)}
                  </td>
                ))}
              </tr>
            ))}

            {/* fila totales amarilla */}
            <TotalesRow />
          </tbody>
        </table>
      </div>

      {/* leyenda de colores */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "8px" }}>
        {legendColors.map((item) => (
          <div
            key={item.tipo_horario}
            style={{
              display: "flex",
              alignItems: "center",
              marginRight: "16px",
              fontSize: "12px",
            }}
          >
            <div
              style={{
                width: "18px",
                height: "18px",
                backgroundColor: item.color,
                border: "1px solid #000",
                marginRight: "4px",
              }}
            />
            <span>{item.tipo_horario.toUpperCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
