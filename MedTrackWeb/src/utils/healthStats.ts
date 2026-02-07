export const parseBloodPressure = (bp?: string) => {
  if (!bp || !bp.includes("/")) return null;
  const [sys, dia] = bp.split("/").map(Number);
  if (isNaN(sys) || isNaN(dia)) return null;
  return { systolic: sys, diastolic: dia };
};

export const average = (values: number[]) =>
  values.length
    ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10
    : 0;
