import React, { useMemo, useState, useCallback } from 'react';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Dropdown } from 'primereact/dropdown';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import dayjs from 'dayjs';
import 'dayjs/locale/es';

dayjs.locale('es');

// ---------- Utils fecha ----------
const pad2 = (n) => String(n).padStart(2, '0');
const fmtTime = (d) => dayjs(d).format('hh:mm A');
const minutesBetween = (a, b) => dayjs(b).diff(dayjs(a), 'minute');
const addMin = (t, m) => dayjs(t).add(m, 'minute').toDate();
const dateKey = (d) => dayjs(d).format('YYYY-MM-DD');

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
                background: strong ? '#FFE766' : (isHover ? '#FFF6B3' : (isCurrentMonth ? '#f7f7f7' : '#fafafa')),
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

// ---------- Modales: Especial ----------
const tiposEspecial = [
  { label: 'Refrigerio', value: 'refrigerio' },
  { label: 'Virtual', value: 'virtual' },
  { label: 'Descanso', value: 'descanso' },
//   { label: 'Otro', value: 'otro' },
];

const ModalEspecial = ({ visible, onHide, onAdd }) => {
  const [inicio, setInicio] = useState('12:00');
  const [fin, setFin] = useState('13:00');
  const [tipo, setTipo] = useState('refrigerio');
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
          <Dropdown options={tiposEspecial} value={tipo} onChange={(e) => setTipo(e.value)} />
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
  baseHorario = '12:00',
  onAceptar,
}) => {
  const [modo, setModo] = useState('columna');
  const [minutos, setMinutos] = useState(60);
  const [especiales, setEspeciales] = useState([]);
  const [showEspecial, setShowEspecial] = useState(false);

  const totalEspeciales = useMemo(() => especiales.reduce((a, e) => a + (e.minutos || 0), 0), [especiales]);

  const parseHM = (s) => {
    const [hh, mm] = s.split(':').map(Number);
    const base = dayjs().hour(hh || 0).minute(mm || 0).second(0).millisecond(0);
    return base.toDate();
  };

  const inicioDate = useMemo(() => parseHM(baseHorario), [baseHorario]);
  const finDate = useMemo(() => addMin(inicioDate, (minutos || 0) + totalEspeciales), [inicioDate, minutos, totalEspeciales]);

  const handleAddEspecial = (esp) => setEspeciales((arr) => [...arr, esp]);
  const handleRemoveEspecial = (idx) => setEspeciales((arr) => arr.filter((_, i) => i !== idx));

  const aceptar = () => {
    onAceptar?.({
      modo,
      horario_inicio: baseHorario,
      minutos: minutos || 0,
      especiales,
      horario_fin_jor: fmtTime(finDate),
      total_minutos: (minutos || 0) + totalEspeciales,
    });
    onHide?.();
  };

  return (
    <>
      <Dialog header={`Jornada para ${baseHorario}`} visible={visible} onHide={onHide} style={{ width: 600 }}>
        <div className="p-fluid" style={{ display: 'grid', gap: 12 }}>
          <div>
            <label>Modo de pintado</label>
            <Dropdown options={opcionesModo} value={modo} onChange={(e) => setModo(e.value)} />
          </div>
          <div>
            <label>Duración (minutos)</label>
            <InputNumber value={minutos} onValueChange={(e) => setMinutos(e.value ?? 0)} min={0} showButtons />
          </div>
          <div>
            <b>Horario fin (auto):</b> {fmtTime(finDate)} &nbsp;
            <small>({totalEspeciales} min especiales incluidos)</small>
          </div>

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
const PanelItems = ({ items, onToggleDetail, onDelete }) => {
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
    </div>
  );
};

// ---------- Componente principal ----------
export const ModalAgregarJornada = ({
  show,
  onHide,
  arrayFecha = [new Date(), 'indefinido'],
  horarios = [{ horario: '12:00' }, { horario: '15:00' }, { horario: '18:00' }],
  uid_empl,
}) => {
  const [from, to] = arrayFecha || [];
  const months = useMemo(() => getMonthsInRange(from, to), [from, to]);
  const isFullYear = months.length === 12;
  const columns = months.length === 1 ? 1 : (isFullYear ? 4 : Math.min(4, months.length));

  // Sidebar + modal jornada
  const [selectedHorario, setSelectedHorario] = useState(null);
  const [showJornada, setShowJornada] = useState(false);

  // Modo pintado activo (tras aceptar jornada)
  const [painter, setPainter] = useState(null); // { modo, horario_inicio, horario_fin_jor, total_minutos, especiales }
  const [hoverSet, setHoverSet] = useState(new Set()); // fechas (YYYY-MM-DD) resaltadas claro
  const [strongMap, setStrongMap] = useState(new Map()); // fecha -> { number, itemId }

  // Lista de items creados
  const [items, setItems] = useState([]);
  const [counter, setCounter] = useState(1);

  // Abrir modal jornada al elegir horario
  const handlePickHorario = (h) => {
    setSelectedHorario(h.horario);
    setShowJornada(true);
  };

  // Tras aceptar jornada → activar pintado
  const handleAceptarJornada = (data) => {
    setPainter(data); // activar modo pintura
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
      // 🔥 NUEVO: cada 14 días (quincenal)
      months.forEach((m) => {
        const startMonth = m.startOf('month');
        const endMonth = m.endOf('month');

        // hacia adelante
        let c = d.clone();
        while (c.isBefore(endMonth) || c.isSame(endMonth, 'day')) {
          set.add(c.format('YYYY-MM-DD'));
          c = c.add(14, 'day'); // salto de 14 días
        }

        // hacia atrás
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

        // aplicar amarillo fuerte y número
        setStrongMap((prev) => {
          const next = new Map(prev);
          toPaint.forEach((k) => next.set(k, { number, itemId }));
          return next;
        });

        // registrar item
        const item = {
          id: itemId,
          number,
          ...painter,
          horario_fin_jor: painter.horario_fin_jor,
          fechas: Array.from(toPaint),
          showDetail: false,
        };
        setItems((arr) => [...arr, item]);
        setCounter((n) => n + 1);

        // salir de modo pintor (si prefieres permanecer, comenta la siguiente línea)
        setPainter(null);
        setHoverSet(new Set());
      },
    });
  };

  const toggleDetail = (id) => {
    setItems((arr) => arr.map((it) => it.id === id ? { ...it, showDetail: !it.showDetail } : it));
  };

  const deleteItem = (id) => {
    // quitar pintado
    setStrongMap((prev) => {
      const next = new Map(prev);
      Array.from(next.entries()).forEach(([k, v]) => {
        if (v.itemId === id) next.delete(k);
      });
      return next;
    });
    // quitar item
    setItems((arr) => arr.filter((it) => it.id !== id));
  };

  // Render
  return (
    <Dialog onHide={onHide} visible={show} header={'AGREGAR JORNADA'} style={{ width: '95vw', maxWidth: 1400 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr 320px', gap: 12, minHeight: 500 }}>
        {/* Sidebar izquierda */}
        <div style={{ borderRight: '1px solid #eee', paddingRight: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Horarios</div>
          <div style={{ display: 'grid', gap: 6 }}>
            {horarios.map((h, idx) => (
              <button
                key={idx}
                onClick={() => handlePickHorario(h)}
                className="p-button p-component"
                style={{ width: '100%', justifyContent: 'flex-start' }}
              >
                {h.horario}
              </button>
            ))}
          </div>

          {/* Estado del pintor */}
          <div style={{ marginTop: 16, fontSize: 12, opacity: .8 }}>
            {painter
              ? <>Modo activo: <b>{painter.modo}</b><br/>Inicio: <b>{painter.horario_inicio}</b><br/>Fin: <b>{painter.horario_fin_jor}</b></>
              : <>Selecciona un horario para configurar la jornada.</>}
          </div>
        </div>

        {/* Grid de meses */}
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

        {/* Panel derecho items */}
        <PanelItems items={items} onToggleDetail={toggleDetail} onDelete={deleteItem} />
      </div>

      {/* Modal jornada */}
      <ModalJornada
        visible={showJornada}
        onHide={() => setShowJornada(false)}
        baseHorario={selectedHorario || '12:00'}
        onAceptar={handleAceptarJornada}
      />
    </Dialog>
  );
};
