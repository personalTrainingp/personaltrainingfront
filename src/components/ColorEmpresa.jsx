import { TabPanel, TabView } from 'primereact/tabview'
import React from 'react'

export const ColorEmpresa = ({childrenManicure, childrenChange, childrenCircus, childrenReducto, childrenOtrosRal, childrenRal, childrenOtros}) => {
  return (
    <TabView>
        {
            childrenManicure && (
                <TabPanel header={<div className='fs-1 text-manicure link-manicure'>MANICURE</div>}>
                {childrenManicure}
                </TabPanel>
            )
        }
        {
            childrenChange && (
                <TabPanel header={<div className='fs-1 link-change'>CHANGE</div>}>
                {childrenChange}
                </TabPanel>
            )
        }
        {
            childrenCircus && (
                <TabPanel header={<div className='fs-1 text-circus link-circus'>CIRCUS</div>}>
                {childrenCircus}
                </TabPanel>
            )
        }
        {
            childrenReducto && (
                <TabPanel header={<div className='fs-1 text-ISESAC link-isesac'>REDUCTO</div>}>
                {childrenReducto}
                </TabPanel>
            )
        }
        {
            childrenOtrosRal && (
                <TabPanel header={<div className='fs-1 link-change'>OTROS RAL</div>}>
                {childrenOtrosRal}
                </TabPanel>
            )
        }
        {
            childrenRal && (
                <TabPanel header={<div className='fs-1 link-change'>RAL</div>}>
                {childrenRal}
                </TabPanel>
            )
        }
        {
            childrenOtros && (
                <TabPanel header={<div className='fs-1 link-change'>OTROS</div>}>
                {childrenOtros}
                </TabPanel>
            )
        }
    </TabView>
  )
}
