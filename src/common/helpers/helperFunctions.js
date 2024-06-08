import moment from 'moment';
import { useSelector } from 'react-redux';

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
	return {
		randomFunction,
		generarCombinaciones,
		objetoComparador,
		sumarSemanas,
	};
};
