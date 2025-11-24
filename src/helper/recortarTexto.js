export const recortarTexto = (str, cantidad, simbol) => {
  if (!str) return "";
  const palabras = str.trim().split(/\s+/).slice(0, cantidad);
  return palabras.join(" ") + simbol;
};