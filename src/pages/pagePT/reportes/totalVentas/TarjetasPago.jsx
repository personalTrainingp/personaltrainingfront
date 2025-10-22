import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap';
import { CardTitle } from '@/components';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import config from '@/config';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import './SumaDeSesiones.css';

export const TarjetasPago = ({ tasks, title }) => {

  const soloProgramas = tasks.filter(t =>
    t.tipo === 'programa' ||
    t.categoria === 'PROGRAMAS' ||
    t.id_programa !== null 
  );

  const pagos = soloProgramas
    .map(programa => ({
      nombre_producto: programa.empl?.split(' ')[0] || programa.empl,
      total_ventas: programa.monto,
      avatar: programa.avatar
    }))
    .filter(p => p.total_ventas > 1000)
    .sort((a, b) => b.total_ventas - a.total_ventas)
    .slice(0, 3);

  const totalVisible = pagos.reduce((acc, p) => acc + p.total_ventas, 0);

  const formatCurrency = (value) =>
    value.toLocaleString('es-PE', { style: 'currency', currency: 'PEN' });

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
                {(pagos || []).map((task, index) => {
                  const avatarSrc =
                    task.avatar === null
                      ? sinAvatar
                      : `${config.API_IMG.AVATAR_EMPL}${task.avatar}`;

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
                          <img
                            className="avatar"
                            src={avatarSrc}
                            alt={task.nombre_producto}
                          />
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
