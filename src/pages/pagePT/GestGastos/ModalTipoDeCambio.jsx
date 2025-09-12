import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Table } from 'react-bootstrap';
import { CustomTc } from './CustomTc';
import { useTcStore } from './hooks/useTcStore';
import { useSelector } from 'react-redux';
import { DateMask, DateMaskString, NumberFormatMoney } from '@/components/CurrencyMask';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const cmpFechaAsc = (a, b) =>
  new Date(a?.fecha ?? 0).getTime() - new Date(b?.fecha ?? 0).getTime();

export const ModalTipoDeCambio = ({ show, onHide, onShow }) => {
  const [isOpenModalCustomTC, setisOpenModalCustomTC] = useState(false);
  const { dataView = [] } = useSelector((s) => s.DATA);
  const { obtenerTcs } = useTcStore();

  const onOpenModalCustomTC = () => {
    setisOpenModalCustomTC(true);
    onHide();
  };
  const onCloseModalCustomTC = () => {
    setisOpenModalCustomTC(false);
    onShow();
  };

  useEffect(() => {
    if (show) obtenerTcs();
  }, [show]);

  // ✅ NO muta: usa toSorted() si existe; si no, clona y sortea
  const sorted = useMemo(() => {
    const arr = Array.isArray(dataView) ? dataView : [];
    if (typeof arr.toSorted === 'function') {
      return arr.toSorted(cmpFechaAsc); // ES2023, inmutable
    }
    return Array.from(arr).sort(cmpFechaAsc); // copia + sort (seguro)
  }, [dataView]);

  return (
    <>
      <Dialog onHide={onHide} visible={show} style={{ width: '70rem' }} header="TIPOS DE CAMBIO">
        <Button label="agregar tipo de cambio" className="m-2" onClick={onOpenModalCustomTC} />
        <br />
        <Table responsive hover striped>
          <thead className="bg-primary">
            <tr>
              <th className="text-white fs-4"><div className="d-flex justify-content-center">FECHA INICIO</div></th>
              <th className="text-white fs-4"><div className="d-flex justify-content-center">FECHA TERMINO</div></th>
              <th className="text-white fs-4"><div className="d-flex justify-content-center">COMPRA</div></th>
              <th className="text-white fs-4"><div className="d-flex justify-content-center">VENTA</div></th>
              <th className="text-white fs-4"><div className="d-flex justify-content-center">DESTINO</div></th>
              <th className="text-white fs-4"><div className="d-flex justify-content-center">ORIGEN</div></th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((e, idx) => {
              const termino = sorted[idx + 1]?.fecha ?? null; // siguiente fecha ya ordenada
              return (
                <tr key={e.id ?? `${e.fecha}-${idx}`}>
                  <td className="fs-2 text-black">
                    {e?.fecha ? DateMaskString(dayjs.utc(e.fecha), 'DD/MM/YYYY') : '-'}
                  </td>
                  <td className="fs-2 text-black">
                    {termino ? <DateMask date={dayjs.utc(termino)} format="DD/MM/YYYY" /> : 'INDEFINIDO'}
                  </td>
                  <td className="fs-2 text-black"><NumberFormatMoney amount={e?.precio_compra ?? 0} /></td>
                  <td className="fs-2 text-black"><NumberFormatMoney amount={e?.precio_venta ?? 0} /></td>
                  <td className="fs-2 text-black">{e?.monedaDestino ?? '-'}</td>
                  <td className="fs-2 text-black">{e?.monedaOrigen ?? '-'}</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Dialog>

      <CustomTc show={isOpenModalCustomTC} onHide={onCloseModalCustomTC} />
    </>
  );
};
