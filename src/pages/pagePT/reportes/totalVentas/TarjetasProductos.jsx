import React, { useMemo } from "react";
import { Card, Col, ProgressBar, Row, Table } from "react-bootstrap";
import { CardTitle } from "@/components";
import { NumberFormatMoney } from "@/components/CurrencyMask";
import sinAvatar from "@/assets/images/sinPhoto.jpg";
import config from "@/config";
import { SymbolSoles } from "@/components/componentesReutilizables/SymbolSoles";
import "./SumaDeSesiones.css";

const limaFromISO = (iso) => {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  const utc = d.getTime() + d.getTimezoneOffset() * 60000;
  return new Date(utc - 5 * 60 * 60000);
};
const inRange = (d, start, end) => !!(d && (!start || d >= start) && (!end || d <= end));

const norm = (s) =>
  String(s ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const firstToken = (s) => (String(s || "").split(" ")[0] || "").toUpperCase();

const getEmpleadoDeVenta = (v) => v?.tb_ventum?.tb_empleado || v?.tb_empleado || v?.empleado || null;

const getNombreEmpleado = (emp) =>
  norm(
    emp?.nombres_apellidos_empl ||
    emp?.nombres_apellidos ||
    emp?.nombre_empl ||
    emp?.nombre ||
    ""
  );

const getAvatarEmpleado = (emp) =>
  emp?.avatar ||
  emp?.tb_images?.[(emp?.tb_images?.length || 0) - 1]?.name_image ||
  emp?.image ||
  "";


export const aggregateProductsByAdvisor = (ventas = [], start = null, end = null) => {
  const map = new Map();

  for (const v of ventas) {
    const d = limaFromISO(v?.fecha_venta || v?.fecha || v?.createdAt);
    if (!inRange(d, start, end)) continue;

    const prods =
      v?.detalle_ventaProductos ||
      v?.detalle_ventaproductos ||
      v?.detalle_venta_productos ||
      [];
    if (!prods.length) continue;

    const emp = getEmpleadoDeVenta(v);
    const nombre = getNombreEmpleado(emp) || "SIN NOMBRE";
    const key = nombre.toUpperCase();
    const avatar = getAvatarEmpleado(emp);

    let ventaProductos = 0;
    for (const it of prods) {
      const cantidad = Number(it?.cantidad ?? 1) || 1;
      const pUnit =
        Number(it?.tarifa_monto) ||
        Number(it?.precio_unitario) ||
        Number(it?.tb_producto?.prec_venta) ||
        0;
      ventaProductos += cantidad * pUnit;
    }
    if (ventaProductos <= 0) continue;

    const acc = map.get(key) || { asesor: nombre, total_ventas: 0, avatar: avatar || null };
    acc.total_ventas += ventaProductos;
    if (!acc.avatar && avatar) acc.avatar = avatar;
    map.set(key, acc);
  }

  return Array.from(map.values()).sort((a, b) => (b.total_ventas || 0) - (a.total_ventas || 0));
};

export const useProductosAgg = (ventas = [], rangeDate = [], { minImporte = 0 } = {}) => {
  const start = rangeDate?.[0] ? new Date(rangeDate[0]) : null;
  const end = rangeDate?.[1] ? new Date(rangeDate[1]) : null;

  return useMemo(() => {
    const agg = aggregateProductsByAdvisor(ventas, start, end);
    return agg.filter((p) => Number(p.total_ventas) >= Number(minImporte));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ventas, start?.getTime?.(), end?.getTime?.(), minImporte]);
};


export const TarjetasProductos = ({
  tasks = [],
  title = "Ranking Venta de Productos",
  topN = 5,
  minImporte = 0,
  avatarByAdvisor = {},
}) => {
  const { top, totalVisible } = useMemo(() => {
    const list = (tasks || [])
      .filter((p) => Number(p?.total_ventas) >= Number(minImporte))
      .sort((a, b) => (b.total_ventas || 0) - (a.total_ventas || 0))
      .slice(0, Number(topN) || 5);

    const total = list.reduce((acc, p) => acc + (Number(p.total_ventas) || 0), 0);
    return { top: list, totalVisible: total };
  }, [tasks, topN, minImporte]);

  const baseAvatar = config?.API_IMG?.AVATAR_EMPL || "";

  return (
    <Card className="ranking-card">
      <Card.Body>
        <h2 className="ranking-title mb-3">
          {title}
        </h2>

        <Row>
          <Col lg={12}>
            <Table className="table-centered mb-0 fs-4" hover responsive>
              <thead className="bg-primary">
                <tr>
                  <th className="text-white p-1 fs-3">ID</th>
                  <th className="text-white p-1 fs-3" style={{ width: 250 }}>
                    IMAGEN
                  </th>
                  <th className="text-white p-1 fs-3">ASESOR</th>
                  <th className="text-white p-1">
                    <SymbolSoles numero="" isbottom={false} />
                  </th>
                  <th className="text-white p-1"></th>
                  <th className="text-white p-1 fs-3">%</th>
                </tr>
              </thead>

              <tbody>
                {top.map((p, idx) => {
                  const keyFirst = firstToken(p.asesor);
                  let raw = p?.avatar || avatarByAdvisor?.[keyFirst] || "";
                  if (raw === "null" || raw === "undefined") raw = "";

                  const avatarSrc = raw
                    ? /^https?:\/\//i.test(raw)
                      ? raw
                      : `${baseAvatar}${raw}`
                    : sinAvatar;

                  const porcentaje =
                    totalVisible > 0 ? (Number(p.total_ventas || 0) / totalVisible) * 100 : 0;

                  return (
                    <tr key={`ASESOR-${idx}-${keyFirst}`}>
                      <td style={{ width: 25 }}>{idx + 1}</td>

                      <td className="rank-img-cell">
                        <div className="img-cap">
                          {idx === 0 && (
                            <div className="copa-champions" title="Primer lugar 🏆">
                              <img src="/copa_1_lugar.jpg" alt="Copa Champions" />
                            </div>
                          )}
                          <img className="avatar" src={avatarSrc} alt={p.asesor || "-"} />
                        </div>
                      </td>

                      <td className="fw-bold w-25">{p.asesor || "-"}</td>

                      <td style={{ width: 25 }}>
                        <NumberFormatMoney amount={p.total_ventas || 0} symbol="S/" />
                      </td>

                      <td>
                        <ProgressBar
                          animated
                          now={porcentaje}
                          className="progress-sm"
                          style={{ backgroundColor: "#00000042", height: 15, width: "100%" }}
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
