import React, { useMemo, useState } from "react";
import { Table, Form, Row, Col, Pagination, Button } from "react-bootstrap";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export const DataTableCR = ({
  data = [],
  columns = [],
  exportExtraColumns = [],
  
}) => {
  const [pageSize, setPageSize] = useState(10);
  const [search, setSearch] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  
  // 🔎 Filtrado
  const filteredData = useMemo(() => {
    if (!search) return data;

    const text = search.toLowerCase();

    return data.filter((row) => {
      // Buscar en toda la tabla
      if (selectedColumn === "ALL") {
        return columns.some((col) => {
          if (!col.accessor) return false;
          const value = row[col.accessor];
          return value?.toString().toLowerCase().includes(text);
        });
      }

      // Buscar por columna específica
      const value = row[selectedColumn];
      return value?.toString().toLowerCase().includes(text);
    });
  }, [search, selectedColumn, data, columns]);

  // 📄 Paginación
  const totalPages = Math.ceil(filteredData.length / pageSize);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // 📥 Exportar Excel
  const handleExport = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Reporte");

    // headers
    worksheet.columns = exportExtraColumns.map((col) => ({
      header: col.exportHeader,
      key: col.id,
      width: 20,
    }));

    // rows
    filteredData.forEach((row) => {
      const newRow = {};
      exportExtraColumns.forEach((col) => {
        newRow[col.id] = col.exportValue(row);
      });
      worksheet.addRow(newRow);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "reporte.xlsx");
  };
const getPaginationItems = () => {
  const pages = [];
  const maxVisible = 6;

  if (totalPages <= maxVisible) {
    // Mostrar todas
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Siempre mostrar primeras 5
    for (let i = 1; i <= 5; i++) {
      pages.push(i);
    }

    // Puntos suspensivos
    pages.push("...");

    // Última página
    pages.push(totalPages);
  }

  return pages;
};
  return (
    <>
    <div className="d-flex justify-content-end m-3 flex-row">
      <div>
      </div>
      <div className="d-flex align-items-end">
        <div>
          <Button onClick={handleExport} className="bg-601">Exportar Excel</Button>
        </div>
        <div>
          <Form.Select
            value={selectedColumn}
            onChange={(e) => setSelectedColumn(e.target.value)}
          >
            <option value="ALL">Toda la tabla</option>

            {columns
              .filter((col) => col.accessor)
              .map((col) => (
                <option key={col.id} value={col.accessor}>
                  {typeof col.header === "string"
                    ? col.header
                    : col.accessor}
                </option>
              ))}
          </Form.Select>
        </div>
        
        <div className="">
          <Form.Control
            placeholder="Buscar..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        <div >
          <Form.Select
          size="sm"
          style={{ width: "200px" }}
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setCurrentPage(1);
          }}
        >
          <option value={10}>10 POR PAGINA</option>
          <option value={25}>25 POR PAGINA</option>
          <option value={50}>50 POR PAGINA</option>
          <option value={100}>100 POR PAGINA</option>
        </Form.Select>
        </div>
      </div>
    </div>
      {/* 📊 TABLA */}
      <div style={{ overflowX: "auto" }}>
        <Table bordered hover striped style={{width: '100%'}}>
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.id} className="bg-change text-white" style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {paginatedData.map((row, i) => (
              <tr key={i} className="fs-3">
                {columns.map((col) => (
                  <td key={col.id}>
                    {col.render
                      ? col.render(row)
                      : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Pagination>
  <Pagination.First onClick={() => setCurrentPage(1)} />

  <Pagination.Prev
    onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
  />

  {getPaginationItems().map((item, index) => {
    if (item === "...") {
      return <Pagination.Ellipsis key={index} disabled />;
    }

    return (
      <Pagination.Item
        key={index}
        active={item === currentPage}
        onClick={() => setCurrentPage(item)}
      >
        {item}
      </Pagination.Item>
    );
  })}

  <Pagination.Next
    onClick={() =>
      setCurrentPage((p) => Math.min(p + 1, totalPages))
    }
  />
  {/* >> */}
  <Pagination.Last onClick={() => setCurrentPage(totalPages)} />
</Pagination>
ESTAS EN LA PAGINA {currentPage} de {paginatedData.length}
    </>
  );
};