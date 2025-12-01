import { PageBreadcrumb } from "@/components"
import { FechaRange } from "@/components/RangeCalendars/FechaRange"
import { Col, Row } from "react-bootstrap"
import { useSelector } from "react-redux";

export const App = () => {
  const { RANGE_DATE } = useSelector(e => e.DATA);
  return (
    <div>
        <PageBreadcrumb title={'TOTAL DE VENTAS'}/>
        <FechaRange rangoFechas={RANGE_DATE} />
        <Row>
            <Col>
                
            </Col>
        </Row>
    </div>
  )
}
