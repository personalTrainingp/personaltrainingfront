import PTApi from "@/common/api/PTApi";

export const entrenamientosApi = {
    // Obtener catálogo de ejercicios
    async getCatalogo() {
        try {
            // Ruta Backend: GET /api/entrenamiento/catalogo
            const { data } = await PTApi.get('/entrenamiento/catalogo');
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error getCatalogo:", error);
            return { ok: false, msg: error.response?.data?.msg || "Error al obtener catálogo" };
        }
    },

    // Obtener historial de un cliente
    async getHistorial(idCliente) {
        try {
            // Ruta Backend: GET /api/entrenamiento/historial/:id
            const { data } = await PTApi.get(`/entrenamiento/historial/${idCliente}`);
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error getHistorial:", error);
            return { ok: false, msg: error.response?.data?.msg || "Error al obtener historial" };
        }
    },

    async saveHistorial(payload) {
        try {
            const { data } = await PTApi.post('/entrenamiento/historial', payload);
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error saveHistorial:", error);
            throw error;
        }
    },

    async updateHistorial(id, payload) {
        try {
            const { data } = await PTApi.put(`/entrenamiento/historial/${id}`, payload);
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error updateHistorial:", error);
            throw error;
        }
    },


    async createCatalogo(payload) {
        try {
            const { data } = await PTApi.post('/entrenamiento/catalogo', payload);
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error createCatalogo:", error);
            return { ok: false, msg: error.response?.data?.msg || "Error al crear ejercicio" };
        }
    },


    async updateCatalogo(id, payload) {
        try {
            const { data } = await PTApi.put(`/entrenamiento/catalogo/${id}`, payload);
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error updateCatalogo:", error);
            return { ok: false, msg: error.response?.data?.msg || "Error al actualizar ejercicio" };
        }
    },

    async getClientesConHistorial(params) {
        try {
            const { data } = await PTApi.get('/entrenamiento/clientes-fs45', { params });
            return { rows: data.rows, hasMore: data.hasMore };
        } catch (error) {
            console.error("Error getClientesConHistorial:", error);
            return { rows: [], hasMore: false };
        }
    },

    async getHistorialGlobal({ from, to }) {
        try {
            const { data } = await PTApi.get('/entrenamiento/historial-global', { params: { from, to } });
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error getHistorialGlobal:", error);
            return { ok: false, data: [], msg: error.message };
        }
    },

    async getTiposEjercicio() {
        const res = await PTApi.get('/entrenamiento/tipos-ejercicio');
        return res.data;
    },

    async createTipoEjercicio(payload) {
        // payload: { nombre: string, usa_peso: boolean, usa_tiempo: boolean }
        const res = await PTApi.post('/entrenamiento/tipos-ejercicio', payload);
        return { ok: true, data: res.data.data };
    },

    async getClientesVigentes({ empresa = 598, year, month, cutDay }) {
        try {
            const { data } = await PTApi.get('/parametros/membresias/vigentes/lista', {
                params: {
                    empresa,
                    year: year || new Date().getFullYear(),
                    selectedMonth: month || (new Date().getMonth() + 1),
                    cutDay: cutDay || new Date().getDate()
                }
            });
            return { ok: true, data: data?.vigentes || [] };
        } catch (error) {
            console.error("Error getClientesVigentes:", error);
            return { ok: false, data: [] };
        }
    },

    // RESULTADOS RETO
    async getResultadosReto(idCliente) {
        try {
            const { data } = await PTApi.get(`/entrenamiento/historial-evolutivo/${idCliente}`);
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error getResultadosReto:", error);
            return { ok: false, msg: error.message };
        }
    },

    async saveResultadosReto(payload) {
        try {
            const { data } = await PTApi.post('/entrenamiento/resultados', payload);
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error saveResultadosReto:", error);
            return { ok: false, msg: error.response?.data?.msg || "Error al guardar resultados" };
        }
    },

    // TURNOS
    async getTurnos() {
        try {
            const { data } = await PTApi.get('/entrenamiento/turnos');
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error getTurnos:", error);
            return { ok: false, msg: error.message };
        }
    },

    async saveTurno(payload) {
        try {
            const { data } = await PTApi.post('/entrenamiento/turnos', payload);
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error saveTurno:", error);
            return { ok: false, msg: error.response?.data?.msg || "Error al guardar turno" };
        }
    },

    async updateTurno(id, payload) {
        try {
            const { data } = await PTApi.put(`/entrenamiento/turnos/${id}`, payload);
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error updateTurno:", error);
            return { ok: false, msg: error.response?.data?.msg || "Error al actualizar turno" };
        }
    },

    async getAsistencia(idVenta) {
        try {
            const { data } = await PTApi.get(`/entrenamiento/asistencia/${idVenta}`);
            return { ok: true, data: data }; // Endpoint might return data at root or data.data
        } catch (error) {
            console.error("Error getAsistencia:", error);
            return { ok: false, msg: error.message };
        }
    },

    async getAsistenciasConPlan(idVenta) {
        try {
            // Pass idVenta to filter on backend
            const { data } = await PTApi.get('/entrenamiento/asistencias-con-plan', { params: { id_venta: idVenta } });
            return { ok: true, data: data };
        } catch (error) {
            console.error("Error getAsistenciasConPlan:", error);
            return { ok: false, msg: error.message };
        }
    },

    async asignarPlan(dataPayload) {
        try {
            const { data } = await PTApi.post('/entrenamiento/asignar-plan', dataPayload);
            return { ok: true, data: data };
        } catch (error) {
            console.error("Error asignarPlan:", error);
            return { ok: false, msg: error.message };
        }
    },

    async registrarAsistencia(dataPayload) {
        try {
            const { data } = await PTApi.post('/entrenamiento/registrar-asistencia', dataPayload);
            return { ok: true, data: data };
        } catch (error) {
            console.error("Error registrarAsistencia:", error);
            return { ok: false, msg: error.message };
        }
    },

    async getMembresiasActivas(idCliente, date = null) {
        try {
            const params = {};
            if (date) params.fecha = date;

            const { data } = await PTApi.get(`/entrenamiento/membresias-activas/${idCliente}`, { params });
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error getMembresiasActivas:", error);
            return { ok: false, msg: error.message };
        }
    },

    async getVentasCliente(idCliente) {
        try {
            const { data } = await PTApi.get(`/entrenamiento/ventas/${idCliente}`);
            return { ok: true, data: data.data };
        } catch (error) {
            console.error("Error getVentasCliente:", error);
            return { ok: false, msg: error.message };
        }
    },

    async deleteHistorial(id) {
        try {
            const { data } = await PTApi.delete(`/entrenamiento/historial/${id}`);
            return { ok: true, data: data };
        } catch (error) {
            console.error("Error deleteHistorial:", error);
            return { ok: false, msg: error.response?.data?.msg || "Error al eliminar registro histórico" };
        }
    }
};
