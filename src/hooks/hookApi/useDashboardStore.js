import { useState } from 'react';
import AnalyticsApi from '@/common/api/AnalyticsApi';

const mensajeError = (error) => {
	const estado = error?.response?.status;
	if (estado === 401) return 'Tu sesión no es válida para el servicio de analytics. Vuelve a iniciar sesión.';
	if (estado === 400) return 'La configuración del widget no es válida.';
	if (estado === 502) return 'Hubo un error consultando los datos.';
	if (error?.code === 'ECONNABORTED') return 'La consulta tardó demasiado.';
	return 'No se pudo conectar con el servicio de analytics.';
};

export const useDashboardStore = () => {
	const [dashboards, setDashboards] = useState([]);
	const [dashboard, setDashboard] = useState(null);
	const [widgets, setWidgets] = useState([]);
	const [semantica, setSemantica] = useState(null);
	const [cargando, setCargando] = useState(false);
	const [error, setError] = useState('');

	const obtenerSemantica = async () => {
		try {
			const { data } = await AnalyticsApi.get('/semantica');
			setSemantica(data);
			return data;
		} catch (error) {
			console.log(error);
			setError(mensajeError(error));
			return null;
		}
	};

	const obtenerDashboards = async () => {
		try {
			const { data } = await AnalyticsApi.get('/dashboards');
			setDashboards(data);
			return data;
		} catch (error) {
			console.log(error);
			setError(mensajeError(error));
			return [];
		}
	};

	const obtenerDashboard = async (id) => {
		setCargando(true);
		try {
			const { data } = await AnalyticsApi.get(`/dashboards/${id}`);
			setDashboard(data.dashboard);
			setWidgets(data.widgets);
			setError('');
			return data;
		} catch (error) {
			console.log(error);
			setError(mensajeError(error));
			return null;
		} finally {
			setCargando(false);
		}
	};

	const crearWidget = async (idDashboard, widget) => {
		try {
			const { data } = await AnalyticsApi.post(`/dashboards/${idDashboard}/widgets`, widget);
			await obtenerDashboard(idDashboard);
			return data;
		} catch (error) {
			console.log(error);
			setError(mensajeError(error));
			return null;
		}
	};

	const actualizarWidget = async (idDashboard, id, campos) => {
		try {
			await AnalyticsApi.put(`/dashboards/${idDashboard}/widgets/${id}`, campos);
			setWidgets(prev => prev.map(w => (w.id === id ? { ...w, ...campos } : w)));
			return true;
		} catch (error) {
			console.log(error);
			setError(mensajeError(error));
			return false;
		}
	};

	const eliminarWidget = async (idDashboard, id) => {
		try {
			await AnalyticsApi.delete(`/dashboards/${idDashboard}/widgets/${id}`);
			setWidgets(prev => prev.filter(w => w.id !== id));
			return true;
		} catch (error) {
			console.log(error);
			setError(mensajeError(error));
			return false;
		}
	};

	const guardarLayout = async (idDashboard, posiciones) => {
		try {
			await AnalyticsApi.put(`/dashboards/${idDashboard}/layout`, posiciones);
			setWidgets(prev => prev.map(w => {
				const p = posiciones.find(x => x.id === w.id);
				return p ? { ...w, x: p.x, y: p.y, w: p.w, h: p.h } : w;
			}));
			return true;
		} catch (error) {
			console.log(error);
			setError(mensajeError(error));
			return false;
		}
	};

	const datosWidget = async (config, titulo) => {
		try {
			const { data } = await AnalyticsApi.post('/widgets/datos', { config, titulo });
			return data;
		} catch (error) {
			console.log(error);
			return { error: mensajeError(error) };
		}
	};

	const enviarChat = async (mensaje, dashboardId, ultimoWidget) => {
		try {
			const { data } = await AnalyticsApi.post('/chat', { mensaje, dashboardId, ultimoWidget });
			return data;
		} catch (error) {
			console.log(error);
			return { tipo: 'error', motivo: 'conexion', detalle: mensajeError(error) };
		}
	};

	return {
		dashboards,
		dashboard,
		widgets,
		semantica,
		cargando,
		error,
		setError,
		obtenerSemantica,
		obtenerDashboards,
		obtenerDashboard,
		crearWidget,
		actualizarWidget,
		eliminarWidget,
		guardarLayout,
		datosWidget,
		enviarChat,
	};
};
