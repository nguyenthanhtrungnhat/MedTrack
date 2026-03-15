import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

import { Line } from "react-chartjs-2";
import { RecordProps } from "../../interface";
import "../../css/VitalsTrendChart.css";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

type Props = {
  records: RecordProps[];
};

export default function VitalsTrendChart({ records }: Props) {

  const sorted = [...records].sort(
    (a, b) => new Date(a.timeCreate).getTime() - new Date(b.timeCreate).getTime()
  );

  const labels = sorted.map(r =>
    new Date(r.timeCreate).toLocaleDateString()
  );

  const data = {
    labels,
    datasets: [
      {
        label: "Pulse",
        data: sorted.map(r => r.pulse),
        borderColor: "#dc3545",
        tension: 0.3
      },
      {
        label: "Heart Rate",
        data: sorted.map(r => r.heartRate),
        borderColor: "#ff6384",
        tension: 0.3
      },
      {
        label: "Temperature",
        data: sorted.map(r => Number(r.temperature)),
        borderColor: "#ffa040",
        tension: 0.3
      },
      {
        label: "Respiratory",
        data: sorted.map(r => r.respiratoryRate),
        borderColor: "#36a2eb",
        tension: 0.3
      },
      {
        label: "SpO₂",
        data: sorted.map(r => Number(r.SP02)),
        borderColor: "#4bc0c0",
        tension: 0.3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div className="border whiteBg dropShadow padding mb-3">
      <h5 className="blueText mb-3">Blood Pressure</h5>
      <div className="vitals-chart-container">
        <div className="vitals-chart-card">

          <div className="vitals-chart-title">
            Patient Vital Trends
          </div>

          <div className="vitals-chart-wrapper">
            <Line data={data} options={options} />
          </div>

        </div>
      </div>
    </div>
  );
}