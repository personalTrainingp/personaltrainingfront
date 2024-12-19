import React, { useState, useEffect } from "react";
import { TreeSelect } from 'primereact/treeselect';
import { NodeService } from './DataTest';
import Select from 'react-select'
import { useComboVentasxMesAnioStore } from "./useComboVentasxMesAnioStore";
import dayjs from "dayjs";
import { useForm } from "@/hooks/useForm";
import { Button } from "primereact/button";
import { useDispatch } from "react-redux";
import { onSetMultiDate } from "@/store/data/dataSlice";
const selectMeses = {
    rangeMes: []
}
function obtenerMesesRango(rangoFechas) {
    const meses = [
        "enero", "febrero", "marzo", "abril", "mayo", "junio",
        "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"
    ];

    const resultado = [];

    rangoFechas.forEach(({ fec_incio, fec_fin }) => {
        let inicio = new Date(fec_incio);
        const fin = new Date(fec_fin);

        // Iterar sobre cada mes dentro del rango
        while (inicio <= fin) {
            const anio = inicio.getUTCFullYear();
            const nMes = inicio.getUTCMonth() + 1; // Mes en formato 1-12
            const mes = meses[inicio.getUTCMonth()]; // Nombre del mes

            // Agregar el mes al resultado
            resultado.push({ anio, mes, nMes: nMes.toString().padStart(2, "0"), label: `${anio} - ${mes}`, value: `${anio}-${nMes.toString().padStart(2, "0")}` });
            // Mover al siguiente mes
            inicio = new Date(anio, nMes, 1);
        }
    });

    return resultado;
}
export default function DataTreeMultiSelect({defaultOptions, onInputChangeReactSelect, selectsMulti}) {
    // const [multiMes, setmultiMes] = useState(null)
    
    console.log(selectsMulti);
    
    // const { comboMesesActivo, obtenerVentasDeProgramasxFechaVenta } = useComboVentasxMesAnioStore()
    // useEffect(() => {
        //     obtenerVentasDeProgramasxFechaVenta()
    // }, []); // eslint-disable-line react-hooks/exhaustive-deps
    // console.log(comboMesesActivo);
    return (
        <div className="d-flex" style={{ width: '100%', gap: '10px' }}>
        <Select
            isMulti
            options={selectsMulti}
            onChange={(e) => onInputChangeReactSelect(e, 'rangeMes')}
            name="rangeMes"
            defaultValue={defaultOptions}
            styles={{
                width: '100%',
            control: (base) => ({
                ...base,
                flex: '1', // Ocupa el resto del espacio disponible
            }),
            }}
        />
        </div>
    );
}
       