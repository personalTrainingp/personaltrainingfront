import { Link } from 'react-router-dom';
import classNames from 'classnames';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { Dropdown } from 'react-bootstrap';
import { DateMask, FormatoDateMask, MoneyFormatter } from '@/components/CurrencyMask';
import { ModalRegisterMetaAsesor } from './ModalRegisterMetaAsesor';

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
  const [ModalmetaAsesor, setModalmetaAsesor] = useState(false)
  const onOpenModalProv = ()=>{
    setisModalOpenProv(true)
    obtenerProveedor(row.original.id_meta)
  }
  const onModalOpenmetaAsesor=()=>{
    setModalmetaAsesor(true)
  }
  const onModalClosemetaAsesor = () =>{
    setModalmetaAsesor(false)
  }
  return (
    <>
    <Dropdown>
      <Dropdown.Toggle  to="" className="arrow-none card-drop" style={{backgroundColor: 'transparent', border: 'none', boxShadow: 'none'}}>
        
      <i className={classNames('mdi mdi-dots-vertical')} />
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item onClick={onModalOpenmetaAsesor}>Registrar Meta del asesor</Dropdown.Item>
        <Dropdown.Item href="#/action-2">Editar Meta</Dropdown.Item>
        <Dropdown.Item href="#/action-3">Metas de asesores</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
    <ModalRegisterMetaAsesor show={ModalmetaAsesor} onHide={onModalClosemetaAsesor} id_meta={row.original.id_meta} meta={row.original.meta}/>
    </>
  );
};
const FormatoMoney = (currencyMoney)=>{
  return <MoneyFormatter amount={currencyMoney}/>
}
// Todo: Generic's values are not provided from the library itself
// const columns: ReadonlyArray<Column<Customer>> = [
const columns = [
  {
    Header: 'Nombre de la meta',
    accessor: 'nombre_meta',
    defaultCanSort: true,
  },
  {
    Header: 'Meta',
    accessor: 'meta',
    defaultCanSort: true,
    Cell: ({row})=>{
      return FormatoMoney(row.original.meta)
    }
  },
  {
    Header: 'Bono',
    accessor: 'bono',
    defaultCanSort: true,
    Cell: ({row})=>{
      return FormatoMoney(row.original.bono)
    }
  },
  {
    Header: 'Fecha de inicio',
    accessor: 'fec_inicio',
    defaultCanSort: true,
    Cell:({row})=>{
      return FormatoDateMask(row.original.fec_inicio, 'D [de] MMMM [del] YYYY')
    }
  },
  {
    Header: 'Fecha final',
    accessor: 'fec_fin',
    defaultCanSort: true,
    Cell:({row})=>{
      return FormatoDateMask(row.original.fec_fin, 'D [de] MMMM [del] YYYY')
    }
  },
  {
    Header: 'estado',
    accessor: 'status_meta',
    defaultCanSort: true,
  },
  {
    Header: 'Action',
    accessor: 'id_meta',
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
