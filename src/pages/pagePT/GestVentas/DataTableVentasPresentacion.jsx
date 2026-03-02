import { NumberFormatMoney } from '@/components/CurrencyMask';
import { DataTableCR } from '@/components/DataView/DataTableCR';
import React from 'react'

const nombres = [
'Carlos Andrés', 'María Fernanda', 'José Miguel', 'Lucía Alejandra',
'Pedro Antonio', 'Ana Sofía', 'Luis Alberto', 'Rosa María',
'Daniel Eduardo', 'Elena Patricia', 'Miguel Ángel', 'Camila Valeria'
];

const apellidos = [
'Ruiz Gómez', 'Torres Salazar', 'Ramos Delgado', 'Herrera Castillo',
'Díaz Mendoza', 'Vargas López', 'Ramírez Flores', 'Medina Rojas',
'Paredes Silva', 'Cruz Ortega', 'León Navarro', 'Vega Morales'
];

const servicios = [
'Dual',
'Trial',
'Bellalis kid',
'Trial plus',
'Brasilero'
];


const generarNombreCompleto = () => {
  const nombre = nombres[Math.floor(Math.random() * nombres.length)];
  const apellido = apellidos[Math.floor(Math.random() * apellidos.length)];
  return `${nombre} ${apellido}`;
};

// 🔥 Genera pagos que sumen exactamente el total
const generarPagos = (total) => {
  const metodos = ['efectivo', 'tarjeta', 'transferencia', 'yape'];

  // Elegimos cuántos métodos usará (1, 2 o 3)
  const cantidadMetodos = Math.floor(Math.random() * 3) + 1;

  // Mezclamos los métodos y tomamos los primeros N
  const seleccionados = metodos
    .sort(() => 0.5 - Math.random())
    .slice(0, cantidadMetodos);

  let restante = total;
  const pagos = {
    efectivo: 0,
    tarjeta: 0,
    transferencia: 0,
    yape: 0
  };

  seleccionados.forEach((metodo, index) => {
    if (index === seleccionados.length - 1) {
      pagos[metodo] = Number(restante.toFixed(2));
    } else {
      const monto = Number((Math.random() * restante).toFixed(2));
      pagos[metodo] = monto;
      restante -= monto;
    }
  });

  return pagos;
};

export const DataTableVentasPresentacion = () => {

const arrayData =  Array.from({ length: 25 }, (_, i) => {
  const ventaTotal = Number((500 + Math.random() * 2000).toFixed(2));
  const pagos = generarPagos(ventaTotal);

  return {
    id: i + 1,
    colaborador: generarNombreCompleto(),
    nombres_apellidos_cli: generarNombreCompleto(),
    dni: String(70000000 + Math.floor(Math.random() * 9999999)),
    telefono: '9' + String(Math.floor(10000000 + Math.random() * 89999999)),
    servicio: servicios[Math.floor(Math.random() * servicios.length)],
    extra: Math.random() > 0.7 ? 'Incluye evaluación física' : '',
    venta_total: ventaTotal,
    efectivo: pagos.efectivo,
    tarjeta: pagos.tarjeta,
    transferencia: pagos.transferencia,
    yape: pagos.yape,
    observaciones: Math.random() > 0.8 ? 'Cliente nuevo' : ''
  };
});
const columns = [
  {
    id: 0, header: 'ID', accessor: 'id',
  },
  {
    id: 1, header: 'COLABORADOR', render: (row)=>{
      return (
        <>
        {row.colaborador}
        </>
      )
    }
  },
  {
    id: 2, header: (<>NOMBRES Y APELLIDOS COMPLETOS <br/> DEL CLIENTE</>), render: (row)=>{
      return (
        <>
        {row.nombres_apellidos_cli}
        </>
      )
    }
  },
  {
    id: 3, header: 'DNI', render: (row)=>{
      return (
        <>
        {row.dni}
        </>
      )
    }
  },
  {
    id: 4, header: 'CELULAR', render: (row)=>{
      return (
        <>
        {row.telefono}
        </>
      )
    }
  },
  {
    id: 5, header: 'SERVICIO', render: (row)=>{
      return (
        <>
        {row.servicio}
        </>
      )
    }
  },
  {
    id: 6, header: 'EXTRA', render: (row)=>{
      return (
        <>
        {row?.extra}
        </>
      )
    }
  },
  {
    id: 7, header: 'VENTA TOTAL', render: (row)=>{
      return (
        <>
        <NumberFormatMoney amount={row.venta_total}/>
        </>
      )
    }
  },
  {
    id: 8, header: 'EFECTIVO', render: (row)=>{
      return (
        <>
        <NumberFormatMoney amount={row.efectivo}/>
        </>
      )
    }
  },
  {
    id: 9, header: 'TARJETA', render: (row)=>{
      return (
        <>
        <NumberFormatMoney amount={row.tarjeta}/>
        </>
      )
    }
  },
  {
    id: 11, header: 'TRANSFERENCIAS', render: (row)=>{
      return (
        <>
        <NumberFormatMoney amount={row.transferencia}/>
        </>
      )
    }
  },
  {
    id: 12, header: 'YAPE', render: (row)=>{
      return (
        <>
        <NumberFormatMoney amount={row.yape}/>
        </>
      )
    }
  },
  {
    id: 13, header: 'OBSERVACIONES', render: (row)=>{
      return (
        <>
        {row.observaciones}
        </>
      )
    }
  },
]
  return (
    <div  className='link-change'>
              <DataTableCR data={arrayData} columns={columns} responsive/>
    </div>
  )
}
