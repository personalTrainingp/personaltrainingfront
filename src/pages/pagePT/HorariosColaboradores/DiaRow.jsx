function DiaRow({ labelDia, bloquesDia, timeSlots }) {
  // bloquesDia = [
  //   {horaInicio:"07:00", horaFin:"13:00", bg:"blue", fechas:[...]},
  //   {horaInicio:"08:00", horaFin:"12:00", bg:"blue", fechas:[...]} // variante
  // ]

  const multipleBloques = bloquesDia.length > 1;

  return (
    <>
      <tr>
        {/* celda "DIA" */}
        <td style={{ backgroundColor: "#fff", fontWeight: "bold" }}>
          {multipleBloques ? (
            // si hay variaciones -> mostramos un acordeón trigger
            <details>
              <summary>{labelDia}</summary>
              <ul style={{ fontSize: "11px", marginLeft: "12px" }}>
                {bloquesDia.map((b, i) => (
                  <li key={i}>
                    {b.rango} ({b.fechas.join(", ")})
                  </li>
                ))}
              </ul>
            </details>
          ) : (
            // si NO hay variaciones -> solo texto
            <span>{labelDia}</span>
          )}
        </td>

        {/* celdas por cada slot */}
        {timeSlots.map((slot, idx) => {
          // ¿algún bloque cubre este slot?
          const activo = bloquesDia.some(b => {
            return slot >= b.horaInicio && slot < b.horaFin;
          });

          // si activo, ¿qué color?
          let bgColor = "transparent";
          if (activo) {
            // si hay más de un bloque que lo cubre, preferimos el primero
            const firstBlock = bloquesDia.find(
              b => slot >= b.horaInicio && slot < b.horaFin
            );
            bgColor = firstBlock?.bg || "gray";
          }

          return (
            <td
              key={idx}
              style={{
                backgroundColor: activo ? bgColor : "#4a4a4a", // gris oscuro como tu screenshot
                border: "1px solid #000",
                width: 40,
                height: 20
              }}
            />
          );
        })}
      </tr>
    </>
  );
}