import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Table, Form, Pagination, Row, Col } from 'react-bootstrap';
// Extrae todos los valores primitivos de un objeto (incluye anidados)
const collectValues = (value, acc) => {
  if (value == null) return;

  const t = typeof value;

  if (t === 'string' || t === 'number' || t === 'boolean') {
    acc.push(String(value));
    return;
  }

  if (Array.isArray(value)) {
    value.forEach((v) => collectValues(v, acc));
    return;
  }

  if (t === 'object') {
    Object.values(value).forEach((v) => collectValues(v, acc));
  }
};

const buildSearchText = (row) => {
  const values = [];
  collectValues(row, values);
  return values.join(' ').toLowerCase();
};
export const DataTableCR = ({
  columns = [],
  data = [],
  defaultPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
  searchable = true,
  filterPlaceholder = 'Buscar...',
  initialSort = null,
  stickyHeader = false,
  stickyHeight = '60vh',
  striped = true,
  bordered = true,
  hover = true,
  small = false,
  responsive = true,
  selectableRows = false,
  rowKey = null,
  onSelectionChange,
  onRowClick,
  emptyMessage = 'Sin datos',
  // --- URL sync ---
  syncUrl = false,
  pageParam = 'page',
  pageSizeParam = 'pageSize',
  stickyTopOffset = 0,
  // --- NUEVOS ---
  verticalBorders = false,
  resizableColumns = true,
  // --- Responsivo NUEVOS ---
  stackOnSmall = true,
  responsiveStackBelow = 768,
  componentsLeft,
    loading = false,
  skeletonRows = 8,
  backgroundHead='bg-danger'
}) => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sort, setSort] = useState(initialSort); // {id, direction}
  const [selected, setSelected] = useState(() => new Set());
  const [colWidths, setColWidths] = useState(() => {
    const w = {};
    for (const c of columns) {
      if (c.isWidthPersonalize) {
        if (typeof c.width === 'number') w[c.id] = c.width;
        if (typeof c.width === 'string' && c.width.endsWith('px')) {
          const n = parseInt(c.width, 10);
          if (Number.isFinite(n)) w[c.id] = n;
        }
      }
    }
    return w;
  });
  const [initialWidths, setInitialWidths] = useState({});

  const tableRef = useRef(null);
  const resizingRef = useRef({ active: false, colId: null, startX: 0, startW: 0 });

  // --- RESPONSIVE STACK (cards en móvil) ---
  const [isStacked, setIsStacked] = useState(false);

  useEffect(() => {
    if (!stackOnSmall) {
      setIsStacked(false);
      return;
    }

    const update = () => {
      if (typeof window === 'undefined') return;
      setIsStacked(window.innerWidth < responsiveStackBelow);
    };

    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [stackOnSmall, responsiveStackBelow]);

  // ---------------- URL sync ----------------
  useEffect(() => {
    if (!syncUrl) return;
    try {
      const params = new URLSearchParams(window.location.search);
      const p = parseInt(params.get(pageParam) || '', 10);
      const ps = parseInt(params.get(pageSizeParam) || '', 10);
      if (Number.isFinite(ps) && pageSizeOptions.includes(ps) && ps !== defaultPageSize) {
        setPageSize(ps);
      }
      if (Number.isFinite(p) && p > 0) {
        setPage(p);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!syncUrl) return;
    try {
      const params = new URLSearchParams(window.location.search);
      params.set(pageParam, String(page));
      params.set(pageSizeParam, String(pageSize));
      const hash = window.location.hash || '';
      const newUrl = `${window.location.pathname}?${params.toString()}${hash}`;
      window.history.replaceState(null, '', newUrl);
    } catch {}
  }, [syncUrl, page, pageSize, pageParam, pageSizeParam]);

  useEffect(() => {
    if (!syncUrl) return;
    const onPop = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const p = parseInt(params.get(pageParam) || '', 10);
        const ps = parseInt(params.get(pageSizeParam) || '', 10);
        if (Number.isFinite(ps) && pageSizeOptions.includes(ps) && ps !== pageSize)
          setPageSize(ps);
        if (Number.isFinite(p) && p > 0 && p !== page) setPage(p);
      } catch {}
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [syncUrl, pageParam, pageSizeParam, pageSize, page, pageSizeOptions]);

  // ---------------- utils ----------------
  const getByPath = (obj, path) => {
    if (obj == null || path == null) return undefined;
    if (typeof path === 'function') return path(obj);
    if (typeof path !== 'string') return undefined;
    return path.split('.').reduce((acc, k) => (acc == null ? undefined : acc[k]), obj);
  };

  const colById = useMemo(() => {
    const map = new Map();
    for (const c of columns) map.set(c.id, c);
    return map;
  }, [columns]);

  // Guardar anchos iniciales solo para columnas personalizables
  useEffect(() => {
    if (!resizableColumns) return;

    const ths = tableRef.current?.querySelectorAll('thead th[data-col-id]');
    if (!ths?.length) return;

    const next = {};
    ths.forEach((th) => {
      const id = th.getAttribute('data-col-id');
      if (!id) return;
      const col = columns.find((c) => c.id === id);
      if (!col || !col.isWidthPersonalize) return;

      const rect = th.getBoundingClientRect();
      next[id] = Math.max(80, Math.round(rect.width));
    });

    setColWidths(next);
    setInitialWidths(next);
  }, [columns, resizableColumns]);

  // Medir columnas que falten ancho inicial
  useEffect(() => {
    if (!resizableColumns) return;
    const missing = columns.some(
      (c) => c.isWidthPersonalize && colWidths[c.id] == null
    );
    if (!missing) return;

    const ths = tableRef.current?.querySelectorAll('thead th[data-col-id]');
    if (!ths?.length) return;

    const next = { ...colWidths };
    ths.forEach((th) => {
      const id = th.getAttribute('data-col-id');
      if (!id) return;
      const col = columns.find((c) => c.id === id);
      if (!col?.isWidthPersonalize) return;

      if (next[id] == null) {
        const rect = th.getBoundingClientRect();
        next[id] = Math.max(80, Math.round(rect.width));
      }
    });
    setColWidths(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns, resizableColumns]);

  // ---------------- filtering ----------------
const tokenize = (s) =>
  (s ?? "")
    .toLowerCase()
    .trim()
    .split(/\s+/)          // separa por uno o más espacios
    .filter(Boolean);      // evita tokens vacíos

const filtered = useMemo(() => {
  const tokens = tokenize(search);
  if (tokens.length === 0) return data;

  return data.filter((row) => {
    const text = buildSearchText(row);

    // AND: todas las palabras deben existir en la fila
    return tokens.every((t) => text.includes(t));

    // OR: al menos una palabra debe existir
    // return tokens.some((t) => text.includes(t));
  });
}, [data, search]);

  // ---------------- sorting ----------------
  const sorted = useMemo(() => {
    if (!sort?.id) return filtered;
    const col = colById.get(sort.id);
    if (!col) return filtered;
    const dir = sort.direction === 'desc' ? -1 : 1;
    const arr = [...filtered];
    const acc = col.accessor ?? (() => undefined);

    arr.sort((a, b) => {
      const va = typeof acc === 'function' ? acc(a) : getByPath(a, acc);
      const vb = typeof acc === 'function' ? acc(b) : getByPath(b, acc);
      const na = va == null ? '' : va;
      const nb = vb == null ? '' : vb;
      if (typeof na === 'number' && typeof nb === 'number') return (na - nb) * dir;
      const sa = String(na).toLowerCase();
      const sb = String(nb).toLowerCase();
      if (sa < sb) return -1 * dir;
      if (sa > sb) return 1 * dir;
      return 0;
    });

    return arr;
  }, [filtered, sort, colById]);

  // ---------------- pagination ----------------
  const pageCount = Math.max(1, Math.ceil(sorted.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const startIdx = (currentPage - 1) * pageSize;

  const pageRows = useMemo(
    () => sorted.slice(startIdx, startIdx + pageSize),
    [sorted, startIdx, pageSize]
  );

  useEffect(() => setPage(1), [search, pageSize, data.length]);

  // ---------------- selection ----------------
  const hasSelection = selectableRows === true;

  const getRowKey = (row, idxOnPage) => {
    if (!hasSelection) return null;
    if (!rowKey) {
      console.warn('[DataTableCR] rowKey es requerido cuando selectableRows=true');
      return `${startIdx + idxOnPage}`;
    }
    return typeof rowKey === 'function' ? rowKey(row) : row?.[rowKey];
  };

  const [selectedSet, setSelectedSet] = [selected, setSelected];

  const toggleRow = (row, idxOnPage) => {
    const key = getRowKey(row, idxOnPage);
    if (key == null) return;
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelected(next);
  };

  const togglePageAll = () => {
    const keysOnPage = pageRows
      .map((r, i) => getRowKey(r, i))
      .filter((k) => k != null);
    if (keysOnPage.every((k) => selectedSet.has(k))) {
      const next = new Set(selectedSet);
      keysOnPage.forEach((k) => next.delete(k));
      setSelected(next);
    } else {
      const next = new Set(selectedSet);
      keysOnPage.forEach((k) => next.add(k));
      setSelected(next);
    }
  };

  const pageAllChecked = useMemo(() => {
    if (!hasSelection) return false;
    const keysOnPage = pageRows
      .map((r, i) => getRowKey(r, i))
      .filter((k) => k != null);
    return keysOnPage.length > 0 && keysOnPage.every((k) => selectedSet.has(k));
  }, [pageRows, selectedSet, hasSelection]);

  useEffect(() => {
    if (!hasSelection || !onSelectionChange) return;
    const rows = [];
    const keys = [];
    const keyToRow = new Map();
    const mk = (row, idx) =>
      typeof rowKey === 'function' ? rowKey(row) : row?.[rowKey] ?? `${idx}`;
    data.forEach((r, i) => keyToRow.set(mk(r, i), r));
    for (const k of selectedSet) {
      if (keyToRow.has(k)) {
        keys.push(k);
        rows.push(keyToRow.get(k));
      }
    }
    onSelectionChange({ keys, rows });
  }, [selectedSet, hasSelection, onSelectionChange, data, rowKey]);

  // ---------------- sort handler ----------------
  const onSortClick = (col) => {
    if (!col.sortable) return;
    setSort((prev) => {
      if (!prev || prev.id !== col.id) return { id: col.id, direction: 'asc' };
      if (prev.direction === 'asc') return { id: col.id, direction: 'desc' };
      return null;
    });
  };

  const changePage = (p) => setPage(Math.min(Math.max(1, p), pageCount));

  // ---------------- column resize ----------------
  const startResize = (colId, e) => {
    if (!resizableColumns) return;

    const colMeta = columns.find((c) => c.id === colId);
    if (!colMeta?.isWidthPersonalize) return;

    e.preventDefault();
    e.stopPropagation();

    document.body.classList.add('dtrb-noselect');

    const startX = e.clientX;
    const startW =
      colWidths[colId] ??
      tableRef.current
        ?.querySelector(`th[data-col-id="${colId}"]`)
        ?.getBoundingClientRect().width ??
      120;

    resizingRef.current = { active: true, colId, startX, startW };

    const onMove = (ev) => {
      if (!resizingRef.current.active) return;
      const { colId: id, startX: sx, startW: sw } = resizingRef.current;
      const diff = ev.clientX - sx;
      const nextW = Math.max(60, sw + diff);
      setColWidths((prev) => ({ ...prev, [id]: Math.round(nextW) }));
    };

    const onUp = () => {
      resizingRef.current.active = false;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.body.classList.remove('dtrb-noselect');
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  };

  useEffect(() => {
    return () => {
      document.body.classList.remove('dtrb-noselect');
    };
  }, []);

  const renderPagination = () => {
    const pc = pageCount;
    if (pc <= 1) return null;

    const items = [];
    const add = (p, label = p, disabled = false, active = false) =>
      items.push(
        <Pagination.Item
          key={label + '_' + p}
          disabled={disabled}
          active={active}
          onClick={() => changePage(p)}
        >
          {label}
        </Pagination.Item>
      );

    const windowSize = 5;
    const start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    const end = Math.min(pc, start + windowSize - 1);
    const adjStart = Math.max(1, end - windowSize + 1);

    items.push(
      <Pagination.First
        key="first"
        disabled={currentPage === 1}
        onClick={() => changePage(1)}
      />
    );
    items.push(
      <Pagination.Prev
        key="prev"
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
      />
    );

    if (adjStart > 1) add(1);
    if (adjStart > 2) items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);

    for (let p = adjStart; p <= end; p++) add(p, p, false, p === currentPage);

    if (end < pc - 1) items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    if (end < pc) add(pc);

    items.push(
      <Pagination.Next
        key="next"
        disabled={currentPage === pc}
        onClick={() => changePage(currentPage + 1)}
      />
    );
    items.push(
      <Pagination.Last
        key="last"
        disabled={currentPage === pc}
        onClick={() => changePage(pc)}
      />
    );

    return <Pagination className="mb-0">{items}</Pagination>;
  };

  // ---------------- render helpers ----------------
  const getAppliedWidth = (col) => {
    if (col.isWidthPersonalize) {
      if (colWidths[col.id] != null) return `${colWidths[col.id]}px`;
      return col.width;
    }
    return col.width;
  };

  // --- VISTA TABLA ---
    const SkeletonBar = ({ w = '70%', h = 14 }) => (
    <div
      className="dtrb-skeleton"
      style={{
        width: w,
        height: h,
        borderRadius: 8,
      }}
    />
  );

  const getSkeletonWidth = (col, i) => {
    // si viene con width fijo, úsalo (o algo cercano)
    const applied = getAppliedWidth(col);
    if (typeof applied === 'string' && applied.endsWith('px')) return '85%';
    if (typeof applied === 'number') return '85%';

    // patrón para que se vea natural
    const preset = ['35%', '55%', '75%', '60%', '80%'];
    return preset[i % preset.length];
  };

  const skeletonTable = (
    <Table
      ref={tableRef}
      striped={striped}
      bordered={bordered}
      hover={hover}
      size={small ? 'sm' : undefined}
      className={`mb-0 fs-4 ${verticalBorders ? 'dtrb-vertical-borders' : ''}`}
      style={{
        width: '100%',
        minWidth: `${Math.max(columns.length * 140, 600)}px`,
        tableLayout: 'auto',
      }}
    >
      <thead
        style={{
          backgroundColor: stickyHeader ? 'var(--dtrb-header-bg, #fff)' : '#E9ECF1',
        }}
      >
        <tr>
          {selectableRows && (
            <th
              className="dtrb-sticky-left"
              style={{
                width: 36,
                position: stickyHeader ? 'sticky' : undefined,
                left: stickyHeader ? 0 : undefined,
                top: stickyHeader ? stickyTopOffset : undefined,
                backgroundColor: stickyHeader ? 'var(--bs-body-bg, #fff)' : undefined,
                zIndex: stickyHeader ? 1022 : undefined,
              }}
            >
              <div style={{ width: 18, height: 18 }} className="dtrb-skeleton rounded" />
            </th>
          )}

          {columns.map((col) => {
            const appliedWidth = getAppliedWidth(col);
            const showGrip = resizableColumns && col.isWidthPersonalize;

            return (
              <th
                key={col.id}
                data-col-id={col.id}
                style={{
                  width: appliedWidth,
                  position: stickyHeader ? 'sticky' : undefined,
                  top: stickyHeader ? stickyTopOffset : undefined,
                  backgroundColor: stickyHeader ? 'var(--bs-body-bg, #fff)' : undefined,
                  zIndex: stickyHeader ? 1021 : undefined,
                  textAlign: col.headerAlign ?? 'left',
                  paddingRight: showGrip ? 10 : undefined,
                }}
              >
                <div className="d-flex align-items-center gap-2">
                  <SkeletonBar w="65%" h={14} />
                </div>

                {showGrip && (
                  <span className="dtrb-col-resizer" style={{ pointerEvents: 'none' }} />
                )}
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {Array.from({ length: skeletonRows }).map((_, ri) => (
          <tr key={`sk_${ri}`}>
            {selectableRows && (
              <td
                className="dtrb-sticky-left"
                style={{
                  position: stickyHeader ? 'sticky' : undefined,
                  left: stickyHeader ? 0 : undefined,
                  background: stickyHeader ? 'var(--bs-body-bg)' : undefined,
                  zIndex: 4,
                  width: 36,
                }}
              >
                <div style={{ width: 18, height: 18 }} className="dtrb-skeleton rounded" />
              </td>
            )}

            {columns.map((col, ci) => {
              const appliedWidth = getAppliedWidth(col);
              return (
                <td
                  key={`${col.id}_${ri}`}
                  style={{
                    textAlign: col.cellAlign ?? 'left',
                    width: appliedWidth,
                  }}
                >
                  <SkeletonBar w={getSkeletonWidth(col, ci)} h={14} />
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );

  const skeletonWrapped = stickyHeader ? (
    <div
      style={{
        maxHeight: stickyHeight,
        overflowY: 'auto',
        overflowX: responsive ? 'auto' : 'hidden',
        position: 'relative',
        backgroundColor: 'var(--bs-body-bg, #fff)',
      }}
    >
      {skeletonTable}
    </div>
  ) : (
    <div style={{ overflowX: responsive ? 'auto' : 'hidden', width: '100%' }}>
      {skeletonTable}
    </div>
  );

  const skeletonStacked = (
    <div className="d-flex flex-column gap-2">
      {Array.from({ length: skeletonRows }).map((_, ri) => (
        <div key={`sk_card_${ri}`} className="border rounded p-2 bg-white shadow-sm">
          <div className="d-flex align-items-center mb-2 gap-2">
            {selectableRows && (
              <div style={{ width: 18, height: 18 }} className="dtrb-skeleton rounded" />
            )}
            <SkeletonBar w="60%" h={14} />
          </div>

          <div className="row g-2">
            {columns.slice(1).map((col, ci) => (
              <div key={`${col.id}_${ri}`} className="col-12">
                <small className="text-muted fw-semibold">{col.header}</small>
                <div className="mt-1">
                  <SkeletonBar w={getSkeletonWidth(col, ci)} h={14} />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const table = (
    <Table
            ref={tableRef}
      striped={striped}
      bordered={bordered}
      hover={hover}
      size={small ? 'sm' : undefined}
      // responsive lo maneja el wrapper, aquí lo dejamos sin tocar
      className={`mb-0 fs-4 ${verticalBorders ? 'dtrb-vertical-borders' : ''}`}
      style={{
        width: '100%',
        // clave: aseguramos que la tabla SEA más ancha que el contenedor
        minWidth: `${Math.max(columns.length * 140, 600)}px`,
        tableLayout: 'auto', // permite que respete mejor el contenido
      }}
    >
      <thead
        style={{
          backgroundColor: stickyHeader ? 'var(--dtrb-header-bg, #fff)' : '#E9ECF1',
        }}
      >
        <tr>
          {selectableRows && (
            <th
              className="dtrb-sticky-left"
              style={{
                width: 36,
                position: stickyHeader ? 'sticky' : undefined,
                left: stickyHeader ? 0 : undefined,
                top: stickyHeader ? stickyTopOffset : undefined,
                backgroundColor: stickyHeader ? 'var(--bs-body-bg, #fff)' : undefined,
                zIndex: stickyHeader ? 1022 : undefined,
                boxShadow: stickyHeader ? '0 1px 0 rgba(0,0,0,.08)' : undefined,
              }}
            >
              <Form.Check
                type="checkbox"
                checked={pageAllChecked}
                onChange={togglePageAll}
              />
            </th>
          )}

          {columns.map((col) => {
            const appliedWidth = getAppliedWidth(col);
            const showGrip = resizableColumns && col.isWidthPersonalize;

            return (
              <th
                key={col.id}
                data-col-id={col.id}
                onClick={() => onSortClick(col)}
                style={{
                  cursor: col.sortable ? 'pointer' : 'default',
                  width: appliedWidth,
                  position: stickyHeader ? 'sticky' : undefined,
                  top: stickyHeader ? stickyTopOffset : undefined,
                  backgroundColor: stickyHeader ? 'var(--bs-body-bg, #fff)' : undefined,
                  zIndex: stickyHeader ? 1021 : undefined,
                  textAlign: col.headerAlign ?? 'left',
                  boxShadow: stickyHeader ? '0 1px 0 rgba(0,0,0,.08)' : undefined,
                  paddingRight: showGrip ? 10 : undefined,
                }}
                title={col.sortable ? 'Click para ordenar' : undefined}
              >
                <div className="d-flex align-items-center gap-1 position-relative fs-4">
                  <span className="text-truncate">{col.header}</span>

                  {sort?.id === col.id && (
                    <small aria-label="sort-indicator">
                      {sort.direction === 'asc' ? '▲' : '▼'}
                    </small>
                  )}

                  {showGrip && (
                    <span
                      className="dtrb-col-resizer"
                      onMouseDown={(e) => startResize(col.id, e)}
                      onClick={(e) => e.stopPropagation()}
                      role="separator"
                      aria-orientation="vertical"
                      aria-label={`Redimensionar columna ${col.id}`}
                    />
                  )}
                </div>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {pageRows.length === 0 && (
          <tr>
            <td
              colSpan={(selectableRows ? 1 : 0) + columns.length}
              className="text-center text-muted py-4"
            >
              {emptyMessage}
            </td>
          </tr>
        )}

        {pageRows.map((row, ri) => (
          <tr
            key={(selectableRows ? getRowKey(row, ri) : undefined) ?? ri}
            onClick={() => onRowClick?.(row, startIdx + ri)}
            style={{ cursor: onRowClick ? 'pointer' : undefined }}
          >
            {selectableRows && (
              <td
                className="dtrb-sticky-left"
                style={{
                  position: stickyHeader ? 'sticky' : undefined,
                  left: stickyHeader ? 0 : undefined,
                  background: stickyHeader ? 'var(--bs-body-bg)' : undefined,
                  zIndex: 4,
                  width: 36,
                }}
              >
                <Form.Check
                  type="checkbox"
                  checked={selectedSet.has(getRowKey(row, ri))}
                  onChange={() => toggleRow(row, ri)}
                  onClick={(e) => e.stopPropagation()}
                />
              </td>
            )}

            {columns.map((col) => {
              const appliedWidth = getAppliedWidth(col);
              return (
                <td
                  key={col.id}
                  style={{
                    textAlign: col.cellAlign ?? 'left',
                    width: appliedWidth,
                  }}
                >
                  {col.render
                    ? col.render(row, startIdx + ri)
                    : String(
                        typeof col.accessor === 'function'
                          ? col.accessor(row)
                          : getByPath(row, col.accessor)
                      )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );

    const tableWrapped = stickyHeader ? (
    // Cuando stickyHeader = true -> controlamos ambos scrolls
    <div
      style={{
        maxHeight: stickyHeight,
        overflowY: 'auto',
        overflowX: responsive ? 'auto' : 'hidden', // <-- scroll horizontal AQUÍ
        position: 'relative',
        backgroundColor: 'var(--bs-body-bg, #fff)',
      }}
    >
      {table}
    </div>
  ) : (
    // Cuando stickyHeader = false -> igual forzamos overflowX aquí
    <div
      style={{
        overflowX: responsive ? 'auto' : 'hidden', // <-- scroll horizontal AQUÍ
        width: '100%',
      }}
    >
      {table}
    </div>
  );

  // --- VISTA STACK (cards en móvil) ---
  const stackedView = (
    <div className="d-flex flex-column gap-2">
      {pageRows.length === 0 && (
        <div className="text-center text-muted py-4">{emptyMessage}</div>
      )}

      {pageRows.map((row, ri) => {
        const key = (selectableRows ? getRowKey(row, ri) : undefined) ?? ri;
        const checked = selectableRows ? selectedSet.has(getRowKey(row, ri)) : false;

        const handleCardClick = () => {
          onRowClick?.(row, startIdx + ri);
        };

        return (
          <div
            key={key}
            className="border rounded p-2 bg-white shadow-sm"
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
            onClick={handleCardClick}
          >
            <div className="d-flex align-items-center mb-2">
              {selectableRows && (
                <Form.Check
                  className="me-2"
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleRow(row, ri)}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
              {/* Título opcional: primera columna como título */}
              {columns[0] && (
                <strong className="text-truncate">
                  {columns[0].render
                    ? columns[0].render(row, startIdx + ri)
                    : String(
                        typeof columns[0].accessor === 'function'
                          ? columns[0].accessor(row)
                          : getByPath(row, columns[0].accessor)
                      )}
                </strong>
              )}
            </div>

            <div className="row g-1">
              {columns.map((col, ci) => {
                // Ya se mostró como título arriba (opcional)
                if (ci === 0) return null;

                const value = col.render
                  ? col.render(row, startIdx + ri)
                  : getByPath(row, col.accessor);

                return (
                  <div key={col.id} className="col-12">
                    <div className="d-flex flex-column">
                      <small className="text-muted fw-semibold">{col.header}</small>
                      <span className="text-break">
                        {value != null ? String(value) : ''}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
  const mainContent = loading
    ? (isStacked ? skeletonStacked : skeletonWrapped)
    : (isStacked ? stackedView : tableWrapped);

  return (
    <div className="d-flex flex-column gap-2 roboto-sans-serif">
      <Row className="g-2 align-items-center">
        <Col xs="auto">{componentsLeft}</Col>

        <Col xs="12" md="auto" className="ms-auto">
          {searchable && (
            <Form.Control
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={filterPlaceholder}
              aria-label="Buscar"
            />
          )}
        </Col>

        <Col xs="auto">
          <Form.Select
            aria-label="Tamaño de página"
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
          >
            {pageSizeOptions.map((n) => (
              <option key={n} value={n}>
                {n} por página
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {mainContent}

      <Row className="g-2 align-items-center">
        <Col className="text-muted">
          <small>
            Mostrando {sorted.length === 0 ? 0 : startIdx + 1}–
            {Math.min(startIdx + pageSize, sorted.length)} de {sorted.length}
          </small>
        </Col>
        <Col xs="auto">{renderPagination()}</Col>
      </Row>
    </div>
  );
};
