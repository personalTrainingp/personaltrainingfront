import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { products } from './data';
import { useState } from 'react';
import { ModalPerfilAuthUsuario } from './ModalPerfilAuthUsuario';

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
  return (
    <span
      className={classNames('badge', {
        'bg-success': row.original.status,
        'bg-danger': !row.original.status,
      })}
    >
      {row.original.status ? 'Active' : 'Deactivated'}
    </span>
  );
};

/* action column render */
const ActionColumn = () => {
  const [modalOpenPerfil, setmodalOpenPerfil] = useState(false)
  const onModalOpenPerfil = ()=>{
    setmodalOpenPerfil(true)
  }
  const onModalClosePerfil = ()=>{
    setmodalOpenPerfil(false)
  }
  return (
    <>
      <span style={{cursor: 'pointer'}} onClick={onModalOpenPerfil} className="fs-6 bg-primary px-2 py-1 rounded rounded-5 text-white fw-bold">
        Ver Perfil
      </span>
      <ModalPerfilAuthUsuario onHide={onModalClosePerfil} show={modalOpenPerfil}/>
    </>
  );
};

// get all columns
const columns = [
  {
    Header: 'Usuario',
    accessor: 'nombres_apellidos_user',
    defaultCanSort: true
  },
  {
    Header: 'Email',
    accessor: 'email_user',
    defaultCanSort: true,
  },
  {
    Header: 'Usuarios',
    accessor: 'usuario_user',
    defaultCanSort: true,
  },
  {
    Header: 'Estado',
    accessor: 'estado',
    defaultCanSort: true,
  },
  {
    Header: '',
    accessor: 'id',
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
  {
    text: 'All',
    value: products.length,
  },
];

export { columns, sizePerPageList };
