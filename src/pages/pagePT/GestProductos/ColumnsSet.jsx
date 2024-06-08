import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { useProductoStore } from '@/hooks/hookApi/useProductoStore';
import { Button, Card, CardHeader, CardTitle, Modal } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { useForm } from '@/hooks/useForm';
import { CurrencyMask } from '@/components/CurrencyMask';
import { cellStatusColumn } from '@/common/helpers/cellsColumnsModific';

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
  const asdf = 'asdf'
  return (
    <h4>
      <span
      className ={parseInt(row.original.stock.split(' ')[0]) ==0?'badge badge-outline-danger': 'badge text-black'}
      >
        {parseInt(row.original.stock.split(' ')[0])===0?'Agotado' : row.original.stock}
      </span>
    </h4>
  );
};
/* action column render */

const ActionColumn = (parametrosValues) => {
  const dispatch = useDispatch()
  return (
    <>
      <Link to="" className="action-icon">
        <i className="mdi mdi-square-edit-outline"></i>
      </Link>
      <Link to="" className="action-icon">
        <i className="mdi mdi-delete"></i>
      </Link>
    </>
  );
};

// Todo: Generic's values are not provided from the library itself
// const columns: ReadonlyArray<Column<Customer>> = [
const columns = [
  {
    Header: 'Nombre del producto',
    accessor: 'nombre_producto',
    defaultCanSort: true,
  },
  {
    Header: 'Stock',
    accessor: 'stock_producto',
    defaultCanSort: true,
  },
  {
    Header: 'Pventa',
    accessor: 'prec_venta',
    defaultCanSort: true,
  },
  {
    Header: 'Pcompra',
    accessor: 'prec_compra',
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
