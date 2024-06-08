import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

export const PdfContrato = () => {
  return (
    <Document>
    <Page size={"A4"} style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>CLAÚSULAS DEL CONTRATO DE PRESTACIÓN DE SERVICIOS</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Servicios</Text>
        <Text style={styles.text}>El Proveedor se compromete a proporcionar los siguientes servicios al Cliente:</Text>
        <Text style={styles.text}>- [Descripción del Servicio 1]</Text>
        <Text style={styles.text}>- [Descripción del Servicio 2]</Text>
        <Text style={styles.text}>- [Descripción del Servicio 3]</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Honorarios</Text>
        <Text style={styles.text}>El Cliente acuerda pagar al Proveedor la cantidad de [Monto] por los servicios prestados. El pago se realizará de la siguiente manera: [Condiciones de Pago].</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Duración</Text>
        <Text style={styles.text}>Este contrato tendrá una duración de [Duración del Contrato], comenzando el [Fecha de Inicio] y finalizando el [Fecha de Término].</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.title}>Firma</Text>
        <Text style={styles.text}>Ambas partes aceptan los términos y condiciones establecidos en este contrato y lo firman en señal de conformidad:</Text>
        <Text style={styles.text}>Firma del Proveedor: __________________________</Text>
        <Text style={styles.text}>Firma del Cliente: __________________________</Text>
      </View>
    </Page>
  </Document>
  )
}

// Estilos para el documento
const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      padding: 20
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    container_text:{
        color: 'black',
        fontSize: 12,
    },  
    title:{
        color: 'gray',
        fontSize: 15,
        textAlign: 'center',
    },
    text:{
        fontSize: 12,
        marginBottom: 5,
    }
  });