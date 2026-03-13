import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { entrenamientosApi } from '@/api/entrenamientosApi';

export const useResultadosRetoLogic = ({ idCliente, initialData, onSaveSuccess, defaultWeeks = 0 }) => {
    const [loading, setLoading] = useState(false);
    const [exists, setExists] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Store raw files for upload
    const [files, setFiles] = useState({});

    // Si viene weeksDuration en initialData (backend), lo usamos.
    // Si no, si es nuevo, usamos defaultWeeks (si existe)
    // Finalmente 0.
    const [weeksDuration, setWeeksDuration] = useState(0);

    const [data, setData] = useState({
        foto_inicio_frontal: '',

        peso_final: '',
        grasa_final: '',
        musculo_final: '',
        foto_final: '',
        foto_fin_frontal: '',

        peso_final: '',
        grasa_final: '',
        musculo_final: '',
        foto_final: '',
        foto_fin_frontal: '',

        comentarios: '',
        fecha_registro_final: '',
        fecha_registro_inicial: ''
    });

    // Helper: Formatear fecha para input date (YYYY-MM-DD)
    const formatForInput = (dateStr) => {
        if (!dateStr) return '';
        const safeStr = String(dateStr);
        if (safeStr.includes('T')) return safeStr.split('T')[0];
        if (safeStr.includes(' ')) return safeStr.split(' ')[0];
        return safeStr.substring(0, 10);
    };

    useEffect(() => {
        if (initialData) {
            setData({
                ...initialData,
                fecha_registro_final: formatForInput(initialData.fecha_registro_final),
                fecha_registro_inicial: formatForInput(initialData.fecha_registro_inicial)
            });
            setWeeksDuration(initialData.semanas_plan || defaultWeeks || 0);

            // Check if it's a REAL existing record (has numeric positive ID)
            const isReal = !!initialData.id && !initialData._isNew;

            setExists(isReal);
            setIsEditing(!isReal);
        } else {
            setData({
                peso_inicial: '', grasa_inicial: '', musculo_inicial: '', foto_inicial: '', foto_inicio_frontal: '',
                peso_final: '', grasa_final: '', musculo_final: '', foto_final: '', foto_fin_frontal: '',
                comentarios: '', fecha_registro_final: '', fecha_registro_inicial: ''
            });
            // weeksDuration set to defaultWeeks initially
            setWeeksDuration(defaultWeeks || 0);
            setExists(false);
            setIsEditing(true);

            // Only fetch if defaultWeeks is 0 (double check)
            if (!defaultWeeks) {
                fetchActivePlanDuration(new Date());
            }
        }
        // Limpiar archivos al cambiar usuario o data
        setFiles({});
    }, [initialData, idCliente, defaultWeeks]);

    // Fetch Plan Duration when Start Date changes
    const fetchActivePlanDuration = async (dateObj) => {
        try {
            const dateStr = dateObj instanceof Date ? dateObj.toISOString() : dateObj;
            const res = await entrenamientosApi.getMembresiasActivas(idCliente, dateStr);
            console.log("DEBUG: Fetching plan for date:", dateStr, "Result:", res);
            if (res?.data && res.data.length > 0) {
                const activePlan = res.data[0];
                const duration = activePlan.semanas_st || 0;
                setWeeksDuration(duration);
            } else {
                // If no plan found for that date, arguably we keep previous or set 0. 
                // Keeping previous is safer for UX unless explicitly reset.
            }
        } catch (error) {
            console.error("Error fetching active plan duration:", error);
        }
    };

    // Auto-Calculate End Date & Fetch Duration if new
    useEffect(() => {
        if (isEditing && data.fecha_registro_inicial) {
            // 1. If we just changed start date, maybe we need to re-check the active plan for THAT date
            // (Simple debounce could be good but for now direct call)
            // Only fetch if we are in "new entry" mode OR we want strict recalculation
            if (!exists) {
                fetchActivePlanDuration(data.fecha_registro_inicial);
            }

            // 2. Calculate End Date if we have duration
            if (weeksDuration > 0) {
                const [y, m, d] = data.fecha_registro_inicial.split('-').map(Number);
                const date = new Date(y, m - 1, d);
                date.setDate(date.getDate() + (weeksDuration * 7));
                const newEndDate = date.toISOString().split('T')[0];

                if (newEndDate !== data.fecha_registro_final) {
                    setData(prev => ({ ...prev, fecha_registro_final: newEndDate }));
                }
            }
        }
    }, [data.fecha_registro_inicial, weeksDuration, isEditing, exists]);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handlePhoto = (e, field) => {
        const file = e.target.files[0];
        if (file) {
            // 1. Store the raw file for upload
            setFiles(prev => ({ ...prev, [field]: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setData(prev => ({ ...prev, [field]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const uploadImageToBlob = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        // Usamos el idCliente como uid_location
        const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
        const response = await fetch(`${baseUrl}/api/storage/blob/create/${idCliente}?container=resultados-reto`, {
            method: 'POST',
            body: formData
            // No content-type headers, let browser set boundary
        });

        if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
        }
        const result = await response.json();
        return result.url;
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            // 1. UPLOAD FILES FIRST
            const updatedData = { ...data };

            // Iterate over the files we have captured
            for (const [field, file] of Object.entries(files)) {
                try {
                    const publicUrl = await uploadImageToBlob(file);
                    updatedData[field] = publicUrl; // Replace base64/old url with new blob URL
                } catch (err) {
                    console.error(`Failed to upload ${field}`, err);
                    Swal.fire('Error', `Falló subida de imagen: ${field}`, 'error');
                    setLoading(false);
                    return; // Stop save
                }
            }

            const payload = {
                id_cliente: idCliente,
                id: initialData?.id, // Important for updates
                id_venta: initialData?.id_venta, // REQUIRED for linking to specific sale
                peso_inicial: updatedData.peso_inicial,
                grasa_inicial: updatedData.grasa_inicial,
                musculo_inicial: updatedData.musculo_inicial,
                foto_inicial: updatedData.foto_inicial,
                foto_inicio_frontal: updatedData.foto_inicio_frontal,
                peso_final: updatedData.peso_final,
                grasa_final: updatedData.grasa_final,
                musculo_final: updatedData.musculo_final,
                foto_final: updatedData.foto_final,
                foto_fin_frontal: updatedData.foto_fin_frontal,
                comentarios: updatedData.comentarios,
                fecha_registro_final: updatedData.fecha_registro_final ? updatedData.fecha_registro_final : null,
                fecha_registro_inicial: updatedData.fecha_registro_inicial ? updatedData.fecha_registro_inicial : null
            };

            // Decide create or update based on ID presence
            const res = await entrenamientosApi.saveResultadosReto(payload);

            if (res.ok) {
                Swal.fire('Guardado', 'Los resultados del reto se han actualizado', 'success');
                setIsEditing(false);
                setFiles({}); // Clear staged files
                if (onSaveSuccess) onSaveSuccess();
            } else {
                Swal.fire('Error', res.msg || 'No se pudo guardar', 'error');
            }
        } catch (error) {
            console.error(error);
            Swal.fire('Error', 'Ocurrió un error de conexión', 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        exists,
        isEditing,
        setIsEditing,
        handleChange,
        handlePhoto,
        handleSave,
        weeksDuration // Exposed for UI/Debug
    };
};
