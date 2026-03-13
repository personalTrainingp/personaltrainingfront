import React, { forwardRef, useImperativeHandle, useState, useEffect, useRef } from 'react';

export const DateCellEditor = forwardRef((props, ref) => {
    const [value, setValue] = useState('');
    const inputRef = useRef(null);

    useEffect(() => {
        if (props.value) {
            try {
                const d = new Date(props.value);
                const local = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
                setValue(local.toISOString().slice(0, 16));
            } catch (e) {
                console.error("Error", e);
                setValue('');
            }
        } else {
            // const now = new Date();
            // const local = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
            // setValue(local.toISOString().slice(0, 16));
        }

        setTimeout(() => inputRef.current?.focus(), 50);
    }, [props.value]);

    useImperativeHandle(ref, () => ({
        getValue: () => {
            if (!value) return null;
            const d = new Date(value);
            return d.toISOString();
        },
        isPopup: () => false
    }));

    return (
        <input
            type="datetime-local"
            ref={inputRef}
            max={new Date().toISOString().slice(0, 16)}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="form-control form-control-sm"
            style={{ width: '100%', height: '100%', border: 'none', borderRadius: 0 }}
        />
    );
});
