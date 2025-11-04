import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Table, Form, Pagination, Row, Col, Button } from 'react-bootstrap';

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
  componentsLeft
}) => {

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [sort, setSort] = useState(initialSort); // {id, direction}
  const [selected, setSelected] = useState(() => new Set());

  // [NEW] colWidths ahora solo se inicializa para columnas personalizables
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
        if (Number.isFinite(ps) && pageSizeOptions.includes(ps) && ps !== pageSize) setPageSize(ps);
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

  // [NEW] Guardar anchos iniciales SOLO para columnas personalizables
  useEffect(() => {
    if (!resizableColumns) return;

    const ths = tableRef.current?.querySelectorAll('thead th[data-col-id]');
    if (!ths?.length) return;

    const next = {};
    ths.forEach((th) => {
      const id = th.getAttribute('data-col-id');
      if (!id) return;
      const col = columns.find(c => c.id === id);
      if (!col) return;
      if (!col.isWidthPersonalize) return; // <- clave

      const rect = th.getBoundingClientRect();
      next[id] = Math.max(80, Math.round(rect.width));
    });

    setColWidths(next);
    setInitialWidths(next);
  }, [columns, resizableColumns]);

  // medir columnas que faltan ancho inicial
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
      const col = columns.find(c => c.id === id);
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
  const filtered = useMemo(() => {
    if (!search?.trim()) return data;
    const q = search.toLowerCase();
    return data.filter((row) => {
      for (const col of columns) {
        const val = col.render ? '' + col.render(row) : getByPath(row, col.accessor);
        if (val != null && String(val).toLowerCase().includes(q)) return true;
      }
      return false;
    });
  }, [data, search, columns]);

  // ---------------- sorting ----------------
  const sorted = useMemo(() => {
    if (!sort?.id) return filtered;
    const col = colById.get(sort.id);
    if (!col) return filtered;
    const dir = sort.direction === 'desc' ? -1 : 1;
    const arr = [...filtered];
    const acc = col.accessor ?? ((r) => undefined);

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
      console.warn('[DataTableRB] rowKey is requerido cuando selectableRows=true');
      return `${startIdx + idxOnPage}`;
    }
    return typeof rowKey === 'function' ? rowKey(row) : row?.[rowKey];
  };

  const [selectedSet, setSelectedSet] = [selected, setSelected]; 
  const toggleRow = (row, idxOnPage) => {
    const key = getRowKey(row, idxOnPage);
    if (key == null) return;
    const next = new Set(selectedSet);
    if (next.has(key)) next.delete(key); else next.add(key);
    setSelected(next);
  };

  const togglePageAll = () => {
    const keysOnPage = pageRows.map((r, i) => getRowKey(r, i)).filter((k) => k != null);
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
    const keysOnPage = pageRows.map((r, i) => getRowKey(r, i)).filter((k) => k != null);
    return keysOnPage.length > 0 && keysOnPage.every((k) => selectedSet.has(k));
  }, [pageRows, selectedSet, hasSelection]);

  useEffect(() => {
    if (!hasSelection || !onSelectionChange) return;
    const rows = [];
    const keys = [];
    const keyToRow = new Map();
    const mk = (row, idx) => (typeof rowKey === 'function' ? rowKey(row) : row?.[rowKey] ?? `${idx}`);
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

    // [NEW] si la columna NO es personalizable, no hacemos nada
    const colMeta = columns.find(c => c.id === colId);
    if (!colMeta?.isWidthPersonalize) return;

    e.preventDefault();
    e.stopPropagation();

    document.body.classList.add('dtrb-noselect');

    const startX = e.clientX;
    const startW =
      colWidths[colId] ??
      (tableRef.current
        ?.querySelector(`th[data-col-id="${colId}"]`)
        ?.getBoundingClientRect().width ?? 120);

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
      document.removeEventListener('mousemove', () => {});
      document.removeEventListener('mouseup', () => {});
    };
  }, []);

  const renderPagination = () => {
    const pc = pageCount;
    if (pc <= 1) return null;

    const items = [];
    const add = (p, label = p, disabled = false, active = false) =>
      items.push(
        <Pagination.Item key={label + '_' + p} disabled={disabled} active={active} onClick={() => changePage(p)}>
          {label}
        </Pagination.Item>
      );

    const windowSize = 5;
    const start = Math.max(1, currentPage - Math.floor(windowSize / 2));
    const end = Math.min(pc, start + windowSize - 1);
    const adjStart = Math.max(1, end - windowSize + 1);

    items.push(<Pagination.First key="first" disabled={currentPage === 1} onClick={() => changePage(1)} />);
    items.push(<Pagination.Prev key="prev" disabled={currentPage === 1} onClick={() => changePage(currentPage - 1)} />);

    if (adjStart > 1) add(1);
    if (adjStart > 2) items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);

    for (let p = adjStart; p <= end; p++) add(p, p, false, p === currentPage);

    if (end < pc - 1) items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
    if (end < pc) add(pc);

    items.push(<Pagination.Next key="next" disabled={currentPage === pc} onClick={() => changePage(currentPage + 1)} />);
    items.push(<Pagination.Last key="last" disabled={currentPage === pc} onClick={() => changePage(pc)} />);

    return <Pagination className="mb-0">{items}</Pagination>;
  };

  // ---------------- render helpers ----------------
  // [NEW] función para decidir ancho aplicado en TH/TD
  const getAppliedWidth = (col) => {
    if (col.isWidthPersonalize) {
      // si es personalizable usamos controlado (colWidths)
      if (colWidths[col.id] != null) return `${colWidths[col.id]}px`;
      return col.width; // fallback inicial si aún no medimos
    }
    // si NO es personalizable, usamos su width "fija" si pasó una
    return col.width;
  };

  const table = (
    <Table
      ref={tableRef}
      striped={striped}
      bordered={bordered}
      hover={hover}
      size={small ? 'sm' : undefined}
      responsive={responsive}
      className={`mb-0 fs-4 ${verticalBorders ? 'dtrb-vertical-borders' : ''}`}
      style={{ tableLayout: 'fixed' }}
    >
      <thead style={{ backgroundColor: stickyHeader ? 'var(--dtrb-header-bg, #fff)' : '#E9ECF1' }}>
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
              <Form.Check type="checkbox" checked={pageAllChecked} onChange={togglePageAll} />
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
                  paddingRight: showGrip ? 10 : undefined, // espacio grip
                }}
                title={col.sortable ? 'Click para ordenar' : undefined}
              >
                <div className="d-flex align-items-center gap-1 position-relative fs-4 ">
                  <span className="text-truncate">{col.header}</span>

                  {sort?.id === col.id && (
                    <small aria-label="sort-indicator">{sort.direction === 'asc' ? '▲' : '▼'}</small>
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
                  className="text-break"
                  key={col.id}
                  style={{
                    textAlign: col.cellAlign ?? 'left',
                    width: appliedWidth
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

  return (
    <div className="d-flex flex-column gap-2 roboto-sans-serif">
      {/* <Button
        variant="secondary"
        size="sm"
        onClick={() => setColWidths(initialWidths)}
      >
        Restaurar tamaños
      </Button> */}

      <Row className="g-2 align-items-center">
        <Col xs="auto">
          {componentsLeft}
        </Col>

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

      {stickyHeader ? (
        <div
          style={{
            maxHeight: stickyHeight,
            overflow: 'auto',
            position: 'relative',
            backgroundColor: 'var(--bs-body-bg, #fff)'
          }}
        >
          {table}
        </div>
      ) : (
        table
      )}

      <Row className="g-2 align-items-center">
        <Col className="text-muted">
          <small>
            Mostrando {sorted.length === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + pageSize, sorted.length)} de {sorted.length}
          </small>
        </Col>
        <Col xs="auto">{renderPagination()}</Col>
      </Row>
    </div>
  );
};
