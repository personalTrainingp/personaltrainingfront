import moment from 'moment';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import es from 'dayjs/locale/es';

dayjs.extend(utc);
dayjs.extend(localizedFormat);
dayjs.locale(es);
export const helperFunctions = () => {
	const randomFunction = (lenghtRandom, code) => {
		let possible = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		let randomNumber = '';
		for (let i = 0; i < lenghtRandom; i++) {
			randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return `${code}_${randomNumber}`;
	};
	const generarCombinaciones = (tamano, caracteres, prefijo) => {
		let combinacion = '';

		// Agregar el prefijo si existe
		if (prefijo) {
			combinacion += prefijo + '_';
		}

		// Generar la parte del string con letras y números
		for (let i = 0; i < tamano; i++) {
			const indice = Math.floor(Math.random() * caracteres.length);
			combinacion += caracteres.charAt(indice);
		}

		return combinacion;
	};
	const objetoComparador = (objeto1, objeto2) => {
		// Obtener las claves (propiedades) de ambos objetos
		const clavesObjeto1 = Object.keys(objeto1);
		const clavesObjeto2 = Object.keys(objeto2);

		// Verificar si la cantidad de propiedades es la misma
		if (clavesObjeto1.length !== clavesObjeto2.length) {
			return false;
		}

		// Verificar si los valores de cada propiedad son iguales
		for (let i = 0; i < clavesObjeto1.length; i++) {
			const clave = clavesObjeto1[i];

			if (objeto1[clave] !== objeto2[clave]) {
				return false;
			}
		}

		// Si ha pasado todas las verificaciones, los objetos son iguales
		return true;
	};
	const sumarSemanas = (fecha, semanas) => {
		// Crear un objeto moment a partir de la fecha
		const fechaMoment = moment(fecha);
		// Sumar semanas a la fecha
		const nuevaFecha = fechaMoment.add(semanas, 'weeks');

		// Devolver la nueva fecha en formato 'YYYY-MM-DD'
		return nuevaFecha.format('YYYY-MM-DD');
	};
	const diasLaborables = (fechaInicio, fechaFin) => {
		let diasLaborables = 0;
		const fechaInicioParsed = dayjs(fechaInicio, 'YYYY-MM-DD');
		const fechaFinParsed = dayjs(fechaFin, 'YYYY-MM-DD');

		// Determina la dirección de la iteración
		const direccion = fechaFinParsed.isAfter(fechaInicioParsed) ? 1 : -1;

		// Calcula el número total de días
		const totalDias = Math.abs(fechaFinParsed.diff(fechaInicioParsed, 'day')) + 1;

		// Inicializa fechaActual
		let fechaActual = fechaInicioParsed;

		// Itera sobre el rango de días
		for (let i = 0; i < totalDias; i++) {
			// Si el día actual es laborable (de lunes a viernes)
			if (fechaActual.day() !== 0 && fechaActual.day() !== 6) {
				diasLaborables += direccion;
			}
			fechaActual = fechaActual.add(direccion, 'day');
		}

		return diasLaborables;
		// let diasLaborables = 0;
		// let fechaActual = dayjs(fechaInicio, 'YYYY-MM-DD');
		// const fechaFinParsed = dayjs(fechaFin, 'YYYY-MM-DD');

		// // Determina la dirección de la iteración
		// const direccion = fechaFinParsed.isAfter(fechaActual) ? 1 : -1;

		// // Ajusta fechaActual según la dirección
		// fechaActual = fechaActual.add(direccion, 'day');

		// while (
		// 	(direccion === 1 &&
		// 		(fechaActual.isBefore(fechaFinParsed) ||
		// 			fechaActual.isSame(fechaFinParsed, 'day'))) ||
		// 	(direccion === -1 &&
		// 		(fechaActual.isAfter(fechaFinParsed) || fechaActual.isSame(fechaFinParsed, 'day')))
		// ) {
		// 	// Si el día actual es laborable (de lunes a viernes)
		// 	if (fechaActual.day() !== 0 && fechaActual.day() !== 6) {
		// 		diasLaborables += direccion;
		// 	}
		// 	fechaActual = fechaActual.add(direccion, 'day');
		// }

		// return diasLaborables;
	};
	const estadoExtension = (fecha_inicio, fecha_fin, actual) => {};
	const daysUTC = (fecha) => {
		return dayjs.utc(fecha).locale('es').format('DD/MM/YYYY');
	};

	return {
		randomFunction,
		generarCombinaciones,
		objetoComparador,
		sumarSemanas,
		diasLaborables,
		estadoExtension,
		daysUTC,
	};
};
