const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:4000/api").replace(/\/+$/, "");
const API_URL = `${API_BASE}/cliente_mf`;

const json = async (res, fallbackMessage) => {
  if (!res.ok) {
    let msg = fallbackMessage;
    try {
      const j = await res.json();
      if (j?.message) msg = j.message;
    } catch {
    }
    throw new Error(msg);
  }
  return res.json();
};

export const clienteMfApi = {
  async list({ limit = 30, page = 1, search = "" } = {}) {
    const url = new URL(API_URL);
    url.searchParams.set("limit", String(limit));
    url.searchParams.set("page", String(page));

    if (search) {
      url.searchParams.set("search", search);
      url.searchParams.set("q", search);
    }

    const res = await fetch(url.toString());
    return json(res, "Error al listar clientes MF"); 
  },

  async create(payload) {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return json(res, "Error al crear cliente MF");
  },

  async update(id, payload) {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    return json(res, "Error al actualizar cliente MF");
  },

  async remove(id) {
    // Borrado lógico
    const res = await fetch(`${API_URL}/delete/${id}`, {
      method: "PUT",
    });
    return json(res, "Error al eliminar cliente MF");
  },

  async seed() {
    const res = await fetch(`${API_URL}/seed`, { method: "POST" });
    return json(res, "Error al crear cliente de prueba");
  },
};
