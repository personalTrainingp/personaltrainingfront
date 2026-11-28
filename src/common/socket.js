import { io } from 'socket.io-client';
import { getEnvVariables } from './helpers';

const { API_URL } = getEnvVariables();

// socket.io corre en el mismo servidor del API, pero en la raiz (no en /api)
const SOCKET_URL = new URL(API_URL, window.location.origin).origin;

let socket = null;

// Un solo socket para toda la app; se conecta la primera vez que se pide
export const getSocket = () => {
	if (!socket) {
		socket = io(SOCKET_URL, {
			// funcion: en cada reconexion toma el token vigente
			auth: (cb) => cb({ token: localStorage.getItem('token') }),
		});
		socket.on('connect_error', (err) => console.log('socket.io error:', err.message));
	}
	return socket;
};
