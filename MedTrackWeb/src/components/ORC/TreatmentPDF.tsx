import { Page, Text, View, Document } from "@react-pdf/renderer";

export const TreatmentPDF = ({ form, logs }: any) => (
  <Document>
    <Page size="A4">
      <Text>PHIẾU THEO DÕI ĐIỀU TRỊ</Text>

      <Text>Số vào viện: {form.admissionNumber}</Text>
      <Text>Họ tên: {form.name}</Text>
      <Text>Chẩn đoán: {form.diagnosis}</Text>

      {logs.map((l:any,i:number)=>(
        <View key={i}>
          <Text>{l.time}</Text>
          <Text>S: {l.subjective}</Text>
          <Text>O: {l.objective}</Text>
          <Text>A: {l.assessment}</Text>
          <Text>P: {l.plan}</Text>
          <Text>Chỉ định: {l.instruction}</Text>
        </View>
      ))}
    </Page>
  </Document>
);