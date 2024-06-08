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

const ActionColumn = ({row}) => {
  const dispatch = useDispatch()
  console.log(row);
  return (
    <>
      <Link to={`/programa/${row.original.uid}`} className="action-icon" style={{fontSize: '14px', color: 'blue', textDecoration: 'underline'}}>
        Ver mas
      </Link>
    </>
  );
};

// Todo: Generic's values are not provided from the library itself
// const columns: ReadonlyArray<Column<Customer>> = [
const columns = [
  {
    Header: 'Nombre del programa',
    accessor: 'name_pgm',
    defaultCanSort: true,
  },
  {
    Header: 'descripcion del programa',
    accessor: 'desc_pgm',
    defaultCanSort: true,
  },
  {
    Header: 'Siglas',
    accessor: 'sigla_pgm',
    defaultCanSort: true,
  },
  {
    Header: 'Estado',
    accessor: 'estado_pgm',
    defaultCanSort: true,
  },
  {
    Header: '',
    accessor: 'uid',
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
