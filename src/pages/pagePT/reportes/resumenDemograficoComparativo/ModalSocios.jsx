import { SymbolSoles } from '@/components/componentesReutilizables/SymbolSoles';
import { NumberFormatMoney } from '@/components/CurrencyMask';
import { arrayEstadoCivil, arrayOrigenDeCliente, arraySexo } from '@/types/type';
import { Dialog } from 'primereact/dialog'
import { TabPanel, TabView } from 'primereact/tabview';
import React from 'react'
import { Table } from 'react-bootstrap';

function agrupadoDistrito(data) {
    
    const groupedByDistrito = data.reduce((acc, item) => {
        // Busca si ya existe un grupo con el mismo labelDistrito
        let group = acc.find(group => group.labelDistrito === item.labelDistrito);
        
        if (!group) {
        // Si no existe, crea uno nuevo con tarifa_total inicializada a 0
        group = { labelDistrito: item.labelDistrito, tarifa_total: 0, items: [] };
        acc.push(group);
        }
        
        // Suma la tarifa_monto al tarifa_total del grupo (asegurándose de convertir a número)
        group.tarifa_total += parseFloat(item.tarifa_monto);
        
        // Agrega el elemento actual al grupo correspondiente
        group.items.push(item);
        
        return acc;
    }, []);
    
    // Formatea tarifa_total como string si es necesario
    groupedByDistrito.forEach(group => {
        group.tarifa_total = group.tarifa_total.toFixed(2); // Opcional, para formato decimal
    });
      return groupedByDistrito.sort((a,b)=>b.items.length-a.items.length);
}
function agrupadoProc(data) {
    
    const groupedByProc = data.reduce((acc, item) => {
        // Busca si ya existe un grupo con el mismo labelDistrito
        let group = acc.find(group => group.labelOrigen === item.labelOrigen);
        
        if (!group) {
        // Si no existe, crea uno nuevo con tarifa_total inicializada a 0
        group = { labelOrigen: item.labelOrigen, tarifa_total: 0, items: [] };
        acc.push(group);
        }
        
        // Suma la tarifa_monto al tarifa_total del grupo (asegurándose de convertir a número)
        group.tarifa_total += parseFloat(item.tarifa_monto);
        
        // Agrega el elemento actual al grupo correspondiente
        group.items.push(item);
        
        return acc;
    }, []);
    
    // Formatea tarifa_total como string si es necesario
    groupedByProc.forEach(group => {
        group.tarifa_total = group.tarifa_total.toFixed(2); // Opcional, para formato decimal
    });
      return groupedByProc.sort((a,b)=>b.items.length-a.items.length);
}

function agrupadoEstCivil(data) {
    
}


function agrupadoSexo(data) {
    const groupedByProc = data.reduce((acc, item) => {
        // Busca si ya existe un grupo con el mismo labelDistrito
        let group = acc.find(group => group.labelSexo === item.labelSexo);
        
        if (!group) {
        // Si no existe, crea uno nuevo con tarifa_total inicializada a 0
        group = { labelSexo: item.labelSexo, tarifa_total: 0, items: [] };
        acc.push(group);
        }
        
        // Suma la tarifa_monto al tarifa_total del grupo (asegurándose de convertir a número)
        group.tarifa_total += parseFloat(item.tarifa_monto);
        
        // Agrega el elemento actual al grupo correspondiente
        group.items.push(item);
        
        return acc;
    }, []);
    
    // Formatea tarifa_total como string si es necesario
    groupedByProc.forEach(group => {
        group.tarifa_total = group.tarifa_total.toFixed(2); // Opcional, para formato decimal
    });
      return groupedByProc.sort((a,b)=>b.items.length-a.items.length);
}
export const ModalSocios = ({show, onHide, data, clickDataLabel}) => {
    console.log(data);
    const ProcData = data?.map(g=>{
        const tb_ventum = g.tb_ventum
        const tb_cliente = g.tb_ventum.tb_cliente
        const nombres_apellidos_cli = `${tb_cliente?.nombre_cli} ${tb_cliente?.apPaterno_cli} ${tb_cliente?.apMaterno_cli}`
        const estCivil_cli = tb_cliente.estCivil_cli;
        const sexo_cli=tb_cliente.sexo_cli;
        const origen = tb_ventum.id_origen
        const labelDistrito = tb_cliente.tb_distrito.distrito
        const labelEstCivil = arrayEstadoCivil.find(f=>f.value === estCivil_cli)?.label
        const labelOrigen = arrayOrigenDeCliente.find(f=>f.value === origen)?.label
        const labelSexo = arraySexo.find(f=>f.value === sexo_cli)?.label
        return {
            nombres_apellidos_cli,
            tarifa_monto: g.tarifa_monto,
            labelDistrito,
            labelEstCivil,
            labelOrigen,
            labelSexo
        }
    })
    
  return (
    <Dialog style={{width: '70rem'}} visible={show} onHide={onHide} header={`${clickDataLabel}`}>
        <TabView>
            <TabPanel header={'PROCEDENCIA'}>
                <Table
                    striped
                    className="table-centered mb-0"
                    >
                    <thead className='bg-primary'>
                        <tr>
                            <th className='text-white p-1 fs-3'>Procedencia</th>
                            <th className='text-white p-1 fs-3'>SOCIOS</th>
                            <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'><SymbolSoles numero={''} isbottom={false}/></div></th>
                            <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>Ticket medio</div></th>
                            {/* <th className='text-white p-1 fs-3'>%</th> */}
                            {/* <th className='text-white p-1 fs-3'><div className=''>TICKET M.</div></th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            agrupadoProc(ProcData).map(d=>(
                                <tr>
                                    <td className='fs-2'>{d.labelOrigen}</td>
                                    <td className='fs-2'>{d.items.length}</td>
                                    <td className='fs-2'><span className='d-flex justify-content-end'><NumberFormatMoney amount={d.tarifa_total}/></span></td>
                                    <td className='fs-2'><span className='d-flex justify-content-end'><NumberFormatMoney amount={d.tarifa_total/d.items.length}/></span></td>
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </TabPanel>
            <TabPanel header={'SEXO'}>
            <Table
                    striped
                    className="table-centered mb-0"
                    >
                    <thead className='bg-primary'>
                        <tr>
                            <th className='text-white p-1 fs-3'>Sexo</th>
                            <th className='text-white p-1 fs-3'>SOCIOS</th>
                            <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'><SymbolSoles numero={''} isbottom={false}/></div></th>
                            <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>Ticket medio</div></th>
                            {/* <th className='text-white p-1 fs-3'>%</th> */}
                            {/* <th className='text-white p-1 fs-3'><div className=''>TICKET M.</div></th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            agrupadoSexo(ProcData).map(d=>(
                                <tr>
                                    <td className='fs-2'>{d.labelSexo}</td>
                                    <td className='fs-2'>{d.items.length}</td>
                                    <td className='fs-2'><span className='d-flex justify-content-end'><NumberFormatMoney amount={d.tarifa_total}/></span></td>
                                    <td className='fs-2'><span className='d-flex justify-content-end'><NumberFormatMoney amount={d.tarifa_total/d.items.length}/></span></td>
                                    {/* <td>{((agrupadoDistrito(ProcData).length/d.items.length)*100).toFixed(2)}</td> */}
                                    {/* <td><NumberFormatMoney amount={((d.tarifa_total/d.items.length))}/></td> */}
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </TabPanel>
            <TabPanel header={'DISTRITO'}>
            <Table
                    striped
                    className="table-centered mb-0"
                    >
                    <thead className='bg-primary'>
                        <tr>
                            <th className='text-white p-1 fs-2'>Distrito</th>
                            <th className='text-white p-1 fs-2'>SOCIOS</th>
                            <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'><SymbolSoles numero={''} isbottom={false}/></div></th>
                            <th className='text-white p-1 fs-3'><div className='d-flex justify-content-center'>Ticket medio</div></th>
                            {/* <th className='text-white p-1 fs-3'>%</th> */}
                            {/* <th className='text-white p-1 fs-3'><div className=''>TICKET M.</div></th> */}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            agrupadoDistrito(ProcData).map(d=>(
                                <tr>
                                    <td className='fs-2'>{d.labelDistrito}</td>
                                    <td className='fs-2'>{d.items.length}</td>
                                    <td className='fs-2'><span className='d-flex justify-content-end'><NumberFormatMoney amount={d.tarifa_total}/></span></td>
                                    <td className='fs-2'><span className='d-flex justify-content-end'><NumberFormatMoney amount={d.tarifa_total/d.items.length}/></span></td>
                                    {/* <td>{((agrupadoDistrito(ProcData).length/d.items.length)*100).toFixed(2)}</td> */}
                                    {/* <td><NumberFormatMoney amount={((d.tarifa_total/d.items.length))}/></td> */}
                                </tr>
                            ))
                        }
                    </tbody>
                </Table>
            </TabPanel>
        </TabView>
    </Dialog>
  )
}
