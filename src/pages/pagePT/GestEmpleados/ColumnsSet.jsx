import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { buscarDistrito, cellStatusColumn } from '@/common/helpers/cellsColumnsModific';

/* product column render */
const ProductColumn = ({ row }) => {
  const rating = row.original.rating;
  const emptyStars = rating < 5 ? 5 - rating : 0;
  return (
    <>
      <img
        src={row.original.image}
        alt={row.original.name}
        title={row.original.name}
        className="rounded me-3"
        height="48"
      />
      <p className="m-0 d-inline-block align-middle font-16">
        <Link to="/apps/ecommerce/details" className="text-body">
          {row.original.name}
        </Link>
        <br />
        {[...Array(rating)].map((x, index) => (
          <span key={index.toString()} className="text-warning mdi mdi-star"></span>
        ))}
        {[...Array(emptyStars)].map((x, index) => (
          <span
            key={index.toString()}
            className="text-warning mdi mdi-star-outline"
          ></span>
        ))}
      </p>
    </>
  );
};

/* status column render */
const StatusColumn = ({ row }) => {
  console.log(row.original.url);
  return (
    <img src={row.original.url}
    width={50}
    height={50}
    >
    </img>
  );
};

/* action column render */
const ActionColumn = ({row}) => {
  return (
    <>
      <Link to={`/perfil-colaborador/${row.original.uid}`} className="action-icon" style={{fontSize: '14px', color: 'blue', textDecoration: 'underline'}}>
        Ver Perfil
      </Link>
    </>
  );
};

// get all columns
const columns = [
  {
    Header: 'Id',
    accessor: 'id_empl',
    defaultCanSort: true,
  },
  {
    Header: 'Nombres y apellidos',
    accessor: 'nombres_apellidos_empl',
    defaultCanSort: true,
  },
  {
    Header: 'Distrito',
    accessor: 'ubigeo_distrito',
    defaultCanSort: true,
    Cell: buscarDistrito
  },
  {
    Header: 'Email',
    accessor: 'email_empl',
    defaultCanSort: true,
  },
  {
    Header: 'Telefono',
    accessor: 'telefono_empl',
    defaultCanSort: true,
  },
  {
    Header: 'Status',
    accessor: 'estado_empl',
    defaultCanSort: true,
    Cell: cellStatusColumn
  },
  {
    Header: 'Action',
    accessor: 'uid',
    defaultCanSort: false,
    Cell: ActionColumn,
  },
];

// get pagelist to display
const sizePerPageList = [
  {
    text: '5',
    value: 5,
  },
  {
    text: '10',
    value: 10,
  },
  {
    text: '20',
    value: 20,
  },
  // {
  //   text: 'All',
  //   value: products.length,
  // },
];

export { columns, sizePerPageList };
