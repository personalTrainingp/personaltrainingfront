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

  const detectRed = (str = "") => {
    const s = String(str).toLowerCase();
    if (s.includes("tiktok") || s.includes("tik")) return "tiktok";
    if (s.includes("insta") || s.includes("ig")) return "instagram";
    if (s.includes("meta") || s.includes("fb")) return "Meta";
    return "otros";
  };

  const acc = Object.create(null);

  for (const it of dataMkt) {
    const d = toLimaDate(it?.fecha);
    if (!d) continue;

    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const from = clamp(Number(initialDay || 1), 1, lastDay);
    const to = clamp(Number(cutDay || lastDay), from, lastDay);
    const dia = d.getDate();
    if (dia < from || dia > to) continue;

    const mesNombre = aliasMes(MESES[d.getMonth()]);
    const key = `${d.getFullYear()}-${mesNombre}`;

    // inicialización
    if (!acc[key]) {
      acc[key] = {
        inversiones_redes: 0,
        leads: 0,
        cpl: 0,
        cac: 0,
        por_red: { instagram: 0, tiktok: 0, facebook: 0, otros: 0 },
      };
    }

    const inv = Number(it?.monto || 0);
    const leadsNum = Number(String(it?.cantidad ?? "0").replace(/[^\d.]/g, "")) || 0;
    const red = detectRed(it?.descripcion || it?.nombre_red || it?.canal || "");

    acc[key].inversiones_redes += inv;
    acc[key].leads += leadsNum;
    acc[key].por_red[red] += inv; 
  }

  // cpl = inversión / leads (si hay leads)
  for (const k of Object.keys(acc)) {
    const { inversiones_redes, leads } = acc[k];
    acc[k].cpl = leads > 0 ? inversiones_redes / leads : 0;
  }

  return acc;
}
