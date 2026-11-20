import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useState } from 'react';
import { Form } from 'react-bootstrap';
import { ModalPerfilAuthUsuario } from './ModalPerfilAuthUsuario';
import { useUsuarioStore } from '@/hooks/hookApi/useUsuarioStore';

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

/* estado: switch para activar / desactivar el usuario (un inactivo no puede iniciar sesion) */
const EstadoColumn = ({ row }) => {
  const { cambiarEstadoUsuarioAuth } = useUsuarioStore();
  const [guardando, setguardando] = useState(false);
  const [error, seterror] = useState(null);
  const activo = Boolean(row.estado);
  const onCambiar = async () => {
    setguardando(true);
    seterror(null);
    const { ok, msg } = await cambiarEstadoUsuarioAuth(row.id, !activo);
    if (!ok) seterror(msg);
    setguardando(false);
  };
  return (
    <div className="d-flex align-items-center gap-2">
      <Form.Check
        type="switch"
        id={`estado-usuario-${row.id}`}
        checked={activo}
        disabled={guardando}
        onChange={onCambiar}
        title={activo ? 'Desactivar usuario' : 'Activar usuario'}
      />
      <span className={`badge ${activo ? 'bg-success' : 'bg-danger'}`}>{guardando ? '...' : activo ? 'Activo' : 'Inactivo'}</span>
      {error && <small className="text-danger">{error}</small>}
    </div>
  );
};

/* action column render */
const ActionColumn = ({ row }) => {
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
      <ModalPerfilAuthUsuario usuario={row} onHide={onModalClosePerfil} show={modalOpenPerfil}/>
    </>
  );
};

// get all columns
const columns = [
  { id: 'nombres_apellidos_user', header: 'Usuario', accessor: 'nombres_apellidos_user', sortable: true },
  { id: 'email_user', header: 'Email', accessor: 'email_user', sortable: true },
  { id: 'usuario_user', header: 'Usuarios', accessor: 'usuario_user', sortable: true },
  {
    id: 'estado',
    header: 'Estado',
    accessor: 'estado',
    sortable: true,
    render: (row) => <EstadoColumn row={row} />,
  },
  {
    id: 'id',
    header: '',
    render: (row) => <ActionColumn row={row} />,
  },
];

export { columns };
