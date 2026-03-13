import { Row, Col, Form, Button } from "react-bootstrap";
import { AsyncPaginate } from 'react-select-async-paginate';
import { useHistoryDateFilterLogic } from "./hooks/useHistoryDateFilterLogic";
import 'bootstrap-icons/font/bootstrap-icons.css';

const defaultAdditional = { page: 1 };

export function HistoryDateFilter(props) {
    const {
        year,
        selectedMonth,
        initDay,
        cutDay,
        setInitDay,
        setCutDay,
        selectedClient,
        setSelectedClient,
        loadOptions,
        onSearch
    } = props;

    const {
        MESES,
        YEARS,
        CURRENT_YEAR,
        currentMonthIdx,
        handleYearChange,
        handleMonthChange
    } = useHistoryDateFilterLogic(props);

    return (
        <Form>
            <Row className="g-2 align-items-end">
                {/* AÑO */}
                <Col xs={6} md={2}>
                    <Form.Label className="fw-bold small text-muted mb-1">AÑO</Form.Label>
                    <Form.Select
                        value={year}
                        onChange={(e) => handleYearChange(parseInt(e.target.value, 10))}
                        className="fw-bold"
                        disabled={!!selectedClient}
                    >
                        {YEARS.map((y) => (
                            <option key={y} value={y}>{y}</option>
                        ))}
                    </Form.Select>
                </Col>

                {/* MES */}
                <Col xs={6} md={2}>
                    <Form.Label className="fw-bold small text-muted mb-1">MES</Form.Label>
                    <Form.Select
                        value={selectedMonth}
                        onChange={(e) => handleMonthChange(parseInt(e.target.value, 10))}
                        className="fw-bold text-uppercase"
                        disabled={!!selectedClient}
                    >
                        {MESES.map((mes, idx) => (
                            <option
                                key={idx + 1}
                                value={idx + 1}
                                disabled={year === CURRENT_YEAR && idx + 1 > currentMonthIdx}
                            >
                                {mes}
                            </option>
                        ))}
                    </Form.Select>
                </Col>

                {/* DÍA INICIO */}
                <Col xs={6} md={1}>
                    <Form.Label className="fw-bold small text-muted mb-1">DESDE</Form.Label>
                    <Form.Select
                        value={initDay}
                        onChange={(e) => setInitDay && setInitDay(parseInt(e.target.value, 10))}
                        disabled={!!selectedClient}
                    >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </Form.Select>
                </Col>

                {/* DÍA FIN */}
                <Col xs={6} md={1}>
                    <Form.Label className="fw-bold small text-muted mb-1">HASTA</Form.Label>
                    <Form.Select
                        value={cutDay}
                        onChange={(e) => setCutDay && setCutDay(parseInt(e.target.value, 10))}
                        disabled={!!selectedClient}
                    >
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((n) => (
                            <option key={n} value={n}>{n}</option>
                        ))}
                    </Form.Select>
                </Col>

                {/* CLIENTE FILTER */}
                <Col xs={12} md={4}>
                    <Form.Label className="fw-bold small text-muted mb-1 text-uppercase">
                        <i className="bi bi-person-check me-1"></i> SOCIO
                    </Form.Label>
                    <AsyncPaginate
                        value={selectedClient}
                        onChange={setSelectedClient}
                        loadOptions={loadOptions}
                        additional={defaultAdditional}
                        placeholder="Buscar cliente..."
                        classNamePrefix="react-select"
                        debounceTimeout={300}
                        noOptionsMessage={() => "Sin historial"}
                        isClearable
                    />
                </Col>

                {/* BOTÓN */}
                <Col xs={12} md={2} className="d-grid">
                    <div style={{ marginTop: '23px' }}>
                        {onSearch && (
                            <Button variant="primary" onClick={onSearch} className="fw-bold text-uppercase w-100">
                                <i className="bi bi-search"></i> Consultar
                            </Button>
                        )}
                    </div>
                </Col>
            </Row>
        </Form>
    );
}