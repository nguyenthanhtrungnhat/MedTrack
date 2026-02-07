export const NORMAL_RANGES: Record<
  string,
  { min: number; max: number }
> = {
  Pulse: { min: 60, max: 100 },
  "Heart Rate": { min: 60, max: 100 },
  Temperature: { min: 36.5, max: 37.5 },
  Respiratory: { min: 12, max: 20 },
  "SpO₂": { min: 95, max: 100 },
};
