import { useState, useEffect } from 'react';
import { entrenamientosApi } from '@/api/entrenamientosApi';
import Swal from 'sweetalert2';

export function useModalEditarCatalogoLogic({ show, onHide, onUpdated, catalogo }) {
    const [tipos, setTipos] = useState([]);
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [filterTipo, setFilterTipo] = useState(null); // Nuevo: para filtrar el catálogo
    const [selectedOption, setSelectedOption] = useState(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [urlVideo, setUrlVideo] = useState('');
    const [esMaquina, setEsMaquina] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!show) {
            setSelectedOption(null);
            setNombre('');
            setDescripcion('');
            setUrlVideo('');
            setEsMaquina(false);
            setSelectedTipo(null);
            setFilterTipo(null); // Reset filter
        } else {
            entrenamientosApi.getTiposEjercicio().then(res => {
                const lista = res?.data || [];
                const opts = lista.map(t => ({ value: t.id, label: t.nombre }));
                setTipos(opts);
            }).catch(console.error);
        }
    }, [show]);

    // Auto-update selectedTipo when tipos are loaded or selectedOption changes
    useEffect(() => {
        if (selectedOption && tipos.length > 0) {
            const idTipo = selectedOption.original.id_tipo_ejercicio || selectedOption.original.id_tipo;
            if (idTipo) {
                const found = tipos.find(t => t.value == idTipo);
                if (found) {
                    setSelectedTipo(found);
                }
            }
        }
    }, [tipos, selectedOption]);

    const handleSelectChange = (option) => {
        setSelectedOption(option);
        if (option) {
            setNombre(option.original.nombre);
            setDescripcion(option.original.descripcion || '');
            setUrlVideo(option.original.url_video || '');
            setEsMaquina(!!option.original.es_maquina); // Load boolean

            const idTipo = option.original.id_tipo_ejercicio || option.original.id_tipo;

            if (idTipo && tipos.length > 0) {
                const found = tipos.find(t => t.value == idTipo);
                setSelectedTipo(found || null);
            } else {
                setSelectedTipo(null);
            }
        } else {
            setNombre('');
            setDescripcion('');
            setUrlVideo('');
            setEsMaquina(false);
            setSelectedTipo(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedOption) return Swal.fire('Atención', "Selecciona un entrenamiento para editar", 'warning');
        if (!nombre.trim()) return Swal.fire('Atención', "El nombre es obligatorio", 'warning');

        setSaving(true);
        try {
            const payload = {
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                url_video: urlVideo.trim(),
                id_tipo: selectedTipo ? selectedTipo.value : null,
                es_maquina: esMaquina
            };

            const res = await entrenamientosApi.updateCatalogo(selectedOption.value, payload);

            if (res.ok) {
                onUpdated(res.data);
                onHide();
            } else {
                Swal.fire('Error', res.msg || "Error al actualizar", 'error');
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', "Error al editar entrenamiento", 'error');
        } finally {
            setSaving(false);
        }
    };

    const options = catalogo
        .filter(c => {
            if (!filterTipo) return true;
            const idTipo = c.id_tipo_ejercicio || c.id_tipo;
            return idTipo == filterTipo.value;
        })
        .map(c => ({
            value: c.id,
            label: c.nombre,
            original: c
        }));

    return {
        tipos,
        selectedTipo, setSelectedTipo,
        filterTipo, setFilterTipo, // Expose filterTipo
        selectedOption,
        nombre, setNombre,
        descripcion, setDescripcion,
        urlVideo, setUrlVideo,
        esMaquina, setEsMaquina,
        saving,
        handleSelectChange,
        handleSubmit,
        options
    };
}
