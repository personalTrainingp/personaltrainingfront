import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';

export const DateOnlyCellEditor = forwardRef((props, ref) => {
    const [value, setValue] = useState('');
    const inputRef = useRef(null);
    const syncValueRef = useRef(''); // Respaldo síncrono

    useEffect(() => {
        let initialValue = '';
        if (props.value) {
            try {
                if (typeof props.value === 'string') {
                    if (props.value.match(/^\d{4}-\d{2}-\d{2}/)) {
                        initialValue = props.value.substring(0, 10);
                    } else if (props.value.match(/^\d{2}[\/\-]\d{2}[\/\-]\d{4}/)) {
                        const parts = props.value.substring(0, 10).split(/[\/\-]/);
                        initialValue = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    }
                } else if (props.value instanceof Date && !isNaN(props.value.getTime())) {
                    initialValue = props.value.toISOString().split('T')[0];
                }
            } catch (e) {
                console.error("Error al parsear la fecha inicial:", e);
            }
        }

        setValue(initialValue);
        syncValueRef.current = initialValue;

        // Pequeño delay para asegurar que el DOM ya pintó el input
        const timer = setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
        }, 50);

        return () => clearTimeout(timer);
    }, [props.value]);

    useImperativeHandle(ref, () => ({
        getValue: () => {
            // 1. SOLUCIÓN CLAVE: Leemos el valor directo del HTML nativo. 
            // Si el input sigue vivo en el DOM, su valor es la verdad absoluta.
            let rawValue = inputRef.current ? inputRef.current.value : syncValueRef.current;

            // Si por alguna razón está vacío, usamos el ref de respaldo
            if (!rawValue) {
                rawValue = syncValueRef.current;
            }

            // 2. PROTECCIÓN: Si el valor final está vacío, devolvemos la fecha antigua
            // para evitar que la celda se quede en blanco por error.
            if (!rawValue) {
                return props.value || null;
            }

            // 3. FORMATEO: AG Grid necesita recibir DD-MM-YYYY
            if (rawValue.includes('-')) {
                const parts = rawValue.split('-');
                if (parts[0].length === 4) { // Validamos que el año esté primero
                    return `${parts[2]}-${parts[1]}-${parts[0]}`;
                }
            }

            return rawValue;
        },
        isPopup: () => false
    }));

    const handleChange = (e) => {
        const val = e.target.value;
        setValue(val);
        syncValueRef.current = val; // Mantenemos el respaldo actualizado al instante
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            // Cerramos la celda manualmente de forma segura
            if (props.stopEditing) props.stopEditing();
        }
    };

    return (
        <input
            type="date"
            ref={inputRef}
            min="2020-01-01"
            max="2030-12-31" // Límite seguro
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="form-control form-control-sm"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 0, outline: 'none' }}
        />
    );
});