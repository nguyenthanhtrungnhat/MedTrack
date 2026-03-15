import { parseBloodPressure, average } from "../../utils/healthStats";
import { NORMAL_RANGES } from "../../utils/normalRanges";
import { RecordProps } from "../../interface";
import { AverageSummaryChart } from "../charts/AverageSummaryChart";
import BloodPressureChart from "../charts/BloodPressureChart";
import VitalsTrendChart from "../charts/VitalsLineChart";

type Props = {
  records: RecordProps[];
};

export default function HealthDashboard({ records }: Props) {

  // ---- SORT BY TIME ----
  const sorted = [...records].sort(
    (a, b) => new Date(a.timeCreate).getTime() - new Date(b.timeCreate).getTime()
  );

  // ---- BLOOD PRESSURE DATA ----
  const bpData = sorted
    .map(r => {
      const bp = parseBloodPressure(r.bloodPressure);
      return bp
        ? {
          time: new Date(r.timeCreate).toLocaleString(),
          ...bp,
        }
        : null;
    })
    .filter(Boolean) as any[];

  // ---- AVERAGE SUMMARY DATA ----
  const avgData = [
    { name: "Pulse", value: average(sorted.map(r => r.pulse)) },
    { name: "Heart Rate", value: average(sorted.map(r => r.heartRate)) },
    { name: "Temperature", value: average(sorted.map(r => Number(r.temperature))) },
    { name: "Respiratory", value: average(sorted.map(r => r.respiratoryRate)) },
    { name: "SpO₂", value: average(sorted.map(r => Number(r.SP02))) },
  ].map(item => {
    const range = NORMAL_RANGES[item.name];
    const isNormal =
      range && item.value >= range.min && item.value <= range.max;

    return {
      ...item,
      isNormal,
      color: isNormal ? "#198754" : "#dc3545", // green / red
    };
  });

  return (
    <>
      <div className="mb-3">
        <div className="radius10 shadow-sm ">
          <div className="p-2 ps-3 radius10b0 blueBg text-white">
            <h5 className="mb-0">Health Dashboard</h5>
          </div>
        </div>
        <div className="p-4 whiteBg dropShadow radius10t0">
          <div className="row">
            <div className="col-md-6">
              <VitalsTrendChart records={records} />
            </div>
            <div className="col-md-6">
              <BloodPressureChart data={bpData} />
              <AverageSummaryChart data={avgData} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
