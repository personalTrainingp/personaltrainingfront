import { Dialog } from 'primereact/dialog';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { useTerminologiaStore } from '../useTerminologiaStore';

export const ModalCustomTermSistema = ({ show, onHide, entidad, grupo, id = 0, label = '' }) => {
  const [labelParam, setLabelParam] = useState(label?.trim() ?? '');
  const { registrarTerminologiaxEntidadyGrupo 
    , actualizarTerminologia
  } = useTerminologiaStore();

  // Sincroniza el input al abrir/cambiar label
  useEffect(() => {
    if (show) setLabelParam(label?.trim() ?? '');
  }, [show, label]);

  const onSubmit = (e) => {
    e.preventDefault();
    const value = labelParam.trim();
    if (!value) return; // opcional: mostrar toast/feedback

    if (id === 0) {
      // Crear
      registrarTerminologiaxEntidadyGrupo({ label_param: value }, entidad, grupo);
    } else {
      // Editar (ajusta según tu store):
      // actualizarTerminologia({ id, label_param: value, entidad, grupo });
    }
    onHide?.();
  };

  return (
    <Dialog
      header={id === 0 ? 'AGREGAR TÉRMINO' : 'EDITAR TÉRMINO'}
      visible={show}
      onHide={onHide}
      style={{ width: '32rem', maxWidth: '95vw' }}
      draggable={false}
    >
      <form onSubmit={onSubmit}>
        <input
          className="form-control mb-3"
          name="label_param"
          value={labelParam}
          onChange={(e) => setLabelParam(e.target.value)}
          type="text"
          placeholder="Ingrese el término"
          autoFocus
        />
        <div className="flex gap-2 justify-end">
          <Button type="button" label="Cancelar" severity="secondary" onClick={onHide} />
          <Button
            type="submit"
            label={id === 0 ? 'Agregar' : 'Guardar'}
            disabled={!labelParam.trim()}
          />
        </div>
      </form>
    </Dialog>
  );
};
