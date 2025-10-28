const API_BASE = (
  import.meta.env.VITE_API_URL 
  || "http://localhost:4000/api" 
).replace(/\/+$/, "");

const API_URL  = `${API_BASE}/reserva_monk_fit`;
const ESTADOS_PARAM_URL = `${API_BASE}/parametros/get_params/citas/estados-todos`;


const toISO = (v) => {
  if (!v) return null;
  if (v instanceof Date && !isNaN(v)) return v.toISOString();
  const s = String(v).trim();
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(s)) {
    const d = new Date(s);
    return isNaN(d) ? null : d.toISOString();
  }
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
  if (m) {
    const [, dd, MM, yyyy, hh = "00", mm = "00"] = m;
    const d = new Date(+yyyy, +MM - 1, +dd, +hh, +mm, 0, 0);
    return isNaN(d) ? null : d.toISOString();
  }
  const d = new Date(s);
  return isNaN(d) ? null : d.toISOString();
};

const json = async (res, fallbackMessage) => {
  if (!res.ok) {
    let msg = fallbackMessage;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
};

export const reservasApi = {
  async list({ limit = 10, offset = 0, page, search = "" } = {}) {
    const currentPage = page ?? (limit > 0 ? Math.floor(offset / limit) + 1 : 1);
    const url = new URL(API_URL);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("page", String(currentPage));
    if (search) url.searchParams.set("search", search);
    const res = await fetch(url.toString());
    return json(res, "Error al obtener reservas");
  },

  async listEstados() {
    const res = await fetch(ESTADOS_PARAM_URL);
    return json(res, "Error al cargar estados");
  },

  async create(data) {
    const payload = { ...data, fecha: toISO(data.fecha), id_estado_param: data.id_estado_param ?? null };
    const res = await fetch(API_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return json(res, "Error al crear reserva");
  },

  async update(id, data) {
    const payload = { ...data, fecha: toISO(data.fecha), id_estado_param: data.id_estado_param ?? null };
    const res = await fetch(`${API_URL}/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    return json(res, "Error al actualizar reserva");
  },

  async remove(id) {
    const res = await fetch(`${API_URL}/delete/${id}`, { method: "PUT" });
    return json(res, "Error al eliminar reserva");
  },

  async seed() {
    const res = await fetch(`${API_URL}/seed`, { method: "POST" });
    return json(res, "Error al crear reserva de prueba");
  },
};