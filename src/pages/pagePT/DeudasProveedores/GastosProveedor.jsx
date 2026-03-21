import React, { useEffect } from 'react'
import { useDeudasProveedoresStore } from './useDeudasProveedoresStore'
import { Table } from 'react-bootstrap'
import { generarMesYanio } from './generarMesYanio'
import dayjs from 'dayjs'
import { NumberFormatMoney } from '@/components/CurrencyMask'

export const GastosProveedor = ({id_empresa, arrayDate}) => {
  const { obtenerGastosxFecha, dataGastosxFecha } = useDeudasProveedoresStore()
  useEffect(() => {
    obtenerGastosxFecha(id_empresa, arrayDate)
  }, [])
  const proveedorGasto = agruparPorProveedor(dataGastosxFecha).map(m=>{
    return {
      ...m,
      items: agruparPorFecha(m.items)
    }
  })
  return (
    <div>
      <Table responsive className="tabla-egresos fs-3">
        <thead>
          <tr>
              <th className='bg-change'></th>
              {
                  generarMesYanio(new Date(arrayDate[0]), new Date(arrayDate[1])).map(g=>{
                      return (
                          <th className='fs-3 bg-change text-white'>{dayjs(`${g.fecha}-15`, 'YYYY-M-DD').format('MMMM')}</th>
                      )
                  })
              }
              <th className='fs-3 bg-change text-white'>TOTAL</th>
          </tr>
        </thead>
        <tbody>
          {
            proveedorGasto.map(r=>{
              return (
              <tr>
                                                  <th className={`fs-3 bg-change text-white sticky-td-${id_empresa}`} style={{width: '40px'}}>
                                                      {r.items[0]?.items[0]?.tb_Proveedor?.razon_social_prov}
                                                  </th>
                                                  {
                                                      generarMesYanio(new Date(arrayDate[0]), new Date(arrayDate[1])).map(g=>{
                                                          const items = r.items.filter(f=>`${f.anio}-${f.mes}`==`${g.anio}-${g.mes}`)
                                                          console.log({a: items[0]});
                                                          
                                                          return (
                                                              <td className='fs-3 text-center'><NumberFormatMoney amount={items[0]?.monto_total}/></td>
                                                          )
                                                      })
                                                  }
                                                  <td className='fs-3 text-center'>
                                                      <NumberFormatMoney amount={r.items?.reduce((a,b)=>b.monto_total+a, 0)}/>
                                                  </td>
                                              </tr>

              )
            })
          }
        </tbody>
      </Table>
    </div>
  )
}

const agruparPorProveedor = (data) => {
  const result = Object.values(
    data.reduce((acc, item) => {
      if (!acc[item.id_prov]) {
        acc[item.id_prov] = {
          id_prov: item.id_prov,
          items: []
        };
      }
      acc[item.id_prov].items.push(item);
      return acc;
    }, {})
  );

  return result
};


const agruparPorFecha = (data) => {
  const resultado = Object.values(
    data.reduce((acc, item) => {
      const fecha = new Date(item.fecha_primaria);

      // const dia = fecha.getDate();
      const mes = fecha.getMonth() + 1;
      const anio = fecha.getFullYear();

      const key = `${anio}-${mes}`;

      if (!acc[key]) {
        acc[key] = {
          // dia,
          mes,
          anio,
          monto_total: 0,
          items: []
        };
      }

      // 🔥 SUMAR MONTO
      acc[key].monto_total += Number(Number(item.monto || 0)*Number(item.tc || 0));

      acc[key].items.push(item);

      return acc;
    }, {})
  );
  return resultado;
};