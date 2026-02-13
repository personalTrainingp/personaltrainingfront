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
