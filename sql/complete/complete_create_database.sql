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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. ROLE table
CREATE TABLE `role` (
  `roleID` int NOT NULL AUTO_INCREMENT,
  `nameRole` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`roleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. USERROLE table
CREATE TABLE `userrole` (
  `userRoleID` int NOT NULL AUTO_INCREMENT,
  `roleID` int DEFAULT NULL,
  `userID` int DEFAULT NULL,
  PRIMARY KEY (`userRoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. ROOM table
CREATE TABLE `room` (
  `roomID` int NOT NULL AUTO_INCREMENT,
  `department` varchar(100) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`roomID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. NURSE table
CREATE TABLE `nurse` (
  `nurseID` int NOT NULL AUTO_INCREMENT,
  `department` varchar(100) DEFAULT NULL,
  `userID` int DEFAULT NULL,
  `roomID` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`nurseID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. DOCTOR table
CREATE TABLE `doctor` (
  `doctorID` int NOT NULL AUTO_INCREMENT,
  `department` varchar(100) DEFAULT NULL,
  `nurseID` int DEFAULT NULL,
  `userID` int DEFAULT NULL,
  `requestID` int DEFAULT NULL,
  `office` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`doctorID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. REQUEST table
CREATE TABLE `request` (
  `requestID` int NOT NULL AUTO_INCREMENT,
  `dateTime` timestamp NULL DEFAULT NULL,
  `requestContent` varchar(1000) DEFAULT NULL,
  `requestStatus` int DEFAULT NULL,
  `nurseID` int DEFAULT NULL,
  `doctorID` int DEFAULT NULL,
  `requestType` int DEFAULT NULL,
  PRIMARY KEY (`requestID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. FEEDBACK table
CREATE TABLE `feedback` (
  `feedBackID` int NOT NULL AUTO_INCREMENT,
  `feedBackForFacility` varchar(2000) DEFAULT NULL,
  `feedBackForDoctor` varchar(2000) DEFAULT NULL,
  `feedBackForNurse` varchar(2000) DEFAULT NULL,
  PRIMARY KEY (`feedBackID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. PATIENT table
CREATE TABLE `patient` (
  `patientID` int NOT NULL AUTO_INCREMENT,
  `HI` varchar(100) DEFAULT NULL,
  `admissionDate` timestamp NULL DEFAULT NULL,
  `dischargeDate` timestamp NULL DEFAULT NULL,
  `hospitalizationsDiagnosis` varchar(2000) DEFAULT NULL,
  `summaryCondition` varchar(2000) DEFAULT NULL,
  `dischargeDiagnosis` varchar(2000) DEFAULT NULL,
  `relativeName` varchar(255) DEFAULT NULL,
  `relativeNumber` int DEFAULT NULL,
  `userID` int NOT NULL,
  `feedBackID` int DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`patientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. ROOMPATIENT table
CREATE TABLE `roompatient` (
  `roomID` int NOT NULL,
  `patientID` int NOT NULL,
  PRIMARY KEY (`roomID`,`patientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. NURSEPATIENT table
CREATE TABLE `nursepatient` (
  `nurseID` int NOT NULL,
  `patientID` int NOT NULL,
  PRIMARY KEY (`nurseID`,`patientID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. APPOINTMENT table
CREATE TABLE `appointment` (
  `appointmentID` int NOT NULL AUTO_INCREMENT,
  `dateTime` date DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `appointmentStatus` tinyint DEFAULT '0',
  `doctorID` int DEFAULT NULL,
  `userID` int DEFAULT NULL,
  PRIMARY KEY (`appointmentID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- 16. SCHEDULEREQUEST table
CREATE TABLE `scheduleRequest` (
    `requestID` INT NOT NULL AUTO_INCREMENT,
    `scheduleID` INT NOT NULL,
    `reason` VARCHAR(1000) DEFAULT NULL,
    `newDate` DATE DEFAULT NULL,
    `status` TINYINT DEFAULT 0,               -- 0 = Pending, 1 = Approved, 2 = Rejected
    PRIMARY KEY (`requestID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. TESTRESULT table
CREATE TABLE `testresult` (
  `testResultID` INT NOT NULL AUTO_INCREMENT,
  `userID` INT NOT NULL,

  `title` VARCHAR(255) NOT NULL,
  `datetime` DATETIME NOT NULL,
  `testResultCode` VARCHAR(50) NOT NULL UNIQUE,
  `status` ENUM('Completed', 'Pending', 'Failed') 
      NOT NULL DEFAULT 'Pending',
  `type` VARCHAR(100) NOT NULL,

  `bloodGlucose` DECIMAL(5,2) NULL,
  `HbA1c` DECIMAL(4,2) NULL,
  `totalCholesterol` DECIMAL(5,2) NULL,
  `hdlCholesterol` DECIMAL(5,2) NULL,
  `ldlCholesterol` DECIMAL(5,2) NULL,

  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
      ON UPDATE CURRENT_TIMESTAMP,

  PRIMARY KEY (`testResultID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE INDEX `idx_testresult_userID`
ON `testresult` (`userID`);

-- 18. MEDICINES table
CREATE TABLE `medicines` (
  `medicineID` INT NOT NULL AUTO_INCREMENT,
  `medicineName` VARCHAR(150) NOT NULL,
  `genericName` VARCHAR(150) DEFAULT NULL,
  `dosageForm` VARCHAR(50) DEFAULT NULL,     -- Tablet, Capsule, Syrup, Injection
  `strength` VARCHAR(50) DEFAULT NULL,       -- 500mg, 250mg/5ml
  `description` VARCHAR(500) DEFAULT NULL,
  `isActive` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`medicineID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19. PRESCRIPTIONS table
CREATE TABLE `prescriptions` (
  `prescriptionID` INT NOT NULL AUTO_INCREMENT,
  `patientID` INT NOT NULL,
  `doctorID` INT NOT NULL,
  `diagnosis` VARCHAR(1000) DEFAULT NULL,
  `notes` VARCHAR(1000) DEFAULT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`prescriptionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 20. PRESCRIPTION_ITEMS table
CREATE TABLE `prescription_items` (
  `prescriptionItemID` INT NOT NULL AUTO_INCREMENT,
  `prescriptionID` INT NOT NULL,
  `medicineID` INT NOT NULL,
  `dosage` VARCHAR(100) DEFAULT NULL,       -- 1 tablet
  `frequency` VARCHAR(100) DEFAULT NULL,    -- 3 times/day
  `durationDays` INT DEFAULT NULL,          -- number of days
  `quantity` INT DEFAULT NULL,              -- total pills
  `instructions` VARCHAR(500) DEFAULT NULL, -- after meals, before sleep
  PRIMARY KEY (`prescriptionItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===================== ADD FOREIGN KEYS =====================

ALTER TABLE `userrole`
  ADD CONSTRAINT `userrole_ibfk_1` FOREIGN KEY (`roleID`) REFERENCES `role` (`roleID`),
  ADD CONSTRAINT `userrole_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

ALTER TABLE `nurse`
  ADD CONSTRAINT `nurse_ibfk_3` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`),
  ADD CONSTRAINT `nurse_ibfk_4` FOREIGN KEY (`roomID`) REFERENCES `room` (`roomID`);

ALTER TABLE `doctor`
  ADD CONSTRAINT `doctor_ibfk_1` FOREIGN KEY (`nurseID`) REFERENCES `nurse` (`nurseID`),
  ADD CONSTRAINT `doctor_ibfk_3` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`),
  ADD CONSTRAINT `fk_doctor_request` FOREIGN KEY (`requestID`) REFERENCES `request` (`requestID`) ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE `request`
  ADD CONSTRAINT `request_ibfk_1` FOREIGN KEY (`nurseID`) REFERENCES `nurse` (`nurseID`),
  ADD CONSTRAINT `request_ibfk_2` FOREIGN KEY (`doctorID`) REFERENCES `doctor` (`doctorID`);

ALTER TABLE `patient`
  ADD CONSTRAINT `patient_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`),
  ADD CONSTRAINT `patient_ibfk_7` FOREIGN KEY (`feedBackID`) REFERENCES `feedback` (`feedBackID`);

ALTER TABLE `medicalrecords`
  ADD CONSTRAINT `fk_patient` FOREIGN KEY (`patientID`) REFERENCES `patient` (`patientID`);

ALTER TABLE `roompatient`
  ADD CONSTRAINT `roompatient_ibfk_1` FOREIGN KEY (`roomID`) REFERENCES `room` (`roomID`) ON DELETE CASCADE,
  ADD CONSTRAINT `roompatient_ibfk_2` FOREIGN KEY (`patientID`) REFERENCES `patient` (`patientID`) ON DELETE CASCADE;

ALTER TABLE `nursepatient`
  ADD CONSTRAINT `nursepatient_ibfk_1` FOREIGN KEY (`nurseID`) REFERENCES `nurse` (`nurseID`) ON DELETE CASCADE,
  ADD CONSTRAINT `nursepatient_ibfk_2` FOREIGN KEY (`patientID`) REFERENCES `patient` (`patientID`) ON DELETE CASCADE;

ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_ibfk_1` FOREIGN KEY (`nurseID`) REFERENCES `nurse` (`nurseID`),
  ADD CONSTRAINT `schedules_ibfk_2` FOREIGN KEY (`roomID`) REFERENCES `room` (`roomID`);

ALTER TABLE `appointment`
  ADD CONSTRAINT `appointment_ibfk_1` FOREIGN KEY (`doctorID`) REFERENCES `doctor` (`doctorID`),
  ADD CONSTRAINT `appointment_ibfk_2` FOREIGN KEY (`userID`) REFERENCES `user` (`userID`);

ALTER TABLE `scheduleRequest`
  ADD CONSTRAINT `fk_schedule_request`
  FOREIGN KEY (`scheduleID`) REFERENCES `schedules` (`scheduleID`)
  ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `testresult`
ADD CONSTRAINT `fk_testresult_user`
FOREIGN KEY (`userID`)
REFERENCES `user`(`userID`) 
ON DELETE CASCADE
ON UPDATE CASCADE;

ALTER TABLE `prescriptions`
ADD CONSTRAINT `fk_prescription_patient`
FOREIGN KEY (`patientID`) REFERENCES `patient`(`patientID`)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `prescriptions`
ADD CONSTRAINT `fk_prescription_doctor`
FOREIGN KEY (`doctorID`) REFERENCES `doctor`(`doctorID`)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `prescription_items`
ADD CONSTRAINT `fk_prescription_items_prescription`
FOREIGN KEY (`prescriptionID`)
REFERENCES `prescriptions`(`prescriptionID`)
ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `prescription_items`
ADD CONSTRAINT `fk_prescription_items_medicine`
FOREIGN KEY (`medicineID`)
REFERENCES `medicines`(`medicineID`)
ON DELETE CASCADE ON UPDATE CASCADE;
