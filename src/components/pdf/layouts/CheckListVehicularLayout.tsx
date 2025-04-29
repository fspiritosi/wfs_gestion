// Layout PDF para CHECK LIST VEHICULAR
'use client';

import { Document, Image, Page, Rect, StyleSheet, Svg, Text, View } from '@react-pdf/renderer';

interface CheckListVehicularLayoutProps {
  title?: string;
  subtitle?: string;
  logoUrl?: string;
  singurl?: string | null;
  generales: { label: string; value: string }[];
  adicionales: { label: string; value: string }[];
  salida: { label: string; value: string }[];
  entrada: { label: string; value: string }[];
}

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
    position: 'relative',
  },
  border: {
    position: 'absolute',
    top: 30,
    left: 30,
    right: 30,
    bottom: 30,
    border: '1pt solid black',
  },
  contentWrapper: {
    position: 'relative',
    height: '100%',
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1pt solid black',
    backgroundColor: 'white',
  },
  headerLeft: {
    width: '30%',
  },
  logo: {
    marginLeft: 10,
    width: 120,
    height: 50,
    objectFit: 'contain',
  },
  headerRight: {
    width: '70%',
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 11,
    fontWeight: 'bold',
    textAlign: 'right',
    marginBottom: 4,
  },
  headerSubText: {
    fontSize: 8,
    textAlign: 'right',
    marginBottom: 2,
  },
  infoGrid: {
    flexDirection: 'row',
    paddingVertical: 5,
    marginBottom: 10,
  },
  infoColumn: {
    flex: 1,
    paddingHorizontal: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginVertical: 1,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 9,
    marginRight: 2,
  },
  infoValue: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    marginLeft: 2,
    fontSize: 9,
    minHeight: 12,
  },
  columnsGrid: {
    flexDirection: 'row',
    gap: 10,
    padding: 5,
  },
  column: {
    flex: 1,
    border: '1pt solid #000',
    margin: 2,
    padding: 4,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 4,
    textAlign: 'center',
    borderBottom: '1pt solid #000',
    paddingBottom: 2,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 16,
    borderBottom: '0.5pt solid #ccc',
    paddingVertical: 2,
  },
  itemLabel: {
    flex: 1,
    fontSize: 9,
  },
  itemValue: {
    width: 60,
    borderBottom: '0.5pt solid #000',
    fontSize: 9,
    textAlign: 'center',
  },
  terminology: {
    marginVertical: 8,
    padding: 5,
    backgroundColor: '#f0f0f0',
  },
  terminologyTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    fontSize: 9,
  },
  terminologyOptions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 50,
  },
  terminologyText: {
    textAlign: 'center',
    fontSize: 8,
  },
  footer: {
    marginTop: 15,
    padding: 5,
  },
  observacionesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  observacionesLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    marginRight: 2,
  },
  observacionesValue: {
    flex: 1,
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    minHeight: 12,
  },
  signatureContainer: {
    marginTop: 30,
    alignItems: 'center',
    width: '100%',
  },
  signatureText: {
    fontSize: 8,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 8,
  },
});

// SVG cuadrado para usar como checkbox
const SquareCheckBox = () => (
  <Svg width={10} height={10} style={{ marginHorizontal: 2 }}>
    <Rect x={0.5} y={0.5} width={9} height={9} stroke="#000" strokeWidth={1} fill="none" />
  </Svg>
);

