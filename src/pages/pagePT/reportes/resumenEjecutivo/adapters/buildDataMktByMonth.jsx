export function buildDataMktByMonth(
  dataMkt = [],
  initialDay = 1,
  cutDay = 21,
  canalParams = []        // puedes pasar []
) {
  const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","setiembre","octubre","noviembre","diciembre"];
  const aliasMes = (m) => (m === "septiembre" ? "setiembre" : m);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const toLimaDate = (iso) => {
    if (!iso) return null;
    try {
      const clean = String(iso).trim().replace(" ", "T").replace(" +00:00","Z").replace("+00:00","Z");
      const d = new Date(clean);
      if (Number.isNaN(d.getTime())) return null;
      return new Date(d.getTime() - 5 * 60 * 60000);
    } catch { return null; }
  };

  // ---- 1) Mapa id -> slug (OBJETO, no array) ----
  const idToSlug = {};
  for (const p of (Array.isArray(canalParams) ? canalParams : [])) {
    const id = String(p?.id_param ?? p?.id ?? p?.value ?? "").trim();
    const label = String(p?.label_param ?? p?.label ?? "").toLowerCase();
    if (!id) continue;
    if (label.includes("tik"))                 idToSlug[id] = "tiktok";
    else if (label.includes("meta") || label.includes("face"))
                                               idToSlug[id] = "meta";
  }

  // Por si tu API no siempre envia la misma llave
const getCanalId = (it) => {
  // cubre todas las variantes posibles
  return (
    it?.id_red ??
    it?.idRed ??
    it?.id_param ??
    it?.idParametro ??
    it?.red_id ??
    it?.tb_parametro?.id_param ??
    it?.parametro_red?.id_param ??
    null
  );
};


  const getCanalLabel = (it) =>
    String(it?.label_red ?? it?.nombre_red ?? it?.descripcion ?? it?.canal ?? "").toLowerCase();

  const ensureMonth = (acc, key) => {
    if (!acc[key]) {
      acc[key] = {
        inversiones_redes: 0,
        leads: 0,
        por_red: {},        // inversión por canal (id y slug)
        leads_por_red: {},  // leads por canal (id y slug)
        cpl: 0,
        cpl_por_red: {},
      };
    }
  };
  const add = (obj, k, v) => {
    if (k == null) return;
    const key = String(k).trim().toLowerCase();
    obj[key] = (obj[key] || 0) + Number(v || 0);
  };
// Para BUCKETS diarios "00:00:00 +00:00" que representan el día de LIMA
const toLimaBucketDate = (iso) => {
  if (!iso) return null;
  try {
    const clean = String(iso)
      .trim()
      .replace(" ", "T")
      .replace(" +00:00", "Z")
      .replace("+00:00", "Z");
    const d = new Date(clean);
    if (Number.isNaN(d.getTime())) return null;
    return new Date(d.getTime() + 5 * 60 * 60 * 1000);
  } catch {
    return null;
  }
};

  const acc = Object.create(null);

  for (const it of (Array.isArray(dataMkt) ? dataMkt : [])) {
    const d = toLimaBucketDate(it?.fecha);
    if (!d) continue;

    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const from = clamp(Number(initialDay || 1), 1, lastDay);
    const to   = clamp(Number(cutDay   || lastDay), from, lastDay);
    const dia  = d.getDate();
    if (dia < from || dia > to) continue;

    const mesNombre = aliasMes(MESES[d.getMonth()]);
    const key = `${d.getFullYear()}-${mesNombre}`;
    ensureMonth(acc, key);

    const inv   = Number(it?.monto ?? 0);
    const leads = Number(String(it?.cantidad ?? "0").replace(/[^\d.]/g, "")) || 0;

    const id         = getCanalId(it) != null ? String(getCanalId(it)).trim() : "";
    const labelStr   = getCanalLabel(it);
    const slugParam  = id ? idToSlug[id] : "";
    const slugLabel  = labelStr.includes("tik") ? "tiktok" :
                       (labelStr.includes("meta") || labelStr.includes("face")) ? "meta" : "";
    const slug       = (slugParam || slugLabel || "").toLowerCase();

    acc[key].inversiones_redes += inv;
    acc[key].leads             += leads;

    if (id)   { add(acc[key].por_red, id, inv);        add(acc[key].leads_por_red, id, leads); }
    if (slug) { add(acc[key].por_red, slug, inv);      add(acc[key].leads_por_red, slug, leads); }
  }

  for (const k of Object.keys(acc)) {
    const { inversiones_redes, leads, por_red, leads_por_red } = acc[k];
    acc[k].cpl = leads > 0 ? inversiones_redes / leads : 0;

    acc[k].cpl_por_red = {};
    for (const canal of Object.keys(por_red)) {
      const invCanal   = por_red[canal] || 0;
      const leadsCanal = leads_por_red[canal] || 0;
      acc[k].cpl_por_red[canal] = leadsCanal > 0 ? invCanal / leadsCanal : 0;
    }
  }

  return acc;
  
}
