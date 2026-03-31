import { PageBreadcrumb } from '@/components'
import { useVentasStore } from '@/hooks/hookApi/useVentasStore'
import React, { useState, useEffect } from 'react';
import { arrayFacturas, arrayOrigenDeCliente } from '@/types/type';
import { DateMask, DateMaskString, FormatoDateMask, MaskDate, MoneyFormatter } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import { DataTableCR } from '@/components/DataView/DataTableCR';

export const ViewMembresiaxCliente = () => {
    const { obtenerTablaVentas, dataVentas } = useVentasStore()
    useEffect(() => {
        obtenerTablaVentas(598)
    }, [])
    const [customers, setCustomers] = useState(null);

    useEffect(() => {
        const fetchData = () => {
          setCustomers(getCustomers(dataVentas));
        };
        fetchData()
        // initFilters();
    }, [dataVentas]);

    const getCustomers = (data) => {
        return [...(data || [])].map((d) => {
            // d.date = new Date(d.date);
            let newItem = {...d}
            let date = dayjs.utc(d.fecha_venta);
            newItem.fecha_venta_v =  new Date(date.format());
            newItem.turno=dayjs.utc(d.detalle_ventaMembresia[0]?.horario).format('hh:mm A')
            newItem.tipo_comprobante = arrayFacturas.find(e=>e.value===d.id_tipoFactura)?.label
            newItem.origen = arrayOrigenDeCliente.find(e=>e.value===d.id_origen)?.label
            newItem.ultimoPgm=d.detalle_ventaMembresia[0]?.tb_ProgramaTraining?.name_pgm
            return newItem;
        });
    };
    const columns = [
      {id: 1, header: 'ID', render: (row)=>{
        return (
          <>
          {row.id}
          </>
        )
      }},
      {id: 2, header: 'FECHA', render: (row)=>{
        return (
          <div className='' style={{width: '150px'}}>
          {FormatoDateMask(row.fecha_venta_v, 'dddd DD [DE] MMMM [del] YYYY [a las] h:mm A')}
          </div>
        )
      }},
      {id: 3, header: 'HORARIO', render: (row)=>{
        return (
          <>
          {dayjs.utc(row.detalle_ventaMembresia[0]?.horario).format('hh:mm A')}
          </>
        )
      }},
      {id: 3, header: 'PROGRAMAS', render: (row)=>{
        return (
          <>
          {row.ultimoPgm}
          </>
        )
      }},
      {id: 3, header: 'ORIGEN', render: (row)=>{
        return (
          <>
          {row.origen}
          </>
        )
      }},
      {id: 3, header: 'ORIGEN', render: (row)=>{
                const combinedArray = [
          ...row.detalle_ventaCitas,
          ...row.detalle_ventaMembresia,
          ...row.detalle_ventaProductos
        ];

        // Calcular la suma total de tarifa_monto
        const sumaTotal = combinedArray.reduce((total, item) => total + item.tarifa_monto, 0);

        return (
          <>
          {<MoneyFormatter  amount={sumaTotal}/>}
          </>
        )
      }},
    ]
      const columnsExports = [
        {
          id: 'id',
          exportHeader: 'ID',
          exportValue: (row) => row.id,
        },
        {
          id: 'fecha_v',
          exportHeader: 'fecha de venta',
          exportValue: (row) => MaskDate(row.fecha_venta_v, 'dddd DD [DE] MMMM [del] YYYY [a las] h:mm A')
        },
        {
          id: 'horario',
          exportHeader: 'TURNO',
          exportValue: (row) => row.turno,
        },
        {
          id: 'programas',
          exportHeader: 'PROGRAMAS',
          exportValue: (row) => row.ultimoPgm,
        },
        {
          id: 'origen',
          exportHeader: 'origen',
          exportValue: (row) => row.origen,
        },
      ];
    return (
        <>
          <PageBreadcrumb title={'PROGRAMAS COMPRADOS'}/>
          <DataTableCR
            data={customers|| []}
            columns={columns}
            exportExtraColumns={columnsExports}
          />
        </>
    );
}
