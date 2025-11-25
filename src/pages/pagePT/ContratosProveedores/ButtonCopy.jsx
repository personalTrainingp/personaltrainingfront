import React, { useState } from 'react'

export const ButtonCopy = ({text}) => {
  const [copiado, setCopiado] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1500);
    } catch (err) {
      console.error("Error al copiar", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      style={{
        padding: "1px 2px",
        borderRadius: 6,
        cursor: "pointer",
        backgroundColor: copiado ? "#4caf50" : "#1976d2",
        color: "white",
      }}
    >
      {copiado ? "¡Copiado!" : "Copiar"}
    </button>
  );
}
