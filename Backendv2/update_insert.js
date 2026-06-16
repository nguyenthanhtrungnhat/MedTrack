const fs = require('fs');
let content = fs.readFileSync('../sql/insert.sql', 'utf8');

// 1. Admission
content = content.replace(
  /\`admissionID\`, \`patientID\`, \`doctorID\`, \`departmentID\`, \`admissionRecordCode\`, \`priority\`, \`advanceFee\`, \`advanceFeeStatus\`, \`admissionDate\`, \`dischargeDate\`, \`hospitalizationsDiagnosis\`, \`summaryCondition\`, \`dischargeDiagnosis\`, \`dischargeCondition\`, \`status\`/g,
  '\`admissionID\`, \`patientID\`, \`doctorID\`, \`departmentID\`, \`admissionRecordCode\`, \`priority\`, \`advanceFee\`, \`advanceFeeStatus\`, \`admissionDate\`, \`hospitalizationsDiagnosis\`, \`summaryCondition\`, \`dischargeID\`, \`status\`'
);

content = content.replace(
  /\(1, 1, 1, 1, 'BA-2026-001', 'Normal', 5000000, 'Paid', '2026-03-01 09:00:00', NULL, 'Hypertension', 'Patient stabilized after medication', NULL, NULL, 'In-treatment'\)/g,
  "(1, 1, 1, 1, 'BA-2026-001', 'Normal', 5000000, 'Paid', '2026-03-01 09:00:00', 'Hypertension', 'Patient stabilized after medication', NULL, 'In-treatment')"
);

content = content.replace(
  /\(2, 2, 1, 1, 'BA-2026-002', 'Urgent', 10000000, 'Paid', '2026-03-02 11:00:00', NULL, 'Type 2 Diabetes', 'Condition improved with insulin therapy', NULL, NULL, 'In-treatment'\)/g,
  "(2, 2, 1, 1, 'BA-2026-002', 'Urgent', 10000000, 'Paid', '2026-03-02 11:00:00', 'Type 2 Diabetes', 'Condition improved with insulin therapy', NULL, 'In-treatment')"
);

content = content.replace(
  /INSERT INTO admission \(patientID, admissionDate, dischargeDate, hospitalizationsDiagnosis, summaryCondition, dischargeDiagnosis, status\)/g,
  'INSERT INTO admission (patientID, admissionDate, hospitalizationsDiagnosis, summaryCondition, dischargeID, status)'
);

const admissionRegex = /\(([0-9]+),\s*'([^']+)',\s*NULL,\s*'([^']+)',\s*'([^']+)',\s*NULL,\s*'([^']+)'\)/g;
content = content.replace(admissionRegex, (match, p1, p2, p3, p4, p5) => {
    return `(${p1}, '${p2}', '${p3}', '${p4}', NULL, '${p5}')`;
});

// 2. Medical records: remove height and weight columns
content = content.replace(/\`height\`,\s*\`weight\`,\s*/g, '');

// Since we cannot easily regex match the values of height and weight across 100+ entries,
// we will just use a regex to match the pattern:
// (number, 'date', number, number, NUMBER, NUMBER, number, 'string', ...
// 201, '2026-03-02 08:20:00', 90, 85, 168, 70, 4,
// pattern: `([0-9]+,\s*'[^']+',\s*[0-9]+,\s*[0-9]+,)\s*[0-9]+(\.[0-9]+)?,\s*[0-9]+(\.[0-9]+)?,\s*([0-9]+,\s*'[^']+',)`
const valuesRegex = /([0-9]+,\s*'[^']+',\s*[0-9]+,\s*[0-9]+,)\s*[0-9]+(?:\.[0-9]+)?,\s*[0-9]+(?:\.[0-9]+)?,\s*([0-9]+,\s*'[^']+',)/g;
content = content.replace(valuesRegex, '$1\n        $2');

// Add clinical_examinations data
const clinicalExamData = `
-- CLINICAL EXAMINATIONS
INSERT INTO \`clinical_examinations\` (
  \`patientID\`, \`admissionID\`, \`doctorID\`, \`examDate\`, \`height\`, \`weight\`, \`bloodPressure\`, \`heartRate\`, \`temperature\`, \`generalCondition\`, \`symptoms\`, \`diagnosis\`
) VALUES
(1, 1, 1, '2026-03-01 08:30:00', 168.00, 70.00, '120/80', 80, 37.0, 'Patient looks exhausted', 'Headache, fatigue', 'Hypertension'),
(2, 2, 1, '2026-03-02 10:30:00', 170.00, 85.00, '130/85', 85, 37.2, 'Patient is sweating and dizzy', 'Dizziness, high blood sugar', 'Type 2 Diabetes'),
(3, NULL, 1, '2026-06-16 09:00:00', 165.00, 60.00, '110/70', 75, 36.8, 'Normal', 'Cough, mild fever', 'Common Cold');
`;

if (!content.includes('CLINICAL EXAMINATIONS')) {
  content += clinicalExamData;
}

fs.writeFileSync('../sql/insert.sql', content);
console.log('Done');