export const CheckListVehicularLayout = ({
  title = 'CHECK LIST VEHICULAR',
  subtitle = 'WFS - CHK - VEH - 01',
  logoUrl,
  singurl,
  generales,
  adicionales,
  salida,
  entrada,
}: CheckListVehicularLayoutProps) => {
  // Utilidades para checkboxes vacíos
  // const checkbox = '□';

  // Helper para obtener valor o checkbox vacío
  const renderCheckbox = (checked: boolean) => (checked ? '■' : <SquareCheckBox />);

  // Separar campos de fecha/hora/combustible de los ítems de chequeo
  const salidaFecha = salida.find((i) => i.label.toLowerCase().includes('fecha'))?.value || '';
  const salidaHora = salida.find((i) => i.label.toLowerCase().includes('hora'))?.value || '';
  const salidaCombustible = salida.find((i) => i.label.toLowerCase().includes('combustible'))?.value || '';
  const salidaItems = salida.filter(
    (i) =>
      !i.label.toLowerCase().includes('fecha') &&
      !i.label.toLowerCase().includes('hora') &&
      !i.label.toLowerCase().includes('combustible')
  );

  const entradaFecha = entrada.find((i) => i.label.toLowerCase().includes('fecha'))?.value || '';
  const entradaHora = entrada.find((i) => i.label.toLowerCase().includes('hora'))?.value || '';
  const entradaCombustible = entrada.find((i) => i.label.toLowerCase().includes('combustible'))?.value || '';
  const entradaItems = entrada.filter(
    (i) =>
      !i.label.toLowerCase().includes('fecha') &&
      !i.label.toLowerCase().includes('hora') &&
      !i.label.toLowerCase().includes('combustible')
  );

  // Separar adicionales para pie (inspeccionado/recibido por, fecha/hora/firma)
  const inspeccionadoPor = adicionales.find((i) => i.label.toLowerCase().includes('inspeccionado'))?.value || '';
  const recibidoPor = adicionales.find((i) => i.label.toLowerCase().includes('recibido'))?.value || '';
  const fechaInspeccion = adicionales.find((i) => i.label.toLowerCase().includes('fecha inspección'))?.value || '';
  const horaInspeccion = adicionales.find((i) => i.label.toLowerCase().includes('hora inspección'))?.value || '';
  const fechaRecepcion = adicionales.find((i) => i.label.toLowerCase().includes('fecha recepción'))?.value || '';
  const horaRecepcion = adicionales.find((i) => i.label.toLowerCase().includes('hora recepción'))?.value || '';

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.border} fixed />
        <View style={styles.contentWrapper}>
          {/* Header y tabla superior */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }} fixed>
            <View style={{ width: 120 }}>{logoUrl && <Image style={styles.logo} src={logoUrl} />}</View>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 2 }}>{title}</Text>
            </View>
          </View>
          {/* Tabla superior tipo formulario */}
          <View style={{ border: '1pt solid #000', marginBottom: 6 }}>
            {/* Fila 1: FECHA y OBRA */}
            <View style={{ flexDirection: 'row' }}>
              {/* FECHA label */}
              <View
                style={{
                  width: 90,
                  backgroundColor: '#1155cc',
                  borderRight: '1pt solid #000',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>FECHA</Text>
              </View>
              {/* FECHA valor */}
              <View style={{ flex: 1, borderRight: '1pt solid #000', justifyContent: 'center', minHeight: 18 }}>
                <Text style={{ marginLeft: 4 }}>
                  {generales.find((g) => g.label.toLowerCase().includes('fecha'))?.value || ''}
                </Text>
              </View>
              {/* OBRA label */}
              <View
                style={{
                  width: 90,
                  backgroundColor: '#1155cc',
                  borderRight: '1pt solid #000',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>OBRA</Text>
              </View>
              {/* OBRA valor */}
              <View style={{ flex: 1, justifyContent: 'center', minHeight: 18 }}>
                <Text style={{ marginLeft: 4 }}>
                  {generales.find((g) => g.label.toLowerCase().includes('obra'))?.value || ''}
                </Text>
              </View>
            </View>
            {/* Fila 2: VEHICULO y CONDUCTOR */}
            <View style={{ flexDirection: 'row', borderTop: '1pt solid #000' }}>
              {/* VEHICULO label */}
              <View
                style={{
                  width: 90,
                  backgroundColor: '#1155cc',
                  borderRight: '1pt solid #000',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>VEHICULO</Text>
              </View>
              {/* VEHICULO valor */}
              <View style={{ flex: 1, borderRight: '1pt solid #000', justifyContent: 'center', minHeight: 18 }}>
                <Text style={{ marginLeft: 4 }}>
                  {generales.find((g) => g.label.toLowerCase().includes('vehiculo'))?.value || ''}
                </Text>
              </View>
              {/* CONDUCTOR label */}
              <View
                style={{
                  width: 90,
                  backgroundColor: '#1155cc',
                  borderRight: '1pt solid #000',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center' }}>CONDUCTOR</Text>
              </View>
              {/* CONDUCTOR valor */}
              <View style={{ flex: 1, justifyContent: 'center', minHeight: 18 }}>
                <Text style={{ marginLeft: 4 }}>
                  {generales.find((g) => g.label.toLowerCase().includes('conductor'))?.value || ''}
                </Text>
              </View>
            </View>
          </View>

          {/* Chequeo SALIDA y ENTRADA */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 6 }}>
            {/* SALIDA */}
            <View style={{ flex: 1, border: '1pt solid #000' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 11, backgroundColor: '#d9eaf7', textAlign: 'center' }}>
                CHEQUEO DE SALIDA
              </Text>
              {/* Header tipo formulario para fecha/hora */}
              <View style={{ borderBottom: '1pt solid #000' }}>
                <View style={{ flexDirection: 'row' }}>
                  {/* Fecha label */}
                  <View
                    style={{
                      width: 60,
                      backgroundColor: '#1155cc',
                      borderRight: '1pt solid #000',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 9 }}>Fecha</Text>
                  </View>
                  {/* Fecha valor */}
                  <View style={{ flex: 1, borderRight: '1pt solid #000', minHeight: 16, justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 4, fontSize: 9 }}>{salidaFecha}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', borderTop: '1pt solid #000' }}>
                  {/* Hora label */}
                  <View
                    style={{
                      width: 60,
                      backgroundColor: '#1155cc',
                      borderRight: '1pt solid #000',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 9 }}>
                      Hora Salida
                    </Text>
                  </View>
                  {/* Hora valor */}
                  <View style={{ flex: 1, minHeight: 16, justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 4, fontSize: 9 }}>{salidaHora}</Text>
                  </View>
                </View>
              </View>
              {/* Combustible con checkboxes */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                <Text style={{ fontSize: 9, marginRight: 2 }}>COMBUSTIBLE :</Text>
                <Text style={{ fontSize: 9, marginRight: 2 }}>VACÍO</Text>
                <SquareCheckBox />
                <Text style={{ fontSize: 9, marginRight: 2 }}>1/4</Text>
                <SquareCheckBox />
                <Text style={{ fontSize: 9, marginRight: 2 }}>1/2</Text>
                <SquareCheckBox />
                <Text style={{ fontSize: 9, marginRight: 2 }}>3/4</Text>
                <SquareCheckBox />
                <Text style={{ fontSize: 9, marginRight: 2 }}>FULL</Text>
                <SquareCheckBox />
              </View>
              <View style={{ flexDirection: 'row', borderBottom: '1pt solid #000', backgroundColor: '#1155cc' }}>
                <View style={{ flex: 5, borderRight: '1pt solid #000' }}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>ITEM</Text>
                </View>
                <View style={{ flex: 1, borderRight: '1pt solid #000' }}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>BUENO</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>MALO</Text>
                </View>
              </View>
              {salidaItems.map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', borderBottom: '0.5pt solid #bbb', minHeight: 16 }}>
                  <View style={{ flex: 2, borderRight: '1pt solid #000', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 9, paddingLeft: 4 }}>{item.label}</Text>
                  </View>
                  <View
                    style={{ flex: 1, minWidth: 20, maxWidth: 28, borderRight: '1pt solid #000', alignItems: 'center' }}
                  >
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <SquareCheckBox />
                    </View>
                  </View>
                  <View style={{ flex: 1, minWidth: 20, maxWidth: 28, alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <SquareCheckBox />
                    </View>
                  </View>
                </View>
              ))}
              <View style={{ minHeight: 24, borderTop: '1pt solid #000', marginTop: 2, paddingHorizontal: 2 }}>
                <Text style={{ fontSize: 9 }}>OBSERVACIONES:</Text>
              </View>
            </View>
            {/* ENTRADA */}
            <View style={{ flex: 1, border: '1pt solid #000' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 11, backgroundColor: '#d9d9d9', textAlign: 'center' }}>
                CHEQUEO DE ENTRADA
              </Text>
              {/* Header tipo formulario para fecha/hora */}
              <View style={{ borderBottom: '1pt solid #000' }}>
                <View style={{ flexDirection: 'row' }}>
                  {/* Fecha label */}
                  <View
                    style={{
                      width: 60,
                      backgroundColor: '#d9d9d9',
                      borderRight: '1pt solid #000',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 9 }}>Fecha</Text>
                  </View>
                  {/* Fecha valor */}
                  <View style={{ flex: 1, borderRight: '1pt solid #000', minHeight: 16, justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 4, fontSize: 9 }}>{entradaFecha}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', borderTop: '1pt solid #000' }}>
                  {/* Hora label */}
                  <View
                    style={{
                      width: 60,
                      backgroundColor: '#d9d9d9',
                      borderRight: '1pt solid #000',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: '#fff', fontWeight: 'bold', textAlign: 'center', fontSize: 9 }}>
                      Hora Ingreso
                    </Text>
                  </View>
                  {/* Hora valor */}
                  <View style={{ flex: 1, minHeight: 16, justifyContent: 'center' }}>
                    <Text style={{ marginLeft: 4, fontSize: 9 }}>{entradaHora}</Text>
                  </View>
                </View>
              </View>
              {/* Combustible con checkboxes */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 2 }}>
                <Text style={{ fontSize: 9, marginRight: 2 }}>COMBUSTIBLE :</Text>
                <Text style={{ fontSize: 9, marginRight: 2 }}>VACÍO</Text>
                <SquareCheckBox />
                <Text style={{ fontSize: 9, marginRight: 2 }}>1/4</Text>
                <SquareCheckBox />
                <Text style={{ fontSize: 9, marginRight: 2 }}>1/2</Text>
                <SquareCheckBox />
                <Text style={{ fontSize: 9, marginRight: 2 }}>3/4</Text>
                <SquareCheckBox />
                <Text style={{ fontSize: 9, marginRight: 2 }}>FULL</Text>
                <SquareCheckBox />
              </View>
              <View style={{ flexDirection: 'row', borderBottom: '1pt solid #000', backgroundColor: '#1155cc' }}>
                <View style={{ flex: 5, borderRight: '1pt solid #000' }}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>ITEM</Text>
                </View>
                <View style={{ flex: 1, borderRight: '1pt solid #000' }}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>BUENO</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>MALO</Text>
                </View>
              </View>
              {entradaItems.map((item, idx) => (
                <View key={idx} style={{ flexDirection: 'row', borderBottom: '0.5pt solid #bbb', minHeight: 16 }}>
                  <View style={{ flex: 2, borderRight: '1pt solid #000', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 9, paddingLeft: 4 }}>{item.label}</Text>
                  </View>
                  <View
                    style={{ flex: 1, minWidth: 20, maxWidth: 28, borderRight: '1pt solid #000', alignItems: 'center' }}
                  >
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <SquareCheckBox />
                    </View>
                  </View>
                  <View style={{ flex: 1, minWidth: 20, maxWidth: 28, alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                      <SquareCheckBox />
                    </View>
                  </View>
                </View>
              ))}
              <View style={{ minHeight: 24, borderTop: '1pt solid #000', marginTop: 2, paddingHorizontal: 2 }}>
                <Text style={{ fontSize: 9 }}>OBSERVACIONES:</Text>
              </View>
            </View>
          </View>

          {/* Observaciones generales */}
          <View style={{ border: '1pt solid #000', minHeight: 32, marginBottom: 8, padding: 4 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 9, color: '#000' }}>OBSERVACIONES:</Text>
          </View>

          {/* Footer tipo formulario alineado al bottom */}
          <View
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              width: '100%',
              border: '1pt solid #000',
              margin: 0,
              padding: 0,
            }}
          >
            {/* Primera fila: labels */}
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1, borderRight: '1pt solid #000' }}>
                <Text style={{ fontSize: 9, padding: 4 }}>INSPECCIONADO POR :</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 9, padding: 4 }}>RECIBIDO POR :</Text>
              </View>
            </View>
            {/* Segunda fila: nombre y fecha/hora en 3 rows */}
            <View style={{ flexDirection: 'row', borderTop: '1pt solid #000' }}>
              {/* INSPECCIONADO POR */}
              <View style={{ flex: 1, borderRight: '1pt solid #000' }}>
                {/* Row 1: Nombre y FECHA */}
                <View style={{ flexDirection: 'row', minHeight: 16, borderBottom: '1pt solid #000' }}>
                  <View style={{ flex: 7, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 9, padding: 4, color: '#000' }}>{inspeccionadoPor}</Text>
                  </View>
                  <View
                    style={{
                      flex: 3,
                      backgroundColor: '#1155cc',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: '1pt solid #000',
                    }}
                  >
                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 9 }}>FECHA</Text>
                  </View>
                </View>
                {/* Row 2: vacío */}
                <View style={{ flexDirection: 'row', minHeight: 16, borderBottom: '1pt solid #000' }}>
                  <View style={{ flex: 7 }} />
                  <View style={{ flex: 3, borderRight: '1pt solid #000' }} />
                </View>
                {/* Row 3: HORA */}
                <View style={{ flexDirection: 'row', minHeight: 16 }}>
                  <View style={{ flex: 7 }} />
                  <View
                    style={{
                      flex: 3,
                      backgroundColor: '#1155cc',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: '1pt solid #000',
                    }}
                  >
                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 9 }}>HORA</Text>
                  </View>
                </View>
              </View>
              {/* RECIBIDO POR */}
              <View style={{ flex: 1 }}>
                {/* Row 1: Nombre y FECHA */}
                <View style={{ flexDirection: 'row', minHeight: 16, borderBottom: '1pt solid #000' }}>
                  <View style={{ flex: 7, justifyContent: 'center' }}>
                    <Text style={{ fontSize: 9, padding: 4, color: '#000' }}>{recibidoPor}</Text>
                  </View>
                  <View
                    style={{
                      flex: 3,
                      backgroundColor: '#d9d9d9',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: '1pt solid #000',
                    }}
                  >
                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 9 }}>FECHA</Text>
                  </View>
                </View>
                {/* Row 2: vacío */}
                <View style={{ flexDirection: 'row', minHeight: 16, borderBottom: '1pt solid #000' }}>
                  <View style={{ flex: 7 }} />
                  <View style={{ flex: 3, borderRight: '1pt solid #000' }} />
                </View>
                {/* Row 3: HORA */}
                <View style={{ flexDirection: 'row', minHeight: 16 }}>
                  <View style={{ flex: 7 }} />
                  <View
                    style={{
                      flex: 3,
                      backgroundColor: '#d9d9d9',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRight: '1pt solid #000',
                    }}
                  >
                    <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 9 }}>HORA</Text>
                  </View>
                </View>
              </View>
            </View>
            {/* Tercera fila: firma y aclaración con la misma división */}
            <View style={{ flexDirection: 'row', borderTop: '1pt solid #000' }}>
              {/* INSPECCIONADO POR firma */}
              <View style={{ flex: 1, borderRight: '1pt solid #000', flexDirection: 'row', minHeight: 20 }}>
                <View
                  style={{ flex: 7, borderRight: '1pt solid #000', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ fontSize: 8 }}>( FIRMA Y ACLARACION ) :</Text>
                </View>
                <View style={{ flex: 3 }} />
              </View>
              {/* RECIBIDO POR firma */}
              <View style={{ flex: 1, flexDirection: 'row', minHeight: 20 }}>
                <View
                  style={{ flex: 7, borderRight: '1pt solid #000', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ fontSize: 8 }}>( FIRMA Y ACLARACION ) :</Text>
                </View>
                <View style={{ flex: 3 }} />
              </View>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};
