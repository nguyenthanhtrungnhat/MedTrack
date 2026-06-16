-- ======================================================
-- DATABASE RESET
-- ======================================================
DROP DATABASE IF EXISTS hospitaldb;
CREATE DATABASE hospitaldb;
USE hospitaldb;

-- ======================================================
-- USER / ROLE
-- ======================================================
CREATE TABLE user (
  userID INT NOT NULL AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  fullName VARCHAR(255),
  dob DATE,
  phone VARCHAR(15),
  email VARCHAR(255) NOT NULL,
  CIC VARCHAR(20),
  address VARCHAR(100),
  gender INT,
  isActive TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (userID)
);

CREATE TABLE role (
  roleID INT NOT NULL AUTO_INCREMENT,
  nameRole VARCHAR(50),
  PRIMARY KEY (roleID)
);

CREATE TABLE userrole (
  userRoleID INT NOT NULL AUTO_INCREMENT,
  roleID INT,
  userID INT,
  PRIMARY KEY (userRoleID)
);

-- ======================================================
-- DEPARTMENT / ROOM
-- ======================================================
CREATE TABLE department (
  departmentID INT NOT NULL AUTO_INCREMENT,
  departmentCode VARCHAR(20) NOT NULL,
  departmentName VARCHAR(100) NOT NULL,
  description VARCHAR(255),
  location VARCHAR(255),
  isActive TINYINT(1) DEFAULT 1,
  PRIMARY KEY (departmentID)
);

CREATE TABLE room (
  roomID INT NOT NULL AUTO_INCREMENT,
  departmentID INT,
  location VARCHAR(255),
  capacity INT DEFAULT 6,
  PRIMARY KEY (roomID)
);

-- ======================================================
-- STAFF
-- ======================================================
CREATE TABLE nurse (
  nurseID INT NOT NULL AUTO_INCREMENT,
  departmentID INT,
  userID INT,
  image VARCHAR(255),
  PRIMARY KEY (nurseID)
);

CREATE TABLE doctor (
  doctorID INT NOT NULL AUTO_INCREMENT,
  departmentID INT,
  userID INT,
  office VARCHAR(45),
  image VARCHAR(255),
  PRIMARY KEY (doctorID)
);

-- ======================================================
-- PATIENT
-- ======================================================
CREATE TABLE patient (
  patientID INT NOT NULL AUTO_INCREMENT,
  HI VARCHAR(100),
  relativeName VARCHAR(255),
  relativeNumber VARCHAR(20),
  userID INT NOT NULL,
  image VARCHAR(255),
  PRIMARY KEY (patientID)
);

CREATE TABLE bed (
  bedID INT NOT NULL AUTO_INCREMENT,
  roomID INT NOT NULL,
  bedNumber VARCHAR(20) NOT NULL,
  status VARCHAR(50) DEFAULT 'Empty',
  patientID INT DEFAULT NULL,
  PRIMARY KEY (bedID)
);

-- ======================================================
-- ADMISSION / CLINICAL / MEDICAL
-- ======================================================
CREATE TABLE admission (
  admissionID INT NOT NULL AUTO_INCREMENT,
  patientID INT NOT NULL,
  doctorID INT DEFAULT NULL,
  departmentID INT DEFAULT NULL,
  admissionRecordCode VARCHAR(50) UNIQUE DEFAULT NULL,
  priority VARCHAR(50) DEFAULT 'Normal',
  advanceFee DECIMAL(10,2) DEFAULT 0,
  advanceFeeStatus VARCHAR(20) DEFAULT 'Pending',
  admissionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  hospitalizationsDiagnosis VARCHAR(2000),
  summaryCondition VARCHAR(2000),
  dischargeID INT DEFAULT NULL,
  status VARCHAR(50) DEFAULT 'Init',
  PRIMARY KEY (admissionID)
);

