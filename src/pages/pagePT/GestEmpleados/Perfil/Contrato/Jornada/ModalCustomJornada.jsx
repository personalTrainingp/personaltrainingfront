import React, { useMemo, useState, useCallback, useEffect } from 'react'; 
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import { arrayTipoJornada } from '@/types/type';
import { useContratoColaboradorStore } from '../useContratoColaboradorStore';
import { useDiasLaborablesColaboradorStore } from './useDiasLaborablesColaboradorStore';

dayjs.locale('es');

// ---------- Utils fecha ----------
const fmtTime = (d) => dayjs(d).format('hh:mm A');
const minutesBetween = (a, b) => dayjs(b).diff(dayjs(a), 'minute');
const addMin = (t, m) => dayjs(t).add(m, 'minute').toDate();

// ---------- Mini calendario por mes ----------
const MonthCard = ({
  monthStart,
  onCellEnter,
  onCellClick,
  hoverSet,
  strongMap,
}) => {
  const firstDayOfWeek = 1; // lunes
  const month = monthStart.month();
  const year = monthStart.year();

  const monthFirstWeekDay = (monthStart.day() - firstDayOfWeek + 7) % 7;
  const gridStart = monthStart.subtract(monthFirstWeekDay, 'day');
  const days = Array.from({ length: 42 }, (_, i) => gridStart.add(i, 'day'));

  const weekDayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

  return (
    <div style={{ border: '1px solid #e0e0e0', borderRadius: 8, padding: 12, background: '#fff' }}>
      <div style={{ fontWeight: 700, textTransform: 'capitalize', marginBottom: 6 }}>
        {monthStart.format('MMMM YYYY')}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, fontSize: 12, opacity: 0.8, marginBottom: 4 }}>
        {weekDayNames.map((d) => <div key={d} style={{ textAlign: 'center' }}>{d}</div>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, fontSize: 12 }}>
        {days.map((d) => {
          const isCurrentMonth = d.month() === month && d.year() === year;
          const key = d.format('YYYY-MM-DD');
          const isHover = hoverSet?.has(key);
          const strong = strongMap?.get(key);
          return (
            <div
              key={key}
              onMouseEnter={() => onCellEnter?.(d.toDate())}
              onClick={() => onCellClick?.(d.toDate())}
              style={{
                position: 'relative',
                textAlign: 'center',
                padding: '8px 0',
                borderRadius: 6,
                cursor: 'pointer',
                border: isCurrentMonth ? '1px solid #eee' : '1px solid #f3f3f3',
                color: isCurrentMonth ? '#111' : '#bbb',
                // 👇 mantener el amarillo claro del hover
                // y permitir que el amarillo fuerte sea el color elegido
                background: strong
                  ? (strong.color || '#FFE766')
                  : (isHover ? '#FFF6B3' : (isCurrentMonth ? '#f7f7f7' : '#fafafa')),
                transition: 'background 120ms ease',
                minHeight: 32,
                userSelect: 'none'
              }}
              title={d.format('DD/MM/YYYY')}
            >
              {d.date()}
              {strong?.number != null && (
                <span style={{
                  position: 'absolute', top: 1, right: 6, fontSize: 10, fontWeight: 700
                }}>
                  {strong.number}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ---------- Construir lista de meses ----------
const startOfMonth = (d) => dayjs(d).startOf('month');
const getMonthsInRange = (from, to) => {
  const start = startOfMonth(from);
  const months = [];
  if (to === 'indefinido' || !to) return [start];
  const end = startOfMonth(to);
  let c = start.clone();
  while (c.isBefore(end) || c.isSame(end, 'month')) {
    months.push(c.clone());
    c = c.add(1, 'month');
  }
  return months;
};

const ModalEspecial = ({ visible, onHide, onAdd }) => {
  const [inicio, setInicio] = useState('12:00');
  const [fin, setFin] = useState('13:00');
  const [tipo, setTipo] = useState(1500);
  const [obs, setObs] = useState('');

  const parseHM = (s) => {
    const [hh, mm] = s.split(':').map(Number);
    const base = dayjs().hour(hh || 0).minute(mm || 0).second(0).millisecond(0);
    return base.toDate();
  };

  const handleAdd = () => {
    const a = parseHM(inicio);
    const b = parseHM(fin);
    const mins = Math.max(0, minutesBetween(a, b));
    onAdd?.({ inicio, fin, tipo, observacion: obs, minutos: mins });
    onHide?.();
  };

  return (
    <Dialog header="Agregar horario especial" visible={visible} onHide={onHide} style={{ width: 500 }}>
      <div className="p-fluid" style={{ display: 'grid', gap: 12 }}>
        <div>
          <label>Inicio (HH:mm)</label>
          <input value={inicio} onChange={(e) => setInicio(e.target.value)} placeholder="12:00" className="p-inputtext p-component" />
        </div>
        <div>
          <label>Fin (HH:mm)</label>
          <input value={fin} onChange={(e) => setFin(e.target.value)} placeholder="13:00" className="p-inputtext p-component" />
        </div>
        <div>
          <label>Tipo</label>
          <Dropdown options={arrayTipoJornada} value={tipo} onChange={(e) => setTipo(e.value)} />
        </div>
        <div>
          <label>Observación</label>
          <textarea value={obs} onChange={(e) => setObs(e.target.value)} rows={3} className="p-inputtextarea p-component" />
        </div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <Button label="Cancelar" className="p-button-text" onClick={onHide} />
          <Button label="Agregar" onClick={handleAdd} />
        </div>
      </div>
    </Dialog>
  );
};

// ---------- Modal Jornada (principal) ----------
const opcionesModo = [
  { label: 'Columna día', value: 'columna' },
  { label: 'Por día', value: 'dia' },
  { label: 'Día intercalado', value: 'intercalado' },
];

const ModalJornada = ({
  visible,
  onHide,
  onAceptar,
}) => {
  // principales
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFin, setHoraFin] = useState('17:00');
  const [modo, setModo] = useState('columna');
  const [color, setColor] = useState('#FFE766'); // amarillo fuerte por defecto
  const [colorText, setColorText] = useState('#FFE766');

  // especiales
  const [especiales, setEspeciales] = useState([]);
  const [showEspecial, setShowEspecial] = useState(false);

  const parseHM = (s) => {
    const [hh, mm] = s.split(':').map(Number);
    return dayjs().hour(hh || 0).minute(mm || 0).second(0).millisecond(0);
  };

  // minutos de la jornada principal = fin - inicio
  const minutosBase = useMemo(() => {
    const ini = parseHM(horaInicio);
    const fin = parseHM(horaFin);
    const diff = fin.diff(ini, 'minute');
    return diff > 0 ? diff : 0;
  }, [horaInicio, horaFin]);

  // suma de los especiales
  const totalEspeciales = useMemo(
    () => especiales.reduce((a, e) => a + (e.minutos || 0), 0),
    [especiales]
  );

  // total que se guarda / pinta
  const totalMinutos = minutosBase + totalEspeciales;

  const handleAddEspecial = (esp) => setEspeciales((arr) => [...arr, esp]);
  const handleRemoveEspecial = (idx) => setEspeciales((arr) => arr.filter((_, i) => i !== idx));

  const aceptar = () => {
    onAceptar?.({
      modo,
      horario_inicio: horaInicio,
      horario_fin_jor: horaFin,
      // 👇 minutos del principal vienen de la diferencia de horas
      minutos: minutosBase,
      especiales,
      // 👇 total = principal + especiales
      total_minutos: totalMinutos,
      color: colorText || color || '#FFE766',
    });
    onHide?.();
  };

  // hora fin formateada solo para mostrar
  const finManualDate = parseHM(horaFin);

  return (
    <>
      <Dialog header="Horas del día laborable" visible={visible} onHide={onHide} style={{ width: 600 }}>
        <div className="p-fluid" style={{ display: 'grid', gap: 12 }}>
          {/* horas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label>Hora inicio</label>
              <input
                type="time"
                value={horaInicio}
                onChange={(e) => setHoraInicio(e.target.value)}
                className="p-inputtext p-component"
              />
            </div>
            <div>
              <label>Hora fin</label>
              <input
                type="time"
                value={horaFin}
                onChange={(e) => setHoraFin(e.target.value)}
                className="p-inputtext p-component"
              />
            </div>
          </div>

          {/* duración calculada */}
          <div>
            <label>Duración (minutos)</label>
            <InputNumber
              value={minutosBase}
              disabled
              // si quieres que se vea editable pero no se toque:
              // readOnly
            />
            <small style={{ display: 'block', opacity: .7 }}>
              Se calcula a partir de la hora inicio y la hora fin.
            </small>
          </div>

          {/* modo de pintado */}
          <div>
            <label>Modo de pintado</label>
            <Dropdown options={opcionesModo} value={modo} onChange={(e) => setModo(e.value)} />
          </div>

          {/* color */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div>
              <label>Color (hex)</label>
              <input
                type="text"
                value={colorText}
                onChange={(e) => {
                  setColorText(e.target.value);
                  setColor(e.target.value);
                }}
                className="p-inputtext p-component"
                placeholder="#FFE766"
              />
            </div>
            <div>
              <label>&nbsp;</label>
              <input
                type="color"
                value={color}
                onChange={(e) => {
                  setColor(e.target.value);
                  setColorText(e.target.value);
                }}
                style={{ width: 50, height: 36, border: 'none', background: 'transparent' }}
              />
            </div>
          </div>

          {/* especiales */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <b>Horarios especiales</b>
              <Button label="+ Agregar" onClick={() => setShowEspecial(true)} />
            </div>
            {especiales.length === 0 && <div style={{ opacity: .7 }}>Sin especiales</div>}
            {especiales.map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '6px 8px', border: '1px solid #eee', borderRadius: 6, marginBottom: 6 }}>
                <span>{i + 1}.</span>
                <span>{e.inicio} - {e.fin}</span>
                <span>• {e.tipo}</span>
                <span style={{ opacity: .7, fontStyle: 'italic' }}>{e.observacion || ''}</span>
                <span style={{ marginLeft: 'auto' }}>{e.minutos} min</span>
                <Button icon="pi pi-trash" className="p-button-text p-button-sm" onClick={() => handleRemoveEspecial(i)} />
              </div>
            ))}
          </div>

          {/* totales */}
          <div style={{ fontSize: 12 }}>
            <b>Minutos jornada principal:</b> {minutosBase} min <br />
            <b>Minutos especiales:</b> {totalEspeciales} min <br />
            <b>Total a pintar:</b> {totalMinutos} min
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
            <Button label="Cancelar" className="p-button-text" onClick={onHide} />
            <Button label="Aceptar" onClick={aceptar} />
          </div>
        </div>
      </Dialog>

      <ModalEspecial
        visible={showEspecial}
        onHide={() => setShowEspecial(false)}
        onAdd={handleAddEspecial}
      />
    </>
  );
};

// ---------- Panel derecho: items pintados ----------
const PanelItems = ({ items, onToggleDetail, onDelete, id_contrato }) => {
  const { postTipoContratoxDia } = useContratoColaboradorStore()
  const onClickPostItems = (it)=>{
      postTipoContratoxDia(dataFlatMapItems(it, id_contrato))
  }
  return (
    <div style={{ borderLeft: '1px solid #eee', paddingLeft: 12 }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>Items creados</div>
      {items.length === 0 && <div style={{ opacity: .7 }}>Aún no hay items</div>}
      {items.map((it) => (
        <div key={it.id} style={{ border: '1px solid #eee', borderRadius: 8, padding: 10, marginBottom: 10, background: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <b>{it.number}.</b>
            <span>{it.horario_inicio} hasta {it.horario_fin_jor}</span>
            <span>• {it.especiales.length} horarios especiales</span>
            {it.color && (
              <span style={{ width: 16, height: 16, borderRadius: 3, background: it.color, border: '1px solid #ddd' }} />
            )}
            <Button
              className="p-button-text p-button-sm"
              label={it.showDetail ? 'Ocultar detalle' : 'Ver detalle'}
              onClick={() => onToggleDetail(it.id)}
            />
            <Button className="p-button-text p-button-danger p-button-sm" icon="pi pi-trash" onClick={() => onDelete(it.id)} style={{ marginLeft: 'auto' }} />
          </div>
          {it.showDetail && (
            <div style={{ marginTop: 6, fontSize: 13 }}>
              <div><b>Modo:</b> {it.modo}</div>
              <div><b>Total minutos:</b> {it.total_minutos}</div>
              {it.especiales.length > 0 && (
                <>
                  <div style={{ marginTop: 6 }}><b>Especiales:</b></div>
                  <ul style={{ margin: 0, paddingLeft: 18 }}>
                    {it.especiales.map((e, idx) => (
                      <li key={idx}>
                        {e.inicio} - {e.fin} • {e.tipo} • {e.minutos} min {e.observacion ? `• ${e.observacion}` : ''}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          )}
        </div>
      ))}
      <Button label='AGREGAR ' onClick={()=>onClickPostItems(items)}/>
    </div>
  );
};

// ========== 🔥 función nueva: convertir data (del backend) -> items (del panel) ==========
function buildItemsFromData(data = []) {
  if (!Array.isArray(data) || data.length === 0) return [];

  // agrupamos por hora_inicio
  const byHora = new Map();
  data.forEach((r) => {
    const key = r.hora_inicio;
    if (!byHora.has(key)) byHora.set(key, []);
    byHora.get(key).push(r);
  });

  const items = [];
  let counter = 1;

  for (const [hora_inicio, rows] of byHora.entries()) {
    const normales = rows.filter((r) => r.id_tipo_horario === 0);
    const especialesRaw = rows.filter((r) => r.id_tipo_horario !== 0);
    const fechas = Array.from(new Set(rows.map((r) => r.fecha)));
    const baseMinutos = normales.length > 0 ? (normales[0].minutos || 0) : 0;

    const finDate = dayjs().hour(Number(hora_inicio.split(':')[0]) || 0).minute(Number(hora_inicio.split(':')[1]) || 0).second(0);
    const finCalc = finDate.add(baseMinutos, 'minute').format('hh:mm A');

    const especiales = especialesRaw.map((e) => {
      const ini = e.hora_inicio;
      const base = dayjs().hour(Number(ini.split(':')[0]) || 0).minute(Number(ini.split(':')[1]) || 0);
      const fin = base.add(e.minutos || 0, 'minute').format('HH:mm');
      return {
        inicio: ini,
        fin,
        tipo: e.id_tipo_horario,
        observacion: e.observacion || '',
        minutos: e.minutos || 0,
      };
    });

    const total_minutos = baseMinutos + especiales.reduce((a, e) => a + (e.minutos || 0), 0);

    items.push({
      id: `loaded-${counter}`,
      number: counter,
      modo: 'dia',
      horario_inicio: hora_inicio,
      minutos: baseMinutos,
      especiales,
      horario_fin_jor: finCalc,
      total_minutos,
      fechas,
      showDetail: false,
      // color por defecto: mismo amarillo fuerte
      color: '#FFE766',
    });

    counter++;
  }

  return items;
}

// ---------- Componente principal ----------
export const ModalCustomJornada = ({
  show,
  onHide,
  arrayFecha = [new Date(), 'indefinido'],
  uid_empl,
  id_contrato,
  data = []
}) => {
  const [from, to] = arrayFecha || [];
  const months = useMemo(() => getMonthsInRange(from, to), [from, to]);
  const isFullYear = months.length === 12;
  const columns = months.length === 1 ? 1 : (isFullYear ? 4 : Math.min(4, months.length));
  const  { dataDiasLaborablesxIDcontrato, obtenerDiasLaborablesColaboradorxContrato } = useDiasLaborablesColaboradorStore()

  // modal jornada
  const [showJornada, setShowJornada] = useState(false);

  useEffect(() => {
    if(show && id_contrato!==0){
      obtenerDiasLaborablesColaboradorxContrato(id_contrato)
    }
  }, [id_contrato, show])

  // Modo pintado activo
  const [painter, setPainter] = useState(null);
  const [hoverSet, setHoverSet] = useState(new Set());
  const [strongMap, setStrongMap] = useState(new Map());

  // Lista de items
  const [items, setItems] = useState([]);
  const [counter, setCounter] = useState(1);

  useEffect(() => {
    if (Array.isArray(dataDiasLaborablesxIDcontrato) && dataDiasLaborablesxIDcontrato.length > 0) {
      const loadedItems = buildItemsFromData(dataDiasLaborablesxIDcontrato);
      setItems(loadedItems);
      setCounter(loadedItems.length + 1);

      const newStrong = new Map();
      loadedItems.forEach((it) => {
        it.fechas.forEach((f) => {
          newStrong.set(f, { number: it.number, itemId: it.id, color: it.color || '#FFE766' });
        });
      });
      setStrongMap(newStrong);
    } else {
      setItems([]);
      setCounter(1);
      setStrongMap(new Map());
    }
  }, [dataDiasLaborablesxIDcontrato]);

  // aceptar jornada -> activa pintado
  const handleAceptarJornada = (dataJornada) => {
    setPainter(dataJornada);
  };

  // Hover: calcular set según modo
  const computeHoverSet = useCallback((dateUnderCursor) => {
    if (!painter) return new Set();
    const d = dayjs(dateUnderCursor);
    const set = new Set();

    if (painter.modo === 'columna') {
      const targetDow = d.day(); // 0..6
      months.forEach((m) => {
        const monthFirstWeekDay = (m.day() - 1 + 7) % 7; // lunes=1
        const gridStart = m.subtract(monthFirstWeekDay, 'day');
        for (let i = 0; i < 42; i++) {
          const dd = gridStart.add(i, 'day');
          if (dd.day() === targetDow) set.add(dd.format('YYYY-MM-DD'));
        }
      });
    } else if (painter.modo === 'dia') {
      set.add(d.format('YYYY-MM-DD'));
    } else if (painter.modo === 'intercalado') {
      months.forEach((m) => {
        const startMonth = m.startOf('month');
        const endMonth = m.endOf('month');

        let c = d.clone();
        while (c.isBefore(endMonth) || c.isSame(endMonth, 'day')) {
          set.add(c.format('YYYY-MM-DD'));
          c = c.add(14, 'day');
        }

        c = d.clone().subtract(14, 'day');
        while (c.isAfter(startMonth) || c.isSame(startMonth, 'day')) {
          set.add(c.format('YYYY-MM-DD'));
          c = c.subtract(14, 'day');
        }
      });
    }
    return set;
  }, [painter, months]);

  const onCellEnter = (date) => {
    if (!painter) return;
    setHoverSet(computeHoverSet(date));
  };

  const onCellClick = (date) => {
    if (!painter) return;
    const toPaint = computeHoverSet(date);
    if (toPaint.size === 0) return;

    confirmDialog({
      message: 'Se pintarán las celdas resaltadas según el modo seleccionado. ¿Continuar?',
      header: 'Confirmar pintado',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, pintar',
      rejectLabel: 'Cancelar',
      accept: () => {
        const itemId = crypto.randomUUID?.() || Math.random().toString(36).slice(2);
        const number = counter;

        setStrongMap((prev) => {
          const next = new Map(prev);
          toPaint.forEach((k) => next.set(k, { number, itemId, color: painter.color || '#FFE766' }));
          return next;
        });

        const item = {
          id: itemId,
          number,
          ...painter,
          fechas: Array.from(toPaint),
          showDetail: false,
        };
        setItems((arr) => [...arr, item]);
        setCounter((n) => n + 1);

        setPainter(null);
        setHoverSet(new Set());
      },
    });
  };

  const toggleDetail = (id) => {
    setItems((arr) => arr.map((it) => it.id === id ? { ...it, showDetail: !it.showDetail } : it));
  };

  const deleteItem = (id) => {
    setStrongMap((prev) => {
      const next = new Map(prev);
      Array.from(next.entries()).forEach(([k, v]) => {
        if (v.itemId === id) next.delete(k);
      });
      return next;
    });
    setItems((arr) => arr.filter((it) => it.id !== id));
  };

  return (
    <Dialog onHide={onHide} visible={show} header={`AGREGAR JORNADA ${id_contrato}`} style={{ width: '95vw', maxWidth: 1400 }}>
      {/* 👇 solo 2 secciones: calendario + panel derecho */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 12, minHeight: 500 }}>
        {/* Sección principal (calendarios) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* barra arriba para abrir el modal de jornada */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Button label="Configurar jornada" onClick={() => setShowJornada(true)} />
            {painter ? (
              <div style={{ fontSize: 12 }}>
                Modo activo: <b>{painter.modo}</b> • Inicio: <b>{painter.horario_inicio}</b> • Fin: <b>{painter.horario_fin_jor}</b>
                {painter.color && (
                  <span style={{ display: 'inline-block', width: 16, height: 16, background: painter.color, border: '1px solid #ccc', marginLeft: 6 }} />
                )}
              </div>
            ) : (
              <div style={{ fontSize: 12, opacity: .8 }}>Define la jornada y luego haz clic en las fechas para pintar.</div>
            )}
          </div>
          <div style={{ display: 'grid', gap: 12, gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
            {months.map((m) => (
              <MonthCard
                key={m.format('YYYY-MM')}
                monthStart={m}
                onCellEnter={onCellEnter}
                onCellClick={onCellClick}
                hoverSet={hoverSet}
                strongMap={strongMap}
              />
            ))}
          </div>
        </div>

        {/* Panel derecho items */}
        <PanelItems items={items} id_contrato={id_contrato} onToggleDetail={toggleDetail} onDelete={deleteItem} />
      </div>

      {/* Modal jornada */}
      <ModalJornada
        visible={showJornada}
        onHide={() => setShowJornada(false)}
        onAceptar={handleAceptarJornada}
      />
    </Dialog>
  );
};

// ---------- flatten para enviar ----------
function dataFlatMapItems(dataFlat, id_contrato) {
  return dataFlat.flatMap((item) => {
    const normales = item.fechas.map((fecha) => ({
      id_tipo_horario: 0,
      fecha,
      hora_inicio: item.horario_inicio,
      minutos: item.total_minutos,
      observacion: "",
      id_contrato,
    }));

    const especiales = item.especiales.flatMap((esp) =>
      item.fechas.map((fecha) => ({
        id_tipo_horario: esp.tipo,
        hora_inicio: esp.inicio,
        minutos: esp.minutos,
        fecha,
        observacion: esp.observacion,
        id_contrato
      }))
    );

    return [...normales, ...especiales];
  });
}
