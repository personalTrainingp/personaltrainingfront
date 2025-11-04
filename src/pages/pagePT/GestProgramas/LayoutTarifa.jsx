// import { Table } from "@/components";
import { columns, sizePerPageList } from "./ColumnSetTarifa";
import { Button } from "react-bootstrap";
import { ModalTarifa } from "./ModalTarifa";
import { useState } from "react";
import { DataTableCR } from "@/components/DataView/DataTableCR";

export const LayoutTarifa = ({id_st, data}) => {
    console.log(data);
    const [isModalTarifaOpen, setIsModalTarifaOpen] = useState(false)
  return (
    <>
        {/* <Table
            columns={columns}
            data={data}
            pageSize={10}
            sizePerPageList={sizePerPageList}
            isSortable={true}
            pagination={true}
            isSearchable={true}
            tableClass="table-striped"
            searchBoxClass="mt-2 mb-3"
        /> */}
        <Button onClick={()=>setIsModalTarifaOpen(true)}>Agregar tarifa</Button>
        <DataTableCR
            columns={columns}
            customStyles={customStyles}
            data={data}
            dense={true}
            noDataComponent={<p>Sin tarifas</p>}
        />
        <ModalTarifa onHide={()=>setIsModalTarifaOpen(false)} show={isModalTarifaOpen}/>
    </>
  )
}
const customStyles = {
    table: {
      fontSize: '25px',
    },
  };