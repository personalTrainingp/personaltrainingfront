// src/api/clienteApi.js
const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/+$/, "");
// Endpoint real que tienes:
const API_URL = `${API_BASE}/parametros/get_params/clientes/598`;

// --- cache en memoria para 4k+ clientes ---
let _cache = null; // [{value,label,email_cli,tel_cli,search}]
let _lastFetchOk = false;

const normalize = (s = "") =>
  String(s)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

const hydrate = (arr) =>
  (Array.isArray(arr) ? arr : []).map((r) => {
    const value = Number(r.value);
    const label = String(r.label || `Cliente #${value}`).trim();
    const email = (r.email_cli || "").toString().trim();
    const tel = (r.tel_cli || "").toString().trim();
    return {
      value,
      label,
      email_cli: email,
      tel_cli: tel,
      // campo de búsqueda normalizado
      search: normalize(`${label} ${email} ${tel}`),
    };
  });

async function ensureCache() {
  if (_cache && _lastFetchOk) return _cache;
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("No se pudo cargar clientes");
  const data = await res.json();
  _cache = hydrate(Array.isArray(data?.rows) ? data.rows : Array.isArray(data) ? data : []);
  _lastFetchOk = true;
  return _cache;
}


export const clienteApi = {
  async search({ term = "", page = 1, limit = 30 } = {}) {
    const cache = await ensureCache();
    const t = normalize(term);
    const filtered = t ? cache.filter((x) => x.search.includes(t)) : cache;
    const start = (page - 1) * limit;
    const end = start + limit;
    return {
      rows: filtered.slice(start, end),
      hasMore: end < filtered.length,
      total: filtered.length,
    };
  },
};
