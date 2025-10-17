export function buildDataMktByMonth(
  dataMkt = [],
  initialDay = 1,
  cutDay = 21,
  canalParams = []
) {
  const MESES = ["enero","febrero","marzo","abril","mayo","junio","julio","agosto","setiembre","octubre","noviembre","diciembre"];
  const aliasMes = (m) => (m === "septiembre" ? "setiembre" : m);
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  
  const toLimaDate = (iso) => {
    if (!iso) return null;
    try {
      const clean = String(iso).trim().replace(" ", "T").replace(" +00:00", "Z").replace("+00:00", "Z");
      const d = new Date(clean);
      if (Number.isNaN(d.getTime())) return null;
      return new Date(d.getTime() - 5 * 60 * 60000);
    } catch { return null; }
  };

  const paramsArr = Array.isArray(canalParams) ? canalParams : [];
  const dataArr   = Array.isArray(dataMkt) ? dataMkt : [];

  const idToSlug = [];

for (const p of paramsArr) {
  const id = String(p?.id_param ?? p?.id ?? p?.value ?? "").trim();
  const label = String(p?.label_param ?? p?.label ?? "").toLowerCase();
  if (!id) continue;
  if (label.includes("tik"))  idToSlug.push({ id, slug: "tiktok" });
  if (label.includes("meta") || label.includes("face")) idToSlug.push({ id, slug: "meta" });
}

  
  const getCanalId = (it) =>
    it?.id_red ?? it?.idRed ?? it?.red_id ?? it?.id_canal ?? it?.canal_id ?? null;

  const getCanalLabel = (it) =>
    String(it?.label_red ?? it?.nombre_red ?? it?.descripcion ?? it?.canal ?? "").toLowerCase();

  const ensureMonth = (acc, key) => {
    if (!acc[key]) {
      acc[key] = {
        inversiones_redes: 0,
        leads: 0,
        por_red: {},         
        leads_por_red: {},   
        cpl_por_red: {},    
      };
    }
  };
  const add = (obj, k, v) => {
    if (!k && k !== 0) return;
    const key = String(k).trim().toLowerCase();
    obj[key] = (obj[key] || 0) + Number(v || 0);
  };

  const acc = Object.create(null);

  for (const it of dataArr) {
    const d = toLimaDate(it?.fecha);
    if (!d) continue;

    const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    const from = clamp(Number(initialDay || 1), 1, lastDay);
    const to   = clamp(Number(cutDay || lastDay), from, lastDay);
    const dia  = d.getDate();
    if (dia < from || dia > to) continue;

    const mesNombre = aliasMes(MESES[d.getMonth()]);
    const key = `${d.getFullYear()}-${mesNombre}`;
    ensureMonth(acc, key);

    const inv   = Number(it?.monto ?? 0);
    const leads = Number(String(it?.cantidad ?? "0").replace(/[^\d.]/g, "")) || 0;

    const idRaw = getCanalId(it);
    const id    = idRaw != null ? String(idRaw).trim() : "";
    const slugFromParams = id ? idToSlug[id] : "";
    const label = getCanalLabel(it);
    const slugFromLabel =
      label.includes("tik") ? "tiktok" :
      (label.includes("meta") || label.includes("face")) ? "meta" : "";
  console.log({idToSlug, slugFromParams});
    
    const slug = (slugFromParams || slugFromLabel || "").toLowerCase();
    
    acc[key].inversiones_redes += inv;
    acc[key].leads             += leads;
    
    if (id)   add(acc[key].por_red, id,   inv);   
    if (slug) add(acc[key].por_red, slug, inv);   
  }

  for (const k of Object.keys(acc)) {
    const invBy = acc[k].por_red;
    const leadsBy = acc[k].leads_por_red || {};
    const cplBy = acc[k].cpl_por_red || (acc[k].cpl_por_red = {});
    for (const canal of Object.keys(invBy)) {
      const invCanal   = invBy[canal] || 0;
      const leadsCanal = leadsBy[canal] || 0;
      cplBy[canal] = leadsCanal > 0 ? invCanal / leadsCanal : 0;
    }
  }

  
  return acc;
}
