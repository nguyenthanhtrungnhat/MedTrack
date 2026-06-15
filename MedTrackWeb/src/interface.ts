export interface NurseProps {
    image?: string,
    departmentID?: number,
    fullName: string,
    gender: string,
    dob: string,
    phone: string,
    nurseID: string,
    address: string,
    email: string,
    CIC: number
}
export interface RoomProps {
    departmentName: string,
    location: string,
    roomID: string
}
export interface PatientProps {
    patientID: string | undefined
    image?: string;
    fullName: string;
    gender: string;
    dob: string;
    phone: number | string;
    address: string;
    email: string;
    hospitalizationsDiagnosis?: string;
    summaryCondition?: string;
    dischargeDiagnosis?: string;
    HI?: string;
    admissionDate?: string;
    relativeName?: string;
    relativeNumber?: number | string
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
    phone?: string | number;
    fullName?: string;
}
export interface FormData {
  admissionID: string;

  pulse: string;
  spo2: string;
  temperature: string;
  oxygenTherapy: string;

  bloodPressure: string;

  sensorium: string;
  respiratoryRate: string;
  urine: string;

  heartRate: string;
  hurtScale: string;

  currentCondition: string;
}
export interface Schedule {
    subject: string;
    working_hours: number;
    date: string;
    scheduleID: string;
    start_at: string;
    color: string;
    roomID: string;
    room_location: string;
}
export interface ScheduleRequest {
    requestID: number;
    scheduleID: number;
    reason?: string;
    newDate?: string; // yyyy-mm-dd format
    status: 0 | 1 | 2; // 0 = Pending, 1 = Approved, 2 = Rejected
}
export interface AppointmentProps {
    attendanceStatus: number;
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
  orderID: number;

  patientID: number;
  patientName: string;
  patientCIC: string;

  doctorID: number;
  doctorName: string;

  typeName: string;

  title: string;
  datetime: string;
  testResultCode: string;
}

export interface TestResultItem {
    itemID: number;
    parameterName: string;
    resultValue: string;
    unit: string;
    referenceRange: string;
    abnormalFlag: string;
}

export interface TestResultDetail {
    testResultID: number;
    userID: number;
    doctorID: number;
    patientCIC: string;
    patientName: string;
    doctorName: string;

    title: string;
    datetime: string;
    testResultCode: string;

    typeName: string;
    remarks: string;

    items: TestResultItem[];
}