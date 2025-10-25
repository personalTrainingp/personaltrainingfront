import { Card, Col, ProgressBar, Row, Table } from 'react-bootstrap';
import { CardTitle } from '@/components';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import sinAvatar from '@/assets/images/sinPhoto.jpg';
import config from '@/config';
import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import './SumaDeSesiones.css';

export const TarjetasPago = ({ tasks = [], title = 'RANKING VENTA MEMBRESÍAS' }) => {
  // ---- Helpers para soportar datos "adaptados" o "crudos" ----
  const isPrograma = (t) =>
    t?.tipo === 'programa' ||
    String(t?.categoria || '').toUpperCase() === 'PROGRAMAS' ||
    t?.id_programa != null ||
    (Array.isArray(t?.detalle_membresia) && t.detalle_membresia.length > 0);

  const getNombre = (t) => {
    const fromAdapter = t?.empl; // p.ej. "ALVARO SALAZAR GOMEZ"
    const fromRaw = t?.tb_empleado?.nombres_apellidos_empl; // JSON crudo
    const base = (fromAdapter ?? fromRaw ?? '').trim();
    return base ? base.split(/\s+/)[0] : ''; // solo primer nombre
  };

  const getTotal = (t) => {
    // Prioriza campos ya adaptados
    const byAdapter = Number(t?.monto ?? t?.total_ventas ?? 0);
    if (byAdapter > 0) return byAdapter;

    // Suma membresías (ventas)
    const sumMemb = (t?.detalle_membresia || []).reduce(
      (acc, it) => acc + Number(it?.tarifa_monto || 0),
      0
    );

    // Como alternativa, suma pagos (si tu backend liquida por pagos)
    const sumPagos = (t?.detalle_pago || []).reduce(
      (acc, it) => acc + Number(it?.parcial_monto || 0),
      0
    );

    return Math.max(sumMemb, sumPagos);
  };

  const getAvatarFile = (t) => {
    if (t?.avatar) return t.avatar; // nombre de archivo ya adaptado

    const imgs = t?.tb_empleado?.tb_images || [];
    const pick =
      imgs.find(
        (i) => i?.clasificacion_image === 'avatar-empleado' && (i?.flag === true || i?.flag === 1)
      ) || imgs[0];

    if (!pick) return null;

    // Tu API de imágenes usa generalmente name_image
    if (pick.name_image) return pick.name_image;

    // fallback: construir con uid y extensión
    if (pick.uid) return `${pick.uid}${pick.extension_image || ''}`;

    return null;
  };

  // ---- Filtrado, mapeo y top 3 ----
  const soloProgramas = (tasks || []).filter(isPrograma);

  const itemsOrdenados = soloProgramas
    .map((t) => ({
      nombre_producto: getNombre(t),
      total_ventas: getTotal(t),
      avatar: getAvatarFile(t),
    }))
    .filter((p) => p.total_ventas > 0)
    .sort((a, b) => b.total_ventas - a.total_ventas);

  // Mostramos top 3
  const pagos = itemsOrdenados.slice(0, 3);

  // El % es sobre lo visible (top 3). Si quieres que sea sobre el total, usa itemsOrdenados en lugar de pagos.
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

                  const porcentaje = totalVisible > 0 ? (task.total_ventas / totalVisible) * 100 : 0;

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

                      <td className="fw-bold w-25">{task.nombre_producto || '—'}</td>

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
