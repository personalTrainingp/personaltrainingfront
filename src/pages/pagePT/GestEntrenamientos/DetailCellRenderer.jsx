import React from 'react';
import 'bootstrap-icons/font/bootstrap-icons.css';
export const DetailCellRenderer = (params) => {
    return (
        <div className="d-flex justify-content-center align-items-center h-100 w-100 gap-3">
            <i
                className="bi bi-eye-fill fs-4"
                style={{ cursor: 'pointer', color: '#0d6efd' }} // Blue color for "view details"
                onClick={() => params.context.onViewDetails(params.data)}
                title="Ver Detalles"
            ></i>
        </div>
    );
};
