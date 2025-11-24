import { Dialog } from 'primereact/dialog'
import React from 'react'

export const ModalIframe = ({url, show, onHide}) => {
  return (
    <Dialog
      header="Vista del contrato"
      visible={show}
      onHide={onHide}
      modal
      style={{ width: "100rem", height: "100rem", maxWidth: "100rem" }}
      contentStyle={{ padding: 0, height: "100%" }} // importante
    >
            {url}
      {url ? (
        <div style={{ width: "100%", height: "100%" }}>
          <iframe
            src={url}
            title="Contrato proveedor"
            style={{
              width: "100%",
              height: "100%",
              border: "none",
            }}
          />
        </div>
      ) : (
        <div style={{ padding: "1rem" }}>No hay archivo para mostrar.</div>
      )}
    </Dialog>
  )
}
