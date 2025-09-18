import React, { useMemo } from 'react'
import Chart from 'react-apexcharts'
import dayjs from 'dayjs'
import 'dayjs/locale/es'  // importante para español

export const GraficoLinealInversionRedes = ({ data = [], fechas = [new Date()] }) => {
  dayjs.locale('es') // cambia idioma global a español

  const monthKey = (f) => dayjs(f).format('YYYY-MMMM')

  const { categories, series } = useMemo(() => {
    if (!fechas.length) return { categories: [], series: [] }

    const firstDate = dayjs(fechas[0])
    const daysInMonth = firstDate.daysInMonth()

    // 👉 eje X con formato “lunes 1 agosto 2025”
    const cats = Array.from({ length: daysInMonth }, (_, i) =>
      firstDate.date(i + 1).format('dddd D')
    )

    const mapByMonth = new Map(
      data.map((m) => [m.fecha, Array.isArray(m.items) ? m.items : []])
    )

    const srs = fechas.map((f) => {
      const key = monthKey(f)
      const items = mapByMonth.get(key) ?? []
      const buckets = Array(daysInMonth).fill(0)

      for (const it of items) {
        const d = dayjs(it.fecha)
        if (d.month() !== firstDate.month() || d.year() !== firstDate.year()) continue
        const day = d.date()
        const val = Number(
          it.monto ?? (typeof it.cantidad === 'string' ? it.cantidad.trim() : it.cantidad) ?? 0
        ) || 0
        buckets[day - 1] += val
      }

      return { name: key, data: buckets }
    })

    return { categories: cats, series: srs }
  }, [data, fechas])

  const options = {
    chart: { type: 'line', toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 3 },
      markers: { 
    size: 4,            // tamaño de los puntos
    colors: ['#000'],   // color de relleno negro
    strokeColors: '#000', // borde también negro
    strokeWidth: 2
  },
    xaxis: {
      categories,
      labels: {
        rotate: -45, // gira etiquetas si son largas
        style: { fontSize: '11px' },
      },
    },

    yaxis: { title: { text: 'Valor' }, decimalsInFloat: 2 },
    tooltip: { x: { show: true } },
    legend: { position: 'top' },
    grid: { strokeDashArray: 4 },
  }

  return <Chart options={options} series={series} type="line" width={'100%'} height={360} />
}
