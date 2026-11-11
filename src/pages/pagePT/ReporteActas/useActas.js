import { useState } from 'react'
import { PTApi } from '@/common'
import Swal from 'sweetalert2'
import config from '@/config'

const CONTAINER = 'actas'
export const urlArchivo = (img) => `${config.API_IMG.ACTAS}${encodeURIComponent(img.name_image)}`
export const esImagen = (ext = '') => ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(String(ext).toLowerCase())

const mostrarError = (error, titulo) => {
	console.log(error)
	Swal.fire({
		icon: 'error',
		title: titulo,
		text: error?.response?.data?.msg ?? 'Intenta nuevamente',
	})
}

// cada archivo va a tb_image con uid_location = uid_documento del acta
const subirArchivos = async (uid_documento, files = []) => {
	for (const file of files) {
		const formData = new FormData()
		formData.append('file', file)
		await PTApi.post(`/storage/blob/create/${uid_documento}?container=${CONTAINER}`, formData)
	}
}

export const useActas = () => {
	const [dataActas, setDataActas] = useState([])
	const [isLoading, setIsLoading] = useState(false)

	const obtenerActas = async () => {
		setIsLoading(true)
		try {
			const { data } = await PTApi.get('/actas')
			setDataActas(data.actas ?? [])
		} catch (error) {
			mostrarError(error, 'No se pudieron cargar las actas')
		} finally {
			setIsLoading(false)
		}
	}

	// devuelve true si se guardo el acta
	const guardarActa = async (id, form, files = []) => {
		try {
			const { data } = id
				? await PTApi.put(`/actas/id/${id}`, form)
				: await PTApi.post('/actas', form)
			try {
				await subirArchivos(data.uid_documento, files)
			} catch (error) {
				mostrarError(error, 'El acta se guardó, pero no se pudo subir un archivo')
			}
			await obtenerActas()
			return true
		} catch (error) {
			mostrarError(error, 'No se pudo guardar el acta')
			return false
		}
	}

	const eliminarActa = async (id) => {
		try {
			await PTApi.put(`/actas/delete/${id}`)
			await obtenerActas()
		} catch (error) {
			mostrarError(error, 'No se pudo eliminar el acta')
		}
	}

	const eliminarArchivo = async (id_image) => {
		try {
			await PTApi.put(`/actas/archivo/delete/${id_image}`)
			await obtenerActas()
		} catch (error) {
			mostrarError(error, 'No se pudo eliminar el archivo')
		}
	}

	return { dataActas, isLoading, obtenerActas, guardarActa, eliminarActa, eliminarArchivo }
}
