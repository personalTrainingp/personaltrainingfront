import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { ModalProveedor } from './ModalProveedor';
import { useState } from 'react';
import { useProveedorStore } from '@/hooks/hookApi/useProveedorStore';
import { cellStatusColumn } from '@/common/helpers/cellsColumnsModific';
import { confirmDialog } from 'primereact/confirmdialog';
import { Button } from 'react-bootstrap';
/* name column render */
const NameColumn = ({ row }) => {
  return (
    <div className="table-user">
      <img src={row.original.avatar} alt="" className="me-2 rounded-circle" />
      <Link to="" className="text-body fw-semibold">
        {row.original.name}
      </Link>
    </div>
  );
};

/* status column render */
const StatusColumn = ({ row }) => {
  return (
    <span
      className={classNames('badge', {
        'badge-success-lighten': row.original.status === 'Active',
        'badge-danger-lighten': row.original.status === 'Blocked',
      })}
    >
      {row.original.status}
    </span>
  );
};
/* action column render */
const ActionColumn = ({row}) => {
  const dispatch = useDispatch()
	const [isModalOpenProv, setisModalOpenProv] = useState(false)
  const { obtenerProveedor, statusData, proveedor, EliminarProveedor } = useProveedorStore()
  const onOpenModalProv = ()=>{
    setisModalOpenProv(true)
    console.log(row.original.id);
    obtenerProveedor(row.original.id)
  }
  const onCloseModalProv = ()=>{
    setisModalOpenProv(false)
  }
  const onDeleteProveedor = ()=>{
    EliminarProveedor(row.original.id)

  }
  const confirmDeleteProveedor = () => {
    console.log("clickkk");
    confirmDialog({
        message: 'Estas seguro de querer eliminar este proveedor',
        header: 'Eliminar Proveedor',
        icon: 'pi pi-info-circle',
        defaultFocus: 'reject',
        acceptClassName: 'p-button-danger',
        accept: onDeleteProveedor,
        reject: ()=>{
          console.log("error");
        }
    });
};
  
  return (
    <>
      <Link to="" onClick={onOpenModalProv} className="action-icon">
        <i className="mdi mdi-square-edit-outline"></i>
      </Link>
      <Link to="" onClick={confirmDeleteProveedor} className="action-icon">
        <i className="mdi mdi-delete"></i>
      </Link>
      <ModalProveedor dataProv={proveedor} status={statusData} show={isModalOpenProv} onHide={onCloseModalProv}/>
    </>
  );
};

// Todo: Generic's values are not provided from the library itself
// const columns: ReadonlyArray<Column<Customer>> = [
const columns = [
  {
    Header: 'Proveedor',
    accessor: 'razon_social_prov',
    defaultCanSort: true,
  },
  {
    Header: 'RUC',
    accessor: 'ruc_prov',
    defaultCanSort: true,
  },
  {
    Header: 'Telefono',
    accessor: 'cel_prov',
    defaultCanSort: true,
  },
  {
    Header: 'Nombre del Contacto',
    accessor: 'nombre_vend_prov',
    defaultCanSort: true,
  },
  {
    Header: 'Estado',
    accessor: 'estado',
    defaultCanSort: true,
    Cell: cellStatusColumn
  },
  {
    Header: 'Action',
    accessor: 'id',
    defaultCanSort: false,
    Cell: ActionColumn,
  },
];

const sizePerPageList = [
  {
    text: '1',
    value: 10,
  },
  {
    text: '105',
    value: 25,
  },
  {
    text: '50',
    value: 50,
  },
  {
    text: '50',
    value: 50,
  },
];

export { columns, sizePerPageList };
