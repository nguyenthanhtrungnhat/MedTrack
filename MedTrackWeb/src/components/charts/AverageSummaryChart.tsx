import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
} from "recharts";
import { NORMAL_RANGES } from "../../utils/normalRanges";

type Props = {
  data: { name: string; value: number }[];
};

export function AverageSummaryChart({ data }: Props) {
  return (
    <div className="border whiteBg dropShadow padding mb-3">
      <h5 className="blueText mb-3">Average Health Summary</h5>
      <div className="container">
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value">
              {data.map((item, index) => {
                const range = NORMAL_RANGES[item.name];
                const isNormal =
                  range &&
                  item.value >= range.min &&
                  item.value <= range.max;

                return (
                  <Cell
                    key={index}
                    fill={isNormal ? "#198754" : "#dc3545"}
                  />
                );
              })}
              <LabelList
                dataKey="value"
                position="top"
              //   formatter={(v: number) => v.toFixed(1)}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}
