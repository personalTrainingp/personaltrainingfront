import { useEffect, useMemo } from 'react';
import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap';
import { CardTitle } from '@/components';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import config from '@/config';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import './SumaDeSesiones.css';

export const TarjetasPago = ({ tasks = [], title }) => {
  // LOG 1: entrada cruda
  useEffect(() => {
    console.groupCollapsed(`[TarjetasPago] ${title} › entrada`);
    console.log('tasks (raw):', tasks);
    console.log('tasks.length:', Array.isArray(tasks) ? tasks.length : 'no-array');
    if (Array.isArray(tasks)) console.table(tasks.slice(0, 5));
    console.groupEnd();
  }, [tasks, title]);

  // Asegúrate de que sea array
  const list = Array.isArray(tasks) ? tasks : [];

  // LOG 2: pre-filtro
  useEffect(() => {
    console.groupCollapsed('[TarjetasPago] pre-filtro');
    console.log('items recibidos:', list.length);
    console.table(list.slice(0, 5));
    console.groupEnd();
  }, [list]);

  // ⚠️ Antes filtrabas por tipo/categoría/id_programa, pero tus items vienen de empl_monto y no traen esos campos.
  // Si igual los tuvieran, re-activa el filtro de abajo.
  const soloProgramas = list;
  //   .filter(t =>
  //     t.tipo === 'programa' ||
  //     t.categoria === 'PROGRAMAS' ||
  //     t.id_programa != null
  //   );

  // LOG 3: post-filtro programas
  useEffect(() => {
    console.groupCollapsed('[TarjetasPago] post-filtro programas');
    console.log('soloProgramas.length:', soloProgramas.length);
    console.table(soloProgramas.slice(0, 5));
    console.groupEnd();
  }, [soloProgramas]);

  const pagos = useMemo(() => {
    const mapped = soloProgramas.map(programa => ({
      nombre_producto: programa.empl?.split(' ')[0] || programa.empl || '—',
      total_ventas: Number(programa.monto) || 0,
      avatar: programa.avatar ?? null
    }));

    // OJO: quité el “> 1000” por debug. Si quieres, vuelve a ponerlo tras verificar datos.
    const filtrados = mapped.filter(p => p.total_ventas > 0);

    const ordenados = filtrados.sort((a, b) => b.total_ventas - a.total_ventas);

    // LOG 4: resultado final que se renderiza
    console.groupCollapsed('[TarjetasPago] resultado para UI');
    console.table(ordenados.map(p => ({
      asesor: p.nombre_producto,
      total_ventas: p.total_ventas,
      avatar: p.avatar
    })));
    console.groupEnd();

    return ordenados.slice(0, 3);
  }, [soloProgramas]);

  const totalVisible = pagos.reduce((acc, p) => acc + p.total_ventas, 0);

  return (
    <Card className="ranking-card">
      <Card.Body>
        <CardTitle
          containerClass="d-flex align-items-center justify-content-between mb-3"
          title={<h2>{title}</h2>}
          menuItems={false}
        />
        <Row>
          <Col lg={12}>
            <Table className="table-centered mb-0 fs-4" hover responsive>
              <thead className="bg-primary">
                <tr>
                  <th className="text-white p-1 fs-3">ID</th>
                  <th className="text-white p-1 fs-3" style={{ width: 250 }}>IMAGEN</th>
                  <th className="text-white p-1 fs-3">ASESORES</th>
                  <th className="text-white p-1">
                    <SymbolSoles numero="" isbottom={false} />
                  </th>
                  <th className="text-white p-1"></th>
                  <th className="text-white p-1 fs-3">%</th>
                </tr>
              </thead>
              <tbody>
                {pagos.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4">
                      Sin datos para mostrar (revisa la consola).
                    </td>
                  </tr>
                )}
                {pagos.map((task, index) => {
                  const avatarSrc =
                    task.avatar ? `${config.API_IMG.AVATAR_EMPL}${task.avatar}` : sinAvatar;

                  const porcentaje = totalVisible > 0
                    ? (task.total_ventas / totalVisible) * 100
                    : 0;

                  return (
                    <tr key={task.nombre_producto + index}>
                      <td style={{ width: '25px' }}>{index + 1}</td>
                      <td className="rank-img-cell">
                        <div className="img-cap">
                          {index === 0 && (
                            <div className="copa-champions" title="Primer lugar 🏆">
                              <img src="/copa_1_lugar.jpg" alt="Copa Champions" />
                            </div>
                          )}
                          <img className="avatar" src={avatarSrc} alt={task.nombre_producto} />
                        </div>
                      </td>
                      <td className="fw-bold w-25">{task.nombre_producto}</td>
                      <td style={{ width: '25px' }}>
                        <NumberFormatMoney amount={task.total_ventas} symbol="S/" />
                      </td>
                      <td>
                        <ProgressBar
                          animated
                          now={porcentaje}
                          className="progress-sm"
                          style={{ backgroundColor: '#00000042', height: 15, width: '100%' }}
                          variant="orange"
                        />
                      </td>
                      <td>{porcentaje.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};
