import { useState, useEffect } from 'react';
import { entrenamientosApi } from '@/api/entrenamientosApi';
import Swal from 'sweetalert2';

export function useModalCatalogoLogic({ show, onHide, onSaved }) {
    const [tipos, setTipos] = useState([]);
    const [selectedTipo, setSelectedTipo] = useState(null);
    const [nombre, setNombre] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [urlVideo, setUrlVideo] = useState('');
    const [esMaquina, setEsMaquina] = useState(false);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (show) {
            entrenamientosApi.getTiposEjercicio().then(res => {
                const lista = res?.data || [];
                const opts = lista.map(t => ({ value: t.id, label: t.nombre }));
                setTipos(opts);
            }).catch(err => {
                console.error("Error cargando tipos:", err);
                setTipos([]);
            });
        }
    }, [show]);

    const handleClose = () => {
        setNombre('');
        setDescripcion('');
        setUrlVideo('');
        setEsMaquina(false);
        setSelectedTipo(null);
        onHide();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedTipo) return Swal.fire('Atención', "Selecciona un tipo de entrenamiento", 'warning');
        if (!nombre.trim()) return Swal.fire('Atención', "El nombre es obligatorio", 'warning');

        setSaving(true);
        try {
            const res = await entrenamientosApi.createCatalogo({
                nombre: nombre.trim(),
                descripcion: descripcion.trim(),
                url_video: urlVideo.trim(),
                id_tipo: selectedTipo.value,
                es_maquina: esMaquina
            });
            if (res.ok) {
                onSaved(res.data);
                handleClose();
            }
        } catch (err) {
            console.error(err);
            Swal.fire('Error', "Error al crear entrenamiento", 'error');
        } finally {
            setSaving(false);
        }
    };

    const onTipoCreated = (nuevoTipo) => {
        // nuevoTipo: { id, nombre, ... }
        const newOpt = { value: nuevoTipo.id, label: nuevoTipo.nombre };
        setTipos(prev => [...prev, newOpt]);
        setSelectedTipo(newOpt); // Auto-seleccionar el creado
    };

    return {
        tipos,
        selectedTipo, setSelectedTipo,
        nombre, setNombre,
        descripcion, setDescripcion,
        urlVideo, setUrlVideo,
        esMaquina, setEsMaquina,
        saving,
        handleSubmit,
        handleClose,
        onTipoCreated
    };
}