CREATE TABLE clinical_examinations (
  examID INT AUTO_INCREMENT PRIMARY KEY,
  patientID INT NOT NULL,
  admissionID INT DEFAULT NULL,
  doctorID INT NOT NULL,
  examDate DATETIME DEFAULT CURRENT_TIMESTAMP,
  height DECIMAL(5,2),
  weight DECIMAL(5,2),
  bloodPressure VARCHAR(20),
  heartRate INT,
  temperature DECIMAL(4,1),
  generalCondition TEXT,
  symptoms TEXT,
  diagnosis TEXT
);

CREATE TABLE medicalrecords (
  recordID INT NOT NULL AUTO_INCREMENT,
  admissionID INT DEFAULT NULL,
  timeCreate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  heartRate INT,
  pulse INT,
  hurtScale INT,
  temperature VARCHAR(255),
  SP02 VARCHAR(255),
  healthStatus INT,
  respiratoryRate INT,
  bloodPressure VARCHAR(255),
  urine VARCHAR(255),
  patientID int DEFAULT NULL,
  sensorium INT,
  oxygenTherapy INT,
  currentCondition VARCHAR(100),
  PRIMARY KEY (recordID)
);

-- ======================================================
-- DISCHARGE
-- ======================================================
CREATE TABLE discharge (
  dischargeID INT AUTO_INCREMENT PRIMARY KEY,
  admissionID INT NOT NULL,
  doctorID INT NOT NULL,
  diagnosisType VARCHAR(50),
  icdCode VARCHAR(20),
  diagnosisText TEXT,
  summary TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- APPOINTMENT / NEWS / SCHEDULE
-- ======================================================
CREATE TABLE appointment (
  appointmentID INT NOT NULL AUTO_INCREMENT,
  dateTime DATE NOT NULL,
  location VARCHAR(255),
  attendanceStatus TINYINT DEFAULT 0,
  doctorID INT,
  userID INT,
  PRIMARY KEY (appointmentID)
);

CREATE TABLE news (
  newID INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(255),
  body VARCHAR(500),
  date DATE,
  author VARCHAR(45),
  image VARCHAR(255),
  isActive TINYINT(1) DEFAULT 1,
  PRIMARY KEY (newID)
);

CREATE TABLE schedules (
  scheduleID INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) DEFAULT NULL,
  date VARCHAR(255) DEFAULT NULL,
  start_at VARCHAR(255) DEFAULT NULL,
  working_hours INT DEFAULT NULL,
  nurseID INT DEFAULT NULL,
  roomID INT DEFAULT NULL,
  color VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (scheduleID)
);

CREATE TABLE scheduleRequest (
  requestID INT NOT NULL AUTO_INCREMENT,
  scheduleID INT NOT NULL,
  newDate VARCHAR(255) NOT NULL,
  reason TEXT,
  status INT DEFAULT 0,
  PRIMARY KEY (requestID),
  FOREIGN KEY (scheduleID) REFERENCES schedules(scheduleID) ON DELETE CASCADE
);

