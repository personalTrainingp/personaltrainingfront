import { DataTableCR } from '@/components/DataView/DataTableCR'
import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { DateMask, NumberFormatMoney } from '@/components/CurrencyMask'
import { useHistCamInventario } from './hook/useHistCamInventario'

// PrimeReact
import { SelectButton } from 'primereact/selectbutton'

// dayjs
import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import 'dayjs/locale/es'
import { TabPanel, TabView } from 'primereact/tabview'

dayjs.extend(isoWeek)
dayjs.extend(localizedFormat)
dayjs.locale('es')

const AGRUPACION_OPTS = [
  { label: 'Día', value: 'day' },
  { label: 'Semana', value: 'week' },
  { label: 'Mes', value: 'month' },
  { label: 'Año', value: 'year' },
]

const getGroupInfo = (date, mode) => {
  const d = dayjs(date)
  if (!d.isValid()) return { grupoKey: 'SIN_FECHA', grupoLabel: 'Sin fecha' }

  switch (mode) {
    case 'day': {
      return {
        grupoKey: d.format('YYYY-MM-DD'),
        grupoLabel: d.format('dddd DD [de] MMMM YYYY'),
      }
    }
    case 'week': {
      // Semana ISO (lunes-domingo)
      const start = d.startOf('isoWeek')
      const end = d.endOf('isoWeek')
      return {
        grupoKey: `${d.isoWeekYear()}-W${String(d.isoWeek()).padStart(2, '0')}`,
        grupoLabel: `Semana ${d.isoWeek()} (${start.format('DD MMM')} - ${end.format('DD MMM YYYY')})`,
      }
    }
    case 'month': {
      return {
        grupoKey: d.format('YYYY-MM'),
        grupoLabel: d.format('MMMM YYYY'),
      }
    }
    case 'year': {
      return {
        grupoKey: d.format('YYYY'),
        grupoLabel: d.format('YYYY'),
      }
    }
    default: {
      return {
        grupoKey: d.format('YYYY-MM-DD'),
        grupoLabel: d.format('dddd DD [de] MMMM YYYY'),
      }
    }
  }
}

const toNumber = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : 0
}

export const DataTableCuentasBalances = ({ idEmpresa, onOpenModalCustom }) => {
  const { obtenerArticulosHistorialxIdEmpresa } = useHistCamInventario()
  const { dataView } = useSelector((e) => e.HISTORIALCAMBIOS)

  const [agrupacion, setAgrupacion] = useState('day')

  useEffect(() => {
    obtenerArticulosHistorialxIdEmpresa(idEmpresa)
  }, [idEmpresa])

  // 1) Data “marcada” con grupoKey/grupoLabel + ordenada
  const dataAgrupada = useMemo(() => {
    const arr = Array.isArray(dataView) ? dataView : []

    const mapped = arr.map((row) => {
      const { grupoKey, grupoLabel } = getGroupInfo(row?.updatedAt, agrupacion)
      return { ...row, grupoKey, grupoLabel }
    })

    // Orden: primero por grupo y dentro por updatedAt desc
    mapped.sort((a, b) => {
      if (a.grupoKey < b.grupoKey) return 1
      if (a.grupoKey > b.grupoKey) return -1
      return dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf()
    })

    return mapped
  }, [dataView, agrupacion])

  // 2) (Opcional) resumen por grupo (totales, conteo)
  const resumenPorGrupo = useMemo(() => {
    const map = new Map()

    for (const row of dataAgrupada) {
      const key = row.grupoKey
      if (!map.has(key)) {
        map.set(key, {
          grupoKey: key,
          grupoLabel: row.grupoLabel,
          cantidad: 0,
          total_soles: 0,
          total_dolares: 0,
          mano_obra_soles: 0,
          mano_obra_dolares: 0,
        })
      }
      const acc = map.get(key)
      acc.cantidad += 1
      acc.total_soles += toNumber(row?.costo_total_soles)
      acc.total_dolares += toNumber(row?.costo_total_dolares)
      acc.mano_obra_soles += toNumber(row?.mano_obra_soles)
      acc.mano_obra_dolares += toNumber(row?.mano_obra_dolares)
    }

    // mismo orden que la tabla
    return Array.from(map.values()).sort((a, b) => (a.grupoKey < b.grupoKey ? 1 : -1))
  }, [dataAgrupada])

  const columns = [
    {
      id: 'id',
      header: 'ID',
      accessor: 'id_hc',
      sortable: true,
      width: 20,
      headerAlign: 'right',
      cellAlign: 'left',
      render: (row) => (
        <div style={{ width: '40px' }}>
          {row.id_hc}
        </div>
      ),
    },

    // 👇 NUEVO: columna “Grupo” (según selector)
    {
      id: 'grupo',
      header: 'Grupo',
      render: (row) => <span className="font-medium">{row?.grupoLabel}</span>,
    },

    { id: 'item', header: 'Item', render: (row) => row?.producto ?? '' },
    { id: 'descrip', header: 'Descripcion', render: (row) => row?.descripcion ?? '' },

    {
      id: 'costo_total_dolares',
      header: 'Costo total $',
      render: (row) => <NumberFormatMoney amount={toNumber(row?.costo_total_dolares)} currency="$" />,
    },
    {
      id: 'costo_total_soles',
      header: 'Costo total S/',
      render: (row) => <NumberFormatMoney amount={toNumber(row?.costo_total_soles)} currency="S/" />,
    },
    {
      id: 'mano_obra_soles',
      header: 'Mano obra S/',
      render: (row) => <NumberFormatMoney amount={toNumber(row?.mano_obra_soles)} currency="S/" />,
    },
    {
      id: 'mano_obra_dolares',
      header: 'Mano obra $',
      render: (row) => <NumberFormatMoney amount={toNumber(row?.mano_obra_dolares)} currency="$" />,
    },
    {
      id: 'updated',
      header: 'Hora actualizada',
      render: (row) => (
        <DateMask date={row.updatedAt} format={'dddd DD [DE] MMMM [DEL] YYYY [A LAS] hh:mm A'} />
      ),
    },
    { id: 'accion', header: 'Acción', render: (row) => row?.id_accion ?? '' },
  ]

  return (
    <div>
      {/* Selector */}
      <div className="flex gap-3 align-items-center mb-3">
        <span className="font-semibold">Agrupar por:</span>
        <SelectButton
          value={agrupacion}
          options={AGRUPACION_OPTS}
          onChange={(e) => setAgrupacion(e.value)}
        />
      </div>
        <TabView>
            {
                resumenPorGrupo.map(re=>{
                    return (
                        <TabPanel header={re?.grupoKey}>
                            <DataTableCR columns={columns} data={dataAgrupada.filter(data=>data.grupoLabel ===re.grupoLabel)} />
                        </TabPanel>
                    )
                })
            }
        </TabView>
    </div>
  )
}
