// === Helper: convertir dataMkt -> dataMktByMonth ===
export function buildDataMktByMonth(dataMkt = [], initialDay = 1, cutDay = 21) {
  const MESES = [
    "enero","febrero","marzo","abril","mayo","junio",
    "julio","agosto","setiembre","octubre","noviembre","diciembre"
  ];
  const aliasMes = (m) => (m === "septiembre" ? "setiembre" : m);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const toLimaDate = (iso) => {
    if (!iso) return null;
    try {
      const d = new Date(iso);
      const utcMs = d.getTime() + d.getTimezoneOffset() * 60000;
      return new Date(utcMs - 5 * 60 * 60000);
    } catch {
      return null;
    }
  };

  // Acumulador por key `${anio}-${mes}`
  const acc = Object.create(null);

  for (const it of dataMkt) {
    const d = toLimaDate(it?.fecha);
    if (!d) continue;

    // Filtrado por rango de días del mes
    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const from = clamp(Number(initialDay || 1), 1, lastDay);
    const to = clamp(Number(cutDay || lastDay), from, lastDay);
    const dia = d.getDate();
    if (dia < from || dia > to) continue;

    const mesNombre = aliasMes(MESES[d.getMonth()]);
    const key = `${d.getFullYear()}-${mesNombre}`;

    if (!acc[key]) acc[key] = { inversiones_redes: 0, leads: 0, cpl: 0, cac: 0 };

    const inv = Number(it?.monto || 0);
    // "cantidad" viene como string (p.ej. "17 "), limpiamos y convertimos
    const leadsNum = Number(String(it?.cantidad ?? "0").replace(/[^\d.]/g, "")) || 0;

    acc[key].inversiones_redes += inv;
    acc[key].leads += leadsNum;
  }

  // cpl = inversión / leads (si hay leads)
  for (const k of Object.keys(acc)) {
    const { inversiones_redes, leads } = acc[k];
    acc[k].cpl = leads > 0 ? inversiones_redes / leads : 0;
    // Deja cac en 0 salvo que tú lo calcules/inyectes aparte
  }

  return acc;
}
