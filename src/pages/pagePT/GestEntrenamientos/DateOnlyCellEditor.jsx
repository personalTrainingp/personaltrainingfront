import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';

export const DateOnlyCellEditor = forwardRef((props, ref) => {
    const [value, setValue] = useState('');
    const inputRef = useRef(null);
    const latestValueRef = useRef(''); // Synchronous tracking

    useEffect(() => {
        console.log("DateOnlyCellEditor [%s] MOUNTED. Initial value:", props.node.id, props.value);

        // INITIALIZATION ONLY ON MOUNT
        let initialValue = '';
        if (props.value) {
            try {
                if (typeof props.value === 'string' && props.value.match(/^\d{4}-\d{2}-\d{2}/)) {
                    initialValue = props.value.substring(0, 10);
                } else {
                    const d = new Date(props.value);
                    if (!isNaN(d.getTime())) {
                        initialValue = d.toISOString().split('T')[0];
                    }
                }
            } catch (e) {
                console.error("Error parsing date", e);
            }
        }
        setValue(initialValue);
        latestValueRef.current = initialValue;

        // Auto-focus after a short delay
        const timer = setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
        }, 100);

        return () => {
            console.log("DateOnlyCellEditor [%s] UNMOUNTED. Last value:", props.node.id, latestValueRef.current);
            clearTimeout(timer);
        };
    }, []); // RUN ONLY ONCE ON MOUNT

    useImperativeHandle(ref, () => ({
        getValue: () => {
            // Guarantee we return the absolute latest selected value immediately
            const finalValue = latestValueRef.current;
            console.log("DateOnlyCellEditor [%s] getValue() called, returning:", props.node.id, finalValue);
            return finalValue || null;
        },
        isPopup: () => false
    }));

    const handleChange = (e) => {
        const val = e.target.value;
        console.log("DateOnlyCellEditor [%s] handleChange:", props.node.id, val);
        setValue(val);
        latestValueRef.current = val; // Synchronous tracking

        // Stop editing immediately when a date is picked (from calendar popup)
        // This makes the UI feel responsive and triggers valueSetter immediately.
        if (props.stopEditing) {
            props.stopEditing();
        }
    };

    return (
        <input
            type="date"
            ref={inputRef}
            min="2020-01-01"
            max={new Date().toISOString().split('T')[0]}
            value={value}
            onChange={handleChange}
            className="form-control form-control-sm"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 0, outline: 'none' }}
        />
    );
});
