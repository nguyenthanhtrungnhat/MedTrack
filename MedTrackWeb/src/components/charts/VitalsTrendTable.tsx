import { RecordProps } from "../../interface";

export default function VitalsTrendTable({
  records,
}: {
  records: RecordProps[];
}) {
  return (
    <div className="border whiteBg dropShadow padding mb-3">
      <h5 className="blueText mb-3">Vitals History</h5>
      <div className="container">
        <table className="table table-bordered table-sm">
          <thead>
            <tr>
              <th>Date</th>
              <th>Pulse</th>
              <th>Heart Rate</th>
              <th>Respiratory</th>
              <th>Temp (°C)</th>
              <th>SpO₂ (%)</th>
            </tr>
          </thead>
          <tbody>
            {records.map(r => (
              <tr key={r.recordID}>
                <td>{new Date(r.timeCreate).toLocaleString()}</td>
                <td>{r.pulse}</td>
                <td>{r.heartRate}</td>
                <td>{r.respiratoryRate}</td>
                <td>{r.temperature}</td>
                <td>{r.SP02}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
