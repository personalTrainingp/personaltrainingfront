import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap';
import { CardTitle } from '@/components';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import config from '@/config';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import './SumaDeSesiones.css';

export const TarjetasPago = ({ tasks = [], title = 'RANKING VENTA MEMBRESÍAS' }) => {
  // helper: sumar SOLO membresías/programas (items con id_pgm)
  const getTotalProgramas = (t) => {
    if (!Array.isArray(t?.items)) return 0;

    return t.items
      .filter((it) => it && typeof it === 'object' && 'id_pgm' in it) // <- esto es membresía
      .reduce((acc, it) => acc + Number(it.tarifa_monto || 0), 0);
  };

  // normalizar cada asesor y quedarnos SOLO con venta de programas
  const normalizados = (tasks || [])
    .map((t) => {
      // monto SOLO de programas
      const totalProgramas = getTotalProgramas(t);

      // nombre asesor
      const nombreCompleto =
        t?.empl ||
        t?.tb_empleado?.nombres_apellidos_empl ||
        '';

      const primerNombre = nombreCompleto
        ? nombreCompleto.trim().split(/\s+/)[0]
        : '—';

      // avatar
      let avatarFile = t?.avatar;
      if (!avatarFile) {
        const imgs = t?.tb_empleado?.tb_images || [];
        const pick =
          imgs.find(
            (i) =>
              i?.clasificacion_image === 'avatar-empleado' &&
              (i?.flag === true || i?.flag === 1)
          ) || imgs[0];

        if (pick?.name_image) {
          avatarFile = pick.name_image;
        } else if (pick?.uid) {
          avatarFile = `${pick.uid}${pick.extension_image || ''}`;
        }
      }

      return {
        nombre: primerNombre,
        total: totalProgramas, // <- OJO: ya no es t.monto, es SOLO PROGRAMAS
        avatar: avatarFile,
      };
    })
    // quitar asesores que no vendieron programas
    .filter((p) => p.total > 0)
    // ordenar desc por ventas de programas
    .sort((a, b) => b.total - a.total);

  // top 3
  const pagos = normalizados.slice(0, 3);

  // suma para %
  const totalVisible = pagos.reduce((acc, p) => acc + p.total, 0);

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
                  <th className="text-white p-1 fs-3" style={{ width: 250 }}>
                    IMAGEN
                  </th>
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
                      No hay ventas para mostrar.
                    </td>
                  </tr>
                )}

                {pagos.map((task, index) => {
                  const avatarSrc = task.avatar
                    ? `${config.API_IMG.AVATAR_EMPL}${task.avatar}`
                    : sinAvatar;

                  const porcentaje =
                    totalVisible > 0
                      ? (task.total / totalVisible) * 100
                      : 0;

                  return (
                    <tr key={task.nombre + index}>
                      <td style={{ width: '25px' }}>{index + 1}</td>

                      <td className="rank-img-cell">
                        <div className="img-cap">
                          {index === 0 && (
                            <div
                              className="copa-champions"
                              title="Primer lugar 🏆"
                            >
                              <img
                                src="/copa_1_lugar.jpg"
                                alt="Copa Champions"
                              />
                            </div>
                          )}
                          <img
                            className="avatar"
                            src={avatarSrc}
                            alt={task.nombre}
                          />
                        </div>
                      </td>

                      <td className="fw-bold w-25">
                        {task.nombre || '—'}
                      </td>

                      <td style={{ width: '25px' }}>
                        <NumberFormatMoney
                          amount={task.total}
                          symbol="S/"
                        />
                      </td>

                      <td>
                        <ProgressBar
                          animated
                          now={porcentaje}
                          className="progress-sm"
                          style={{
                            backgroundColor: '#00000042',
                            height: '15px',
                            width: '100%',
                          }}
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