-- ======================================================
-- TEST SYSTEM
-- ======================================================
CREATE TABLE testtype (
  testTypeID INT AUTO_INCREMENT PRIMARY KEY,
  typeName VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE doctororder (
  orderID INT AUTO_INCREMENT PRIMARY KEY,
  userID INT NOT NULL,
  doctorID INT NOT NULL,
  testTypeID INT NOT NULL,
  diagnosisNote TEXT,
  status ENUM('Pending','Sample Collected','Completed','Cancelled') DEFAULT 'Pending',
  orderDate DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE testresult (
  testResultID INT AUTO_INCREMENT PRIMARY KEY,
  orderID INT NOT NULL,
  title VARCHAR(255),
  datetime DATETIME,
  testResultCode VARCHAR(50) UNIQUE,
  remarks TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE testtype_item (
  testTypeItemID INT AUTO_INCREMENT PRIMARY KEY,
  testTypeID INT NOT NULL,
  parameterName VARCHAR(100),
  unit VARCHAR(30),
  referenceRange VARCHAR(100)
);

CREATE TABLE testresult_item (
  itemID INT AUTO_INCREMENT PRIMARY KEY,
  testResultID INT NOT NULL,
  testTypeItemID INT NOT NULL,
  resultValue VARCHAR(255),
  unit VARCHAR(50),
  referenceRange VARCHAR(100),
  abnormalFlag VARCHAR(20)
);

-- ======================================================
-- MEDICINES / PRESCRIPTION
-- ======================================================
CREATE TABLE medicines (
  medicineID INT NOT NULL AUTO_INCREMENT,
  medicineName VARCHAR(150),
  genericName VARCHAR(150),
  dosageForm VARCHAR(50),
  strength VARCHAR(50),
  description VARCHAR(500),
  isActive TINYINT(1) DEFAULT 1,
  PRIMARY KEY (medicineID)
);

CREATE TABLE prescriptions (
  prescriptionID INT NOT NULL AUTO_INCREMENT,
  patientID INT NOT NULL,
  doctorID INT NOT NULL,
  diagnosis VARCHAR(1000),
  notes VARCHAR(1000),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (prescriptionID)
);

CREATE TABLE prescription_items (
  prescriptionItemID INT NOT NULL AUTO_INCREMENT,
  prescriptionID INT NOT NULL,
  medicineID INT NOT NULL,
  dosage VARCHAR(100),
  frequency VARCHAR(100),
  durationDays INT,
  quantity INT,
  instructions VARCHAR(500),
  PRIMARY KEY (prescriptionItemID)
);

-- ======================================================
-- TREATMENT
-- ======================================================
CREATE TABLE treatment_sheet (
  sheetID INT AUTO_INCREMENT PRIMARY KEY,
  patientID INT NOT NULL,
  doctorID INT,
  admissionNumber VARCHAR(50),
  patientCode VARCHAR(50),
  diagnosis TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE treatment_logs (
  logID INT AUTO_INCREMENT PRIMARY KEY,
  sheetID INT NOT NULL,
  logTime TIME,
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  instruction TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ======================================================
-- FOREIGN KEYS (ALL ADDED AT END)
-- ======================================================

-- USER ROLE
ALTER TABLE userrole
ADD CONSTRAINT fk_userrole_role FOREIGN KEY (roleID) REFERENCES role(roleID),
ADD CONSTRAINT fk_userrole_user FOREIGN KEY (userID) REFERENCES user(userID);

-- STAFF
ALTER TABLE nurse
ADD CONSTRAINT fk_nurse_user FOREIGN KEY (userID) REFERENCES user(userID),
ADD CONSTRAINT fk_nurse_department FOREIGN KEY (departmentID) REFERENCES department(departmentID);

ALTER TABLE doctor
ADD CONSTRAINT fk_doctor_user FOREIGN KEY (userID) REFERENCES user(userID),
ADD CONSTRAINT fk_doctor_department FOREIGN KEY (departmentID) REFERENCES department(departmentID);

-- ROOM
ALTER TABLE room
ADD CONSTRAINT fk_room_department FOREIGN KEY (departmentID) REFERENCES department(departmentID);

-- PATIENT
ALTER TABLE patient
ADD CONSTRAINT fk_patient_user FOREIGN KEY (userID) REFERENCES user(userID);

-- BED
ALTER TABLE bed
ADD CONSTRAINT fk_bed_room FOREIGN KEY (roomID) REFERENCES room(roomID),
ADD CONSTRAINT fk_bed_patient FOREIGN KEY (patientID) REFERENCES patient(patientID);

-- ADMISSION
ALTER TABLE admission
ADD CONSTRAINT fk_admission_patient FOREIGN KEY (patientID) REFERENCES patient(patientID),
ADD CONSTRAINT fk_admission_doctor FOREIGN KEY (doctorID) REFERENCES doctor(doctorID),
ADD CONSTRAINT fk_admission_department FOREIGN KEY (departmentID) REFERENCES department(departmentID);

-- CLINICAL
ALTER TABLE clinical_examinations
ADD CONSTRAINT fk_clinical_admission FOREIGN KEY (admissionID) REFERENCES admission(admissionID),
ADD CONSTRAINT fk_clinical_doctor FOREIGN KEY (doctorID) REFERENCES doctor(doctorID);

-- MEDICAL RECORDS
ALTER TABLE medicalrecords
ADD CONSTRAINT fk_medical_admission FOREIGN KEY (admissionID) REFERENCES admission(admissionID);
ALTER TABLE medicalrecords
ADD CONSTRAINT fk_medicalrecords_patient FOREIGN KEY (patientID) REFERENCES patient(patientID);
-- DISCHARGE
ALTER TABLE discharge
  ADD CONSTRAINT fk_discharge_doctor FOREIGN KEY (doctorID) REFERENCES doctor(doctorID);

-- APPOINTMENT
ALTER TABLE appointment
ADD CONSTRAINT fk_appointment_doctor FOREIGN KEY (doctorID) REFERENCES doctor(doctorID),
ADD CONSTRAINT fk_appointment_user FOREIGN KEY (userID) REFERENCES user(userID);

-- SCHEDULES
ALTER TABLE schedules
ADD CONSTRAINT fk_schedule_nurse FOREIGN KEY (nurseID) REFERENCES nurse(nurseID),
ADD CONSTRAINT fk_schedule_room FOREIGN KEY (roomID) REFERENCES room(roomID);

-- DOCTOR ORDER
ALTER TABLE doctororder
ADD CONSTRAINT fk_order_user FOREIGN KEY (userID) REFERENCES user(userID),
ADD CONSTRAINT fk_order_doctor FOREIGN KEY (doctorID) REFERENCES doctor(doctorID),
ADD CONSTRAINT fk_order_testtype FOREIGN KEY (testTypeID) REFERENCES testtype(testTypeID);

-- TEST RESULT
ALTER TABLE testresult
ADD CONSTRAINT fk_testresult_order FOREIGN KEY (orderID) REFERENCES doctororder(orderID);

-- TEST TYPE ITEM
ALTER TABLE testtype_item
ADD CONSTRAINT fk_testtype_item FOREIGN KEY (testTypeID) REFERENCES testtype(testTypeID);

-- TEST RESULT ITEM
ALTER TABLE testresult_item
ADD CONSTRAINT fk_testresult_item_result FOREIGN KEY (testResultID) REFERENCES testresult(testResultID),
ADD CONSTRAINT fk_testresult_item_type FOREIGN KEY (testTypeItemID) REFERENCES testtype_item(testTypeItemID);

-- PRESCRIPTION
ALTER TABLE prescriptions
ADD CONSTRAINT fk_prescription_patient FOREIGN KEY (patientID) REFERENCES patient(patientID),
ADD CONSTRAINT fk_prescription_doctor FOREIGN KEY (doctorID) REFERENCES doctor(doctorID);

ALTER TABLE prescription_items
ADD CONSTRAINT fk_prescription_items_prescription FOREIGN KEY (prescriptionID) REFERENCES prescriptions(prescriptionID),
ADD CONSTRAINT fk_prescription_items_medicine FOREIGN KEY (medicineID) REFERENCES medicines(medicineID);

-- TREATMENT
ALTER TABLE treatment_sheet
ADD CONSTRAINT fk_treatment_patient FOREIGN KEY (patientID) REFERENCES patient(patientID),
ADD CONSTRAINT fk_treatment_doctor FOREIGN KEY (doctorID) REFERENCES doctor(doctorID);

ALTER TABLE treatment_logs
ADD CONSTRAINT fk_treatment_logs_sheet FOREIGN KEY (sheetID) REFERENCES treatment_sheet(sheetID);