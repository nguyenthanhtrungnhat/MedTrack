import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList } from "recharts";

export default function BloodPressureChart({ data }: { data: any[] }) {
    return (
        <div className="border whiteBg dropShadow padding mb-3">
            <h5 className="blueText mb-3">Blood Pressure</h5>
            <div className="container"><ResponsiveContainer width="100%" height={250}>
                <BarChart data={data}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="systolic" fill="#dc3545" name="Systolic">
                        <LabelList dataKey="systolic" position="top" />
                    </Bar>
                    <Bar dataKey="diastolic" fill="#0d6efd" name="Diastolic" >
                        <LabelList dataKey="diastolic" position="top" />
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
            </div>
        </div>
    );
}
