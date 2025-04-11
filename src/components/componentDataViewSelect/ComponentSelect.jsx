import React from 'react'
import CreatableSelect from 'react-select/creatable';
export const ComponentSelect = () => {
    const [opciones, setOpciones] = useState([]);
    const [seleccionadas, setSeleccionadas] = useState([]);
    const [inputValue, setInputValue] = useState('');
  
    useEffect(() => {
      // Cargar opciones existentes de la BD
      axios.get('/api/opciones') // Cambia esto según tu endpoint
        .then(res => {
          const datos = res.data.map(op => ({
            label: op.nombre,
            value: op.id,
          }));
          setOpciones(datos);
        });
    }, []);
  
    const handleCreate = (input) => {
      // Guardar nueva opción en la BD
      const nueva = { nombre: input };
  
      axios.post('/api/opciones', nueva) // Cambia a tu endpoint
        .then(res => {
          const nuevaOpcion = {
            label: res.data.nombre,
            value: res.data.id,
          };
          const nuevasOpciones = [...opciones, nuevaOpcion];
          setOpciones(nuevasOpciones);
          setSeleccionadas([...seleccionadas, nuevaOpcion]);
        });
    };
  
    return (
      <CreatableSelect
        isMulti
        value={seleccionadas}
        onChange={setSeleccionadas}
        onInputChange={(value) => setInputValue(value)}
        options={opciones}
        onCreateOption={handleCreate}
        placeholder="Buscar o agregar..."
        noOptionsMessage={() =>
          inputValue ? (
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>No encontrado</span>
              <button
                style={{
                  marginLeft: '1rem',
                  cursor: 'pointer',
                  background: '#007bff',
                  color: 'white',
                  border: 'none',
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
                onMouseDown={(e) => {
                  e.preventDefault(); // Evita que react-select cierre el menú
                  handleCreate(inputValue);
                }}
              >
                Agregar opción: "{inputValue}"
              </button>
            </div>
          ) : 'Escribe para buscar o crear'
        }
      />
    );
}
