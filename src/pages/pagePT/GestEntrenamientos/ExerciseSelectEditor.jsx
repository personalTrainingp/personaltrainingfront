import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';

export const ExerciseSelectEditor = forwardRef((props, ref) => {
    // Aseguramos que el valor inicial nunca sea undefined
    const [value, setValue] = useState(props.value || '');
    const latestValueRef = useRef(props.value || '');
    const [options, setOptions] = useState([]);
    const selectRef = useRef(null);

    // 1. ELIMINAMOS dependencias del useEffect. 
    // Las opciones solo deben calcularse UNA VEZ cuando la celda entra en modo edición.
    useEffect(() => {
        const fullCatalogo = props.colDef.cellEditorParams.catalogo || [];

        let currentTypeId = props.data.id_tipo_temp;
        const currentData = props.data;

        if (!currentTypeId) {
            currentTypeId = currentData.CatalogoEntrenamiento?.id_tipo_ejercicio || currentData.CatalogoEntrenamiento?.id_tipo;
        }

        if (!currentTypeId && currentData.id_entrenamiento) {
            const foundEx = fullCatalogo.find(c => String(c.id) === String(currentData.id_entrenamiento));
            if (foundEx) {
                currentTypeId = foundEx.id_tipo || foundEx.id_tipo_ejercicio;
            }
        }


        const filtered = fullCatalogo.filter(c => {
            const typeId = c.id_tipo || c.id_tipo_ejercicio;
            return String(typeId) === String(currentTypeId);
        }); setOptions(filtered);

        setTimeout(() => selectRef.current?.focus(), 50);
    }, []); // <-- Array vacío vital para que no se congele

    useImperativeHandle(ref, () => ({
        getValue: () => latestValueRef.current,
        isPopup: () => true
    }));

    const handleChange = (e) => {
        const val = e.target.value;
        setValue(val);
        latestValueRef.current = val;

        // 2. Usamos el método nativo directo de AG Grid para editores personalizados,
        // sin timeouts, para que el cierre sea inmediato y síncrono.
        if (typeof props.stopEditing === 'function') {
            props.stopEditing();
        }
    };

    return (
        <select
            ref={selectRef}
            value={value}
            onChange={handleChange}
            className="form-select form-select-sm"
            // Agregado outline: none y boxShadow: none para que no haya bordes azules extraños al hacer foco
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 0, outline: 'none', boxShadow: 'none' }}
        >
            <option value="">-- Seleccionar --</option>
            {options.map(opt => (
                <option key={opt.id} value={opt.nombre}>
                    {opt.nombre}
                </option>
            ))}
        </select>
    );
});