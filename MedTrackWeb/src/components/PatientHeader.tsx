type Props = {
  name?: string;
  phone?: string;
};

export default function PatientHeader({ name, phone }: Props) {
  return (
    <div style={{ marginBottom: 16 }}>
      <h3 style={{ marginBottom: 4 }}>Patient Health Report</h3>
      <div><strong>Name:</strong> {name || "N/A"}</div>
      <div><strong>Phone:</strong> {phone || "N/A"}</div>
      <div><strong>Date:</strong> {new Date().toLocaleString()}</div>
      <hr />
    </div>
  );
}
