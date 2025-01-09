import React from 'react'
import { Table } from 'react-bootstrap'

export const TableFechasComparativas = () => {
  return (
    <div style={{ overflowX: "auto", maxWidth: "100%" }}>
      <Table className='table-frozen-col-1' striped bordered>
        <thead>
          <tr>
            <th rowSpan={2} className="sticky-col"></th>
            <th colSpan={2} className='m-0 p-0 text-center'>
                <div className='bg-primary'>
                    1 DE SEPTIEMBRE DEL 2024
                    <br/>
                    HASTA
                    <br/>
                    6 DE SEPTIEMBRE DEL 2024
                </div>
            </th>
            <th colSpan={2} className='m-0 p-0 text-center'>
                <div className='bg-primary'>
                    1 DE OCTUBRE DEL 2024
                    <br/>
                    HASTA
                    <br/>
                    20 DE OCTUBRE DEL 2024
                </div>
            </th>
            <th colSpan={2} className='m-0 p-0 text-center'>
                <div className='bg-primary'>
                    1 DE NOVIEMBRE DEL 2024
                    <br/>
                    HASTA
                    <br/>
                    20 DE NOVIEMBRE DEL 2024
                </div>
            </th>
            <th colSpan={2} className='m-0 p-0 text-center'>
                <div className='bg-primary'>
                    1 DE DICIEMBRE DEL 2024
                    <br/>
                    HASTA
                    <br/>
                    20 DE DICIEMBRE DEL 2024
                </div>
            </th>
          </tr>
        </thead>
        <tbody>
            <tr>
                <th className='m-0 p-0'> <div className='bg-primary'></div> </th>
                <th className='m-0 p-0'> <div className='bg-primary'>CANT.</div> </th>
                <th className='m-0 p-0'> <div className='bg-primary'>%</div> </th>
                <th className='m-0 p-0'> <div className='bg-primary'>CANT</div></th>
                <th className='m-0 p-0'> <div className='bg-primary'>%</div></th>
                <th className='m-0 p-0'> <div className='bg-primary'>CANT</div></th>
                <th className='m-0 p-0'> <div className='bg-primary'>%</div></th>
                <th className='m-0 p-0'> <div className='bg-primary'>CANT</div></th>
                <th className='m-0 p-0'> <div className='bg-primary'>%</div></th>
            </tr>
            <tr>
                <th>TOTAL DE SOCIOS</th>
                <th>3</th>
                <th>{((3-48)/3)*100}</th>
                <th>48</th>
                <th>{((48-37)/48)*100}</th>
                <th>37</th>
                <th>%</th>
                <th>24</th>
                <th>%</th>
            </tr>
            <tr>
                <th>nuevos</th>
                <th>3</th>
                <th>{((3-3)/3)*100}</th>
                <th>3</th>
                <th>%</th>
                <th>16</th>
                <th>%</th>
                <th>14</th>
                <th>%</th>
            </tr>
            <tr>
                <th>renovaciones</th>
                <th>0</th>
                <th>%</th>
                <th>0</th>
                <th>%</th>
                <th>6</th>
                <th>%</th>
                <th>4</th>
                <th>%</th>
            </tr>
            <tr>
                <th>reinscripciones</th>
                <th>0</th>
                <th>%</th>
                <th>0</th>
                <th>%</th>
                <th>2</th>
                <th>%</th>
                <th>1</th>
                <th>%</th>
            </tr>
            <tr>
                <th>traspasos</th>
                <th>0</th>
                <th>%</th>
                <th>45</th>
                <th>%</th>
                <th>13</th>
                <th>%</th>
                <th>5</th>
                <th>%</th>
            </tr>
            <tr>
                <th>venta total</th>
                <th>3,858.00</th>
                <th>%</th>
                <th>6,261.00</th>
                <th>%</th>
                <th>23,907.00</th>
                <th>%</th>
                <th>16,628.00</th>
                <th>%</th>
            </tr>
            <tr>
                <th>ticket medio</th>
                <th>1,286.00</th>
                <th>%</th>
                <th>2,087.00</th>
                <th>%</th>
                <th>996.13</th>
                <th>%</th>
                <th>875.16</th>
                <th>%</th>
            </tr>
            <tr>
                <th>total sesiones</th>
                <th>140</th>
                <th>%</th>
                <th>3,800</th>
                <th>%</th>
                <th>2,536</th>
                <th>%</th>
                <th>875.16</th>
                <th>%</th>
            </tr>
        </tbody>
      </Table>
    </div>
  )
}
