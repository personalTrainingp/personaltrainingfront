import { Button } from 'primereact/button'
import { Dialog } from 'primereact/dialog'
import React, { useEffect, useState } from 'react'
import { Table } from 'react-bootstrap'
import { CustomTc } from './CustomTc'
import { useTcStore } from './hooks/useTcStore'
import { useSelector } from 'react-redux'
import { DateMask, DateMaskString, FormatoDateMask, NumberFormatMoney } from '@/components/CurrencyMask'
import dayjs from 'dayjs'

export const ModalTipoDeCambio = ({show, onHide, onShow}) => {
    const [isOpenModalCustomTC, setisOpenModalCustomTC] = useState(false)
    const { dataView }  = useSelector(e=>e.DATA)
    const {obtenerTcs} = useTcStore()
    const onOpenModalCustomTC = ()=>{
        setisOpenModalCustomTC(true)
        onHide()
    }
    const onCloseModalCustomTC =()=>{
        setisOpenModalCustomTC(false)
        onShow()
    }
    useEffect(() => {
        if(show){
            obtenerTcs()
        }
    }, [show])
  return (
    <>
    <Dialog onHide={onHide} visible={show} style={{width: '70rem'}} header={'TIPOS DE CAMBIO'}>
        <Button label='agregar tipo de cambio' className='m-2' onClick={onOpenModalCustomTC}/>
        <br/>
        <Table responsive hover striped>
          <thead className='bg-primary'>
              <tr>
                  <th className='text-white fs-4'><div className='d-flex justify-content-center'>FECHA INICIO</div></th>
                  <th className='text-white fs-4'><div className='d-flex justify-content-center'>FECHA TERMINO</div></th>
                  <th className='text-white fs-4'><div className='d-flex justify-content-center'>COMPRA</div></th>
                  <th className='text-white fs-4'><div className='d-flex justify-content-center'>VENTA</div></th>
                  <th className='text-white fs-4'><div className='d-flex justify-content-center'>DESTINO</div></th>
                  <th className='text-white fs-4'><div className='d-flex justify-content-center'>ORIGEN</div></th>
              </tr>
          </thead>
          <tbody>
                    {
                        dataView.map((e, idx)=>{
                            // Encuentra todos los registros con fecha > e.fecha
      const posteriores = dataView
        .filter(item => new Date(item.fecha) > new Date(e.fecha))
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

      // Toma el primero de esos (si existe)
      const termino = posteriores.length
        ? posteriores[0].fecha
        : null;
      return (
        <tr key={e.id}>
          {/* Fecha inicio */}
          <td className="fs-2 text-black">
            {DateMaskString(dayjs.utc(e.fecha), 'DD/MM/YYYY')}
          </td>

          {/* Fecha término = la siguiente fecha cronológica */}
          <td className="fs-2 text-black">
            {termino
              ? <><DateMask date={dayjs.utc(termino)} format={'DD/MM/YYYY'}/></>
              : /* opcional: '-' o mismo día */ 'INDEFINIDO'}
          </td>

          {/* Compra / Venta */}
          <td className="fs-2 text-black">
            <NumberFormatMoney amount={e.precio_compra} />
          </td>
          <td className="fs-2 text-black">
            <NumberFormatMoney amount={e.precio_venta} />
          </td>

          {/* Monedas */}
          <td className="fs-2 text-black">{e.monedaDestino}</td>
          <td className="fs-2 text-black">{e.monedaOrigen}</td>
        </tr>
      );
                        })
                    }
          </tbody>
        </Table>
        
    </Dialog>
    <CustomTc show={isOpenModalCustomTC} onHide={onCloseModalCustomTC}/>
    </>
  )
}
