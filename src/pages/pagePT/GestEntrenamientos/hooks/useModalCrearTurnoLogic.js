import { useState, useEffect } from 'react';
import { entrenamientosApi } from '@/api/entrenamientosApi';

export function useModalCrearTurnoLogic({ show, onHide, onSaved, turnoToEdit }) {
    const [nombre, setNombre] = useState('');
    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (show) {
            setError(null);
            if (turnoToEdit) {
                setNombre(turnoToEdit.nombre || '');
                // Parse HH:mm from 1970-01-01THH:mm:ss OR HH:mm:ss
                let start = '';
                if (turnoToEdit.hora_inicio) {
                    start = turnoToEdit.hora_inicio.includes('T')
                        ? turnoToEdit.hora_inicio.split('T')[1].substring(0, 5)
                        : turnoToEdit.hora_inicio.substring(0, 5);
                }
                let end = '';
                if (turnoToEdit.hora_fin) {
                    end = turnoToEdit.hora_fin.includes('T')
                        ? turnoToEdit.hora_fin.split('T')[1].substring(0, 5)
                        : turnoToEdit.hora_fin.substring(0, 5);
                }
                setHoraInicio(start);
                setHoraFin(end);
            } else {
                setNombre('');
                setHoraInicio('');
                setHoraFin('');
            }
        }
    }, [show, turnoToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            // Validar
            if (!nombre) throw new Error("El nombre es obligatorio");

            const payload = {
                nombre,
                hora_inicio: horaInicio ? `${horaInicio}:00` : null,
                hora_fin: horaFin ? `${horaFin}:00` : null
            };

            let res;
            if (turnoToEdit) {
                // EDIT
                // Ensure we use the correct ID property (id, val, value)
                const id = turnoToEdit.id || turnoToEdit.value || turnoToEdit.val;
                res = await entrenamientosApi.updateTurno(id, payload);
            } else {
                // CREATE
                res = await entrenamientosApi.saveTurno(payload);
            }

            if (res.ok) {
                onSaved(res.data, !!turnoToEdit); // Pass flag if it was an update
                onHide();
            } else {
                setError(res.msg || "Error al guardar turno");
            }
        } catch (err) {
            setError(err.message || "Error interno");
        } finally {
            setSaving(false);
        }
    };

    return {
        nombre, setNombre,
        horaInicio, setHoraInicio,
        horaFin, setHoraFin,
        saving,
        error,
        handleSubmit
    };
}
