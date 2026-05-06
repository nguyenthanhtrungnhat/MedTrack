export const parseForm = (text: string) => ({
  admissionNumber: text.match(/Số vào viện[:\s]*([^\n]+)/i)?.[1] || "",
  patientCode: text.match(/Mã người bệnh[:\s]*([^\n]+)/i)?.[1] || "",
  name: text.match(/Họ và tên người bệnh[:\s]*([^\n]+)/i)?.[1] || "",
  diagnosis:
    text.match(/Chẩn đoán[:\s]*([\s\S]*?)Chẩn đoán phân biệt/i)?.[1] || "",
});