export function compararArrays(array, array_new) {
    if (array.length !== array_new.length) return array_new;
  
    for (let i = 0; i < array.length; i++) {
      const a = array[i];
      const b = array_new[i];
  
      if (a.value !== b.value || a.label !== b.label) {
        return array_new;
      }
    }
  
    return null; // No hay diferencias
  }