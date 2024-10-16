import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";




const ActionColumn = ({row}) => {
    const dispatch = useDispatch()
    return (
      <>
        <Link to="" className="action-icon">
            <i className="mdi mdi-square-edit-outline font-17"></i>
        </Link>
        <Link to="" className="action-icon">
            <i className="mdi mdi-delete font-17"></i>
        </Link>
      </>
    );
  };
  
const columns = [
{
    name: 'Nombre de la Tarifa',
    selector: row => row.nombreTarifa_tt,
    defaultCanSort: true,
},
{
    name: 'descripcion de la tarifa',
    selector: row => row.descripcionTarifa_tt,
    defaultCanSort: true,
},
{
    name: 'Tarifa',
    selector: row => row.tarifaCash_tt,
    defaultCanSort: true,
},
{
    name: 'Estado',
    selector: row => row.estado_pgm,
    defaultCanSort: true,
},
{
    name: '',
    accessor: 'id_tt',
    defaultCanSort: false,
    cell: ActionColumn,
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