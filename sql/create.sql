-- ------------------------------------------------------
-- Database: hospitaldb
-- ------------------------------------------------------
DROP DATABASE IF EXISTS hospitaldb;
CREATE DATABASE hospitaldb;
USE hospitaldb;
-- ===================== CREATE TABLES WITH PK =====================
-- 1. USER table
CREATE TABLE `user` (
  `userID` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullName` varchar(255) NULL,
  `dob` date DEFAULT NULL,
  `phone` varchar(15) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `CIC` varchar(20) DEFAULT NULL,
  `address` varchar(100) DEFAULT NULL,
  `gender` int DEFAULT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`userID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
CREATE TABLE department (
  departmentID INT NOT NULL AUTO_INCREMENT,
  departmentCode VARCHAR(20) NOT NULL,
  departmentName VARCHAR(100) NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  isActive TINYINT(1) DEFAULT 1,
  PRIMARY KEY (departmentID)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- 2. ROLE table
CREATE TABLE `role` (
  `roleID` int NOT NULL AUTO_INCREMENT,
  `nameRole` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`roleID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- 3. USERROLE table
CREATE TABLE `userrole` (
  `userRoleID` int NOT NULL AUTO_INCREMENT,
  `roleID` int DEFAULT NULL,
  `userID` int DEFAULT NULL,
  PRIMARY KEY (`userRoleID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- 4. ROOM table
CREATE TABLE room (
  roomID INT NOT NULL AUTO_INCREMENT,
  departmentID INT DEFAULT NULL,
  location VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (roomID)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- 5. NURSE table
CREATE TABLE nurse (
  nurseID INT NOT NULL AUTO_INCREMENT,
  departmentID INT DEFAULT NULL,
  userID INT DEFAULT NULL,
  image VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (nurseID)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- 6. DOCTOR table
CREATE TABLE doctor (
  doctorID INT NOT NULL AUTO_INCREMENT,
  departmentID INT DEFAULT NULL,
  userID INT DEFAULT NULL,
  office VARCHAR(45) DEFAULT NULL,
  image VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (doctorID)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- 9. PATIENT table
CREATE TABLE patient (
  patientID INT NOT NULL AUTO_INCREMENT,
  HI VARCHAR(100) DEFAULT NULL,
  admissionDate TIMESTAMP NULL DEFAULT NULL,
  dischargeDate TIMESTAMP NULL DEFAULT NULL,
  hospitalizationsDiagnosis VARCHAR(2000) DEFAULT NULL,
  summaryCondition VARCHAR(2000) DEFAULT NULL,
  dischargeDiagnosis VARCHAR(2000) DEFAULT NULL,
  relativeName VARCHAR(255) DEFAULT NULL,
  relativeNumber VARCHAR(20) DEFAULT NULL,
  userID INT NOT NULL,
  image VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (patientID)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- 10. MEDICAL RECORDS table
CREATE TABLE `medicalrecords` (
  `recordID` int NOT NULL AUTO_INCREMENT,
  `timeCreate` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `heartRate` int DEFAULT NULL,
  `pulse` int DEFAULT NULL,
  `height` int DEFAULT NULL,
  `weight` int DEFAULT NULL,
  `hurtScale` int DEFAULT NULL,
  `temperature` varchar(255) DEFAULT NULL,
  `currentCondition` varchar(100) DEFAULT NULL,
  `SP02` varchar(255) DEFAULT NULL,
  `healthStatus` int DEFAULT NULL,
  `respiratoryRate` int DEFAULT NULL,
  `bloodPressure` varchar(255) DEFAULT NULL,
  `urine` varchar(255) DEFAULT NULL,
  `patientID` int DEFAULT NULL,
  `sensorium` int DEFAULT NULL,
  `oxygenTherapy` int DEFAULT NULL,
  PRIMARY KEY (`recordID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- 11. ROOMPATIENT table
CREATE TABLE `roompatient` (
  `roomID` int NOT NULL,
  `patientID` int NOT NULL,
  PRIMARY KEY (`roomID`, `patientID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- 13. SCHEDULES table
CREATE TABLE `schedules` (
  `scheduleID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `date` date NOT NULL,
  `start_at` time NOT NULL,
  `working_hours` int NOT NULL,
  `nurseID` int NOT NULL,
  `roomID` int NOT NULL,
  `color` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`scheduleID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- 14. APPOINTMENT table
CREATE TABLE `appointment` (
  `appointmentID` INT NOT NULL AUTO_INCREMENT,
  `dateTime` DATE NOT NULL,
  `location` VARCHAR(255) DEFAULT NULL,

  -- 0 = Upcoming
  -- 1 = Completed (patient came)
  -- 2 = Missed (no-show)
  `attendanceStatus` TINYINT DEFAULT 0,

  `doctorID` INT DEFAULT NULL,
  `userID` INT DEFAULT NULL,

  PRIMARY KEY (`appointmentID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- 15. NEWS table
CREATE TABLE `news` (
  `newID` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) DEFAULT NULL,
  `body` varchar(500) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `author` varchar(45) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `isActive` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`newID`)
) ENGINE = InnoDB AUTO_INCREMENT = 5 DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci;
-- 16. SCHEDULEREQUEST table
CREATE TABLE `scheduleRequest` (
  `requestID` INT NOT NULL AUTO_INCREMENT,
  `scheduleID` INT NOT NULL,
  `reason` VARCHAR(1000) DEFAULT NULL,
  `newDate` DATE DEFAULT NULL,
  `status` TINYINT DEFAULT 0,
  -- 0 = Pending, 1 = Approved, 2 = Rejected
  PRIMARY KEY (`requestID`)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- 17. TESTRESULT tables
-- ======================================================
-- TEST TYPE
-- ======================================================
CREATE TABLE testtype (
  testTypeID INT AUTO_INCREMENT PRIMARY KEY,
  typeName VARCHAR(100) NOT NULL UNIQUE,
  description VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- ======================================================
-- TEST RESULT
-- ======================================================
CREATE TABLE testresult (
  testResultID INT AUTO_INCREMENT PRIMARY KEY,
  userID INT NOT NULL,
  testTypeID INT NOT NULL,
  doctorID INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  datetime DATETIME NOT NULL,
  testResultCode VARCHAR(50) NOT NULL UNIQUE,
  remarks TEXT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- ======================================================
-- TEST RESULT ITEMS
-- ======================================================
CREATE TABLE testresult_item (
  itemID INT AUTO_INCREMENT PRIMARY KEY,
  testResultID INT NOT NULL,
  parameterName VARCHAR(100) NOT NULL,
  resultValue VARCHAR(50),
  unit VARCHAR(30),
  referenceRange VARCHAR(50),
  abnormalFlag ENUM(
    'Normal',
    'High',
    'Low',
    'Critical'
  ) DEFAULT 'Normal',
  notes VARCHAR(500),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- ======================================================
-- MEDICINES
-- ======================================================
CREATE TABLE medicines (
  medicineID INT NOT NULL AUTO_INCREMENT,
  medicineName VARCHAR(150) NOT NULL,
  genericName VARCHAR(150) DEFAULT NULL,
  dosageForm VARCHAR(50) DEFAULT NULL,
  strength VARCHAR(50) DEFAULT NULL,
  description VARCHAR(500) DEFAULT NULL,
  isActive TINYINT(1) DEFAULT 1,
  PRIMARY KEY (medicineID)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- ======================================================
-- PRESCRIPTIONS
-- ======================================================
CREATE TABLE prescriptions (
  prescriptionID INT NOT NULL AUTO_INCREMENT,
  patientID INT NOT NULL,
  doctorID INT NOT NULL,
  diagnosis VARCHAR(1000) DEFAULT NULL,
  notes VARCHAR(1000) DEFAULT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (prescriptionID)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- ======================================================
-- PRESCRIPTION ITEMS
-- ======================================================
CREATE TABLE prescription_items (
  prescriptionItemID INT NOT NULL AUTO_INCREMENT,
  prescriptionID INT NOT NULL,
  medicineID INT NOT NULL,
  dosage VARCHAR(100) DEFAULT NULL,
  frequency VARCHAR(100) DEFAULT NULL,
  durationDays INT DEFAULT NULL,
  quantity INT DEFAULT NULL,
  instructions VARCHAR(500) DEFAULT NULL,
  PRIMARY KEY (prescriptionItemID)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- ======================================================
-- TREATMENT SHEET
-- ======================================================
CREATE TABLE treatment_sheet (
  sheetID INT AUTO_INCREMENT PRIMARY KEY,
  patientID INT NOT NULL,
  doctorID INT NULL,
  admissionNumber VARCHAR(50),
  patientCode VARCHAR(50),
  diagnosis TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- ======================================================
-- TREATMENT LOGS
-- ======================================================
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
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4;
-- ===================== ADD FOREIGN KEYS =====================
ALTER TABLE `userrole`
ADD CONSTRAINT `userrole_ibfk_1` FOREIGN KEY (`roleID`) REFERENCES `role` (`roleID`),
  ADD CONSTRAINT `userrole_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);
ALTER TABLE nurse
ADD CONSTRAINT fk_nurse_user FOREIGN KEY (userID) REFERENCES user(userID);
ALTER TABLE nurse
ADD CONSTRAINT fk_nurse_department FOREIGN KEY (departmentID) REFERENCES department(departmentID) ON DELETE
SET NULL ON UPDATE CASCADE;
ALTER TABLE doctor
ADD CONSTRAINT fk_doctor_user FOREIGN KEY (userID) REFERENCES user(userID);
ALTER TABLE doctor
ADD CONSTRAINT fk_doctor_department FOREIGN KEY (departmentID) REFERENCES department(departmentID) ON DELETE
SET NULL ON UPDATE CASCADE;
ALTER TABLE room
ADD CONSTRAINT fk_room_department FOREIGN KEY (departmentID) REFERENCES department(departmentID) ON DELETE
SET NULL ON UPDATE CASCADE;
ALTER TABLE patient
ADD CONSTRAINT fk_patient_user FOREIGN KEY (userID) REFERENCES user(userID);
ALTER TABLE roompatient
ADD CONSTRAINT fk_roompatient_room FOREIGN KEY (roomID) REFERENCES room(roomID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE roompatient
ADD CONSTRAINT fk_roompatient_patient FOREIGN KEY (patientID) REFERENCES patient(patientID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE medicalrecords
ADD CONSTRAINT fk_medicalrecords_patient FOREIGN KEY (patientID) REFERENCES patient(patientID);
ALTER TABLE `schedules`
ADD CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`nurseID`) REFERENCES `nurse` (`nurseID`),
  ADD CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`roomID`) REFERENCES `room` (`roomID`);
ALTER TABLE `appointment`
ADD CONSTRAINT `fk_appointment_doctor`
FOREIGN KEY (`doctorID`) REFERENCES `doctor`(`doctorID`)
ON DELETE SET NULL
ON UPDATE CASCADE;

ALTER TABLE `appointment`
ADD CONSTRAINT `fk_appointment_user`
FOREIGN KEY (`userID`) REFERENCES `user`(`userID`)
ON DELETE CASCADE
ON UPDATE CASCADE;
ALTER TABLE `scheduleRequest`
ADD CONSTRAINT `fk_schedule_request` FOREIGN KEY (`scheduleID`) REFERENCES `schedules` (`scheduleID`) ON DELETE CASCADE ON UPDATE CASCADE;
-- ======================================================
-- TEST RESULT FKs
-- ======================================================
ALTER TABLE testresult
ADD CONSTRAINT fk_testresult_user FOREIGN KEY (userID) REFERENCES user(userID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE testresult
ADD CONSTRAINT fk_testresult_type FOREIGN KEY (testTypeID) REFERENCES testtype(testTypeID) ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE testresult
ADD CONSTRAINT fk_testresult_doctor FOREIGN KEY (doctorID) REFERENCES doctor(doctorID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE testresult_item
ADD CONSTRAINT fk_testresult_item FOREIGN KEY (testResultID) REFERENCES testresult(testResultID) ON DELETE CASCADE ON UPDATE CASCADE;
-- ======================================================
-- PRESCRIPTION FKs
-- ======================================================
ALTER TABLE prescriptions
ADD CONSTRAINT fk_prescription_patient FOREIGN KEY (patientID) REFERENCES patient(patientID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE prescriptions
ADD CONSTRAINT fk_prescription_doctor FOREIGN KEY (doctorID) REFERENCES doctor(doctorID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE prescription_items
ADD CONSTRAINT fk_prescription_items_prescription FOREIGN KEY (prescriptionID) REFERENCES prescriptions(prescriptionID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE prescription_items
ADD CONSTRAINT fk_prescription_items_medicine FOREIGN KEY (medicineID) REFERENCES medicines(medicineID) ON DELETE CASCADE ON UPDATE CASCADE;
-- ======================================================
-- TREATMENT SHEET FKs
-- ======================================================
ALTER TABLE treatment_sheet
ADD CONSTRAINT fk_treatment_sheet_patient FOREIGN KEY (patientID) REFERENCES patient(patientID) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE treatment_sheet
ADD CONSTRAINT fk_treatment_sheet_doctor FOREIGN KEY (doctorID) REFERENCES doctor(doctorID) ON DELETE
SET NULL ON UPDATE CASCADE;
ALTER TABLE treatment_logs
ADD CONSTRAINT fk_treatment_logs_sheet FOREIGN KEY (sheetID) REFERENCES treatment_sheet(sheetID) ON DELETE CASCADE ON UPDATE CASCADE;