export interface NurseProps {
    image?: string,
    fullName: string,
    gender: string,
    dob: string,
    phone: string,
    nurseID: string,
    address: string,
    email: string,
    CIC:number
}
export interface RoomProps {
    department: string,
    roomID: string
}
export interface PatientProps {
    patientID: string|undefined
    image?: string;
    fullName: string;
    gender: string;
    dob: string;
    phone: number|string;
    address: string;
    email: string;
    hospitalizationsDiagnosis?: string;
    summaryCondition?: string;
    dischargeDiagnosis?: string;
    HI?: string;
    admissionDate?: string;
    relativeName?: string;
    relativeNumber?: number|string
    dischargeDate?: string;
    CIC?: number;
    username?: string;
}

export interface RecordProps {
    recordID: string,
    timeCreate: string,
    heartRate: number,
    pulse: number,
    height: number,
    weight: number,
    hurtScale: number,
    temperature: number,
    currentCondition: number,
    healthStatus: number,
    SP02: number,
    respiratoryRate: number,
    bloodPressure: string,
    urine: number,
    doctorID: string,
    patientID: string,
    nurseID: string,
    oxygenTherapy: number,
    sensorium: number
}
export interface SidebarInfoProps {
    phone?: string|number;
    fullName?: string;
}
export interface FormData {
    patientID: string;
    pulse: number|string;
    spo2: number|string;
    temperature: number|string;
    oxygenTherapy: number|string;
    bloodPressure: string;
    height: number|string;
    weight: number|string;
    sensorium: number|string;
    respiratoryRate: number|string;
    urine: number|string;
    heartRate: number|string;
    hurtScale: number|string;
    currentCondition: string;
};
export interface Schedule{
    subject:string;
    working_hours:number;
    date:string;
    scheduleID:string;
    start_at:string;
    color:string;
    roomID:string;
    room_location:string;
}
export interface ScheduleRequest {
    requestID: number;
    scheduleID: number;
    reason?: string;
    newDate?: string; // yyyy-mm-dd format
    status: 0 | 1 | 2; // 0 = Pending, 1 = Approved, 2 = Rejected
}
export interface AppointmentProps {
    appointmentID: number;
    dateTime: string;             // DATE or DATETIME from DB
    location: string | null;
    appointmentStatus: 0 | 1;     // 0 = Coming, 1 = Overdue
    doctorID: number | null;
    userID: number | null;
    doctorName?: string;          // optional if returned from join
    patientName?: string;         // optional if you want to show patient
}

export interface TestResultProps {
  testResultID: number;
  userID: number;
  title: string;
  datetime: string;
  testResultCode: string;
  status: "Completed" | "Pending" | "Failed";
  type: string;
  username: string;
}
// export interface Medicine {
//   medicineID: number
//   medicineName: string
//   genericName: string
//   dosageForm: string
//   strength: string
//   description: string
//   isActive: number
// }