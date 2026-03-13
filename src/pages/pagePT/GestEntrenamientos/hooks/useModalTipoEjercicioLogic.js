import { useState, useEffect } from 'react';
import { entrenamientosApi } from '@/api/entrenamientosApi';
import Swal from 'sweetalert2';

export function useModalTipoEjercicioLogic({ show, onHide, onSaved }) {
    const [nombre, setNombre] = useState('');
    const [usaPeso, setUsaPeso] = useState(false);
    const [usaTiempo, setUsaTiempo] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            setNombre('');
            setUsaPeso(true); // Default
            setUsaTiempo(false);
            setLoading(false);
        }
    }, [show]);

    const handleSave = async () => {
        if (!nombre.trim()) return Swal.fire('Error', 'El nombre es obligatorio', 'error');

        setLoading(true);
        try {
            const res = await entrenamientosApi.createTipoEjercicio({
                nombre,
                usa_peso: usaPeso,
                usa_tiempo: usaTiempo
            });

            if (res.ok) {
                Swal.fire('Éxito', 'Grupo Muscular creado', 'success');
                if (onSaved) onSaved(res.data);
                onHide();
            } else {
                Swal.fire('Error', res.msg || 'No se pudo crear', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Error interno al guardar', 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        nombre, setNombre,
        usaPeso, setUsaPeso,
        usaTiempo, setUsaTiempo,
        loading,
        handleSave
    };
}
