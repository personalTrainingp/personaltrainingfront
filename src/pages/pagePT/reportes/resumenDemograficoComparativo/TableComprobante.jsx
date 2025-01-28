// import { arrayFacturas } from '@/types/type';
// import React from 'react'
// import { Table } from 'react-bootstrap'
// const groupByIdCli = (data) => {
//     return data.reduce((acc, item) => {
//       const existingGroup = acc.find(group => group.id_cli === item.id_cli);
//       if (existingGroup) {
//         existingGroup.items.push(item);
//       } else {
//         acc.push({ id_cli: item.id_cli, items: [item] });
//       }
//       return acc;
//     }, []);
//   };
// export const TableComprobante = ({dataGroup}) => {
//     console.log(dataGroup, "com");
    
//   return (
//     <div>
//         TRASPASO
//     </div>
//   )
// }

// {
//     dataGroup?.map(c=>{
//         const labelsComprobantes = c.comprobantes.map(id => {
//             const match = arrayFacturas.find(item => item.value === id);
//             return {
//                 comprobante: match ? (match.value==701 ? 'TRASPASO':'VENTA' ) : 'INDEFINIDO'
//             };
//           });
//         //   console.log(labelsComprobantes.map(f=>f.comprobante).join('|'));
//           console.log((c.items), 'items');
          
//         return(
//     <tr>
//         <td className='p-1 fs-2 text-primary'>
//             {labelsComprobantes.map(f=>f.comprobante).join(' | ')}
//                 </td>
//         <td className='p-1 fs-2 text-primary'>{groupByIdCli(c.items).length}</td>
//     </tr>
//     )
//     }
// )
// }