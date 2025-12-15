import React from "react";
import TablaRenovaciones from "./TablaRenovaciones.jsx";


export default function RenovacionesPanel({
  baseDate = new Date(),
  months = 8,
  items = [],
  title = "Renovaciones y Vencimientos",
  initDay,
  cutDay,
  vencimientosMap = {},
}) {
  return (
    <div>
      <TablaRenovaciones
        items={items}
        datosVencimientos={vencimientosMap}
        months={months}
        base={baseDate}
        title={title}
        initDay={initDay}
        cutDay={cutDay}
        carteraHistoricaInicial={0}
      />
    </div>
  );
}