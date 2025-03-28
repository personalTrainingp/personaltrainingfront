


<>
{
    showLoading&&
    <Modal size='sm' show={showLoading}>
        <Modal.Body>
        <div className='d-flex flex-column align-items-center justify-content-center text-center' style={{height: '15vh'}}>
                <span className="loader-box2"></span>
                <br/>
                <p className='fw-bold font-16'>
                    Si demora mucho, comprobar su conexion a internet
                </p>
        </div>
        </Modal.Body>
    </Modal> 
}
{
    !isLoading?(
        <>
        <div>
            <Button label="AGREGAR NUEVO" severity="success" raised onClick={onOpenModalGastos} />
        </div>
        <DataTable 
            size='small' 
            className='dataTable-verticals-lines'
            value={customers} 
            paginator 
            header={header}
            rows={10} 
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50, 100, 250]} 
            dataKey="id"
            selection={selectedCustomers}
            onSelectionChange={(e) => setselectedCustomers(e.value)}
            filters={filters} 
            filterDisplay="menu" 
            globalFilterFields={['id', 'producto', 'marca', 'descripcion', 'observacion', 'cantidad', 'valor_unitario_depreciado', "valor_unitario_actual","lugar_compra_cotizacion"]} 
            emptyMessage="ARTICULOS NO ENCONTRADOS."
            showGridlines={true}
            loading={loading} 
            stripedRows
            scrollable
            onValueChange={valueFiltered}
            >
    <Column header={<span className={'font-24'}>Id</span>} field='id' filterField="id" sortable style={{ width: '1rem' }} filter body={IdBodyTemplate}/>
    <Column header={<span className={'font-24'}>FOTO</span>} style={{ width: '3rem' }} body={imagenBodyTemplate}/>
    <Column header={<span className={'font-24'}>ITEM</span>} field='producto' filterField="producto" sortable style={{ width: '3rem'}} body={ItemBodyTemplate} filter/>
    <Column header={<span className={'font-24'}>MARCA</span>} field='marca' filterField="marca" sortable style={{ width: '3rem' }} body={marcaBodyTemplate} filter/>
    {/* <Column header={<span className={'font-24'}>INVENTARIO</span>} field='marca' filterField="marca" sortable style={{ width: '3rem' }} body={marcaBodyTemplate} filter/> */}
    <Column header={<span className={'font-24'}>CANT. </span>} field='cantidad' filterField="cantidad" sortable style={{ minWidth: '5rem' }} body={cantidadBodyTemplate} />
    <Column header={<span className={'font-24'}>UBICACION</span>} field='parametro_lugar_encuentro.label_param' filterField="parametro_lugar_encuentro.label_param" style={{ minWidth: '10rem' }} sortable body={lugarBodyTemplate} filter/>
    <Column header={<div className={'font-24'} style={{width: '100px'}}>COSTO UNIT. <SymbolSoles isbottom={false}/></div>} field='valor_unitario_actual' filterField="valor_unitario_actual" style={{ minWidth: '10rem' }} sortable body={valorUnitActualBodyTemplate} filter/>
    <Column header={<div className={'font-24'} style={{width: '130px'}}>COSTO TOTAL <SymbolSoles isbottom={false}/></div>} field='valor_unitario_actual' filterField="valor_unitario_actual" style={{ minWidth: '10rem' }} sortable body={valorUnitActualBodyTemplate} filter/>
    {/* <Column header={<div className={'font-24'} style={{width: '100px'}}>COSTO UNIT. $</div>} field='valor_unitario_actual' filterField="valor_unitario_actual" style={{ minWidth: '10rem' }} sortable body={valorUnitActualDolaresBodyTemplate} filter/> */}
    <Column header={<div className={'font-24'} style={{width: '100px'}}>COSTO TOTAL $</div>} field='valor_unitario_actual' filterField="valor_unitario_actual" style={{ minWidth: '10rem' }} sortable body={valorUnitActualDolaresBodyTemplate} filter/>
    <Column header={<span className={'font-24'}>DESCRIPCION</span>} field='descripcion' filterField="descripcion" style={{ minWidth: '10rem' }} sortable body={descripcionBodyTemplate} filter/>
    {/* <Column header={<span className={'font-24'}>OBSERVACION</span>}field='observacion' filterField='observacion' style={{ minWidth: '10rem' }} sortable body={observacionBodyTemplate} filter/> */}
    <Column header="" filterField="id" style={{ minWidth: '10rem' }} frozen alignFrozen="right" body={actionBodyTemplate}/>
</DataTable>
<ModalInventario id_enterprice={id_enterprice} show={isOpenModalEgresos} onShow={onOpenModalIvsG} onHide={onCloseModalIvsG} data={articulo} showToast={showToast} isLoading={isLoading}/>
<ModalImportadorData onHide={onCloseModalImportadorData} onShow={showModalImportadorData}/>
</>
    )
    :(
        //Array.from({ length: 10 }, (v, i) => i)
        <DataTable size='large' 
        value={Array.from({ length: 10 }, (v, i) => i)} 
        className="p-datatable-striped"
        >
            <Column header="Id" style={{ width: '1rem' }}/>
            <Column header="PRODUCTO" style={{ width: '3rem' }} body={<Skeleton/>} />
            <Column header="MARCA" style={{ width: '3rem' }} body={<Skeleton/>} />
            <Column header="DESCRIPCION" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
            <Column header="OBSERVACIONES" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
            <Column header="CANTIDAD" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
            <Column header="VALOR UNITARIO DEPRECIADO" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
            <Column header="LUGAR DE COMPRA O COTIZACION" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
            <Column header="VALOR TOTAL" style={{ minWidth: '10rem' }} body={<Skeleton/>}/>
        </DataTable>
    )
}

</>