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
-- ===================== INSERT DATA =====================

-- 1. USER table
INSERT INTO `user` (`userID`,`username`,`password`,`fullName`,`dob`,`phone`,`email`,`CIC`,`address`,`gender`) VALUES
(1,'nguyen thanh trung nhat','1','nguyen thanh trung nhat','1999-02-28','0922639956','nhat@gmail.com','1212312312312','28/17 khu 5 p. Binh Duong tp. HCM',1),
(2,'Phan dinh hieu thao','1','Phan dinh hieu thao','1999-02-28','13123','thao@gmail.com','123123','23123',1),
(3,'Huyen Thanh','1','Huyen Thanh','1999-11-01','1231231231','huyen@gmail.com','123','13123',2),
(4,'Phu Tan','1','Dang Phu Tan',NULL,NULL,'tan@gmail.com',NULL,NULL,NULL);

-- 2. ROLE table
INSERT INTO `role` (`roleID`,`nameRole`) VALUES 
(1,'Doctor'),(2,'Nurse'),(3,'Patient'),(666,'Admin');

-- 3. USERROLE table
INSERT INTO `userrole` (`userRoleID`,`roleID`,`userID`) VALUES
(1,2,1),
(2,3,2),
(3,3,3),
(4,1,4);

-- 4. ROOM table  
INSERT INTO `room` (`roomID`,`department`,`location`) VALUES
(1,'Internal Medicine','208B11');

-- 5. NURSE table
INSERT INTO `nurse` (`nurseID`,`department`,`userID`,`roomID`,`image`) VALUES
(1,'Internal Medicine',1,1,'https://tse4.mm.bing.net/th/id/OIP.I4ONtW54x0A04VokgBzbTgHaHo');

-- 6. DOCTOR table
INSERT INTO `doctor` (`doctorID`,`department`,`nurseID`,`userID`,`requestID`,`office`) VALUES
(1,NULL,NULL,4,NULL,'301B10');

-- 7. REQUEST table
INSERT INTO `request` (`requestID`,`dateTime`,`requestContent`,`requestStatus`,`nurseID`,`doctorID`,`requestType`) VALUES
(1,'2025-10-20 09:00:00','Sample request',0,1,1,1);

-- 8. FEEDBACK table
INSERT INTO `feedback` (`feedBackID`,`feedBackForFacility`,`feedBackForDoctor`,`feedBackForNurse`) VALUES
(1,'Good service','Good doctor','Good nurse'),
(2,'Average facility','Average doctor','Average nurse'),
(3,'Poor service','Poor doctor','Poor nurse');

-- 9. PATIENT table
INSERT INTO `patient` (`patientID`,`HI`,`admissionDate`,`dischargeDate`,`hospitalizationsDiagnosis`,`summaryCondition`,`dischargeDiagnosis`,`relativeName`,`relativeNumber`,`userID`,`feedBackID`,`image`) VALUES
(1,'123123123123','1999-02-27 17:00:00','1999-02-27 17:00:00','asdadasd','asdasdasd','asdasdasda','adasd',12312,2,2,'img'),
(2,'1231313123','1999-02-27 17:00:00','1999-02-27 17:00:00','asdasdaadsadasd','asdad','asdasdasd','asdasd',2323,3,3,NULL);

-- 10. MEDICAL RECORDS table
INSERT INTO `medicalrecords` (`recordID`,`timeCreate`,`heartRate`,`pulse`,`height`,`weight`,`hurtScale`,`temperature`,`currentCondition`,`SP02`,`healthStatus`,`respiratoryRate`,`bloodPressure`,`urine`,`patientID`,`sensorium`,`oxygenTherapy`) VALUES
(37,'2025-10-20 16:31:11',140,76,175,75,0,'34','','90',1,55,'140/76','0',1,1,20);

-- 11. ROOMPATIENT table
INSERT INTO `roompatient` (`roomID`,`patientID`) VALUES
(1,1),
(1,2);

-- 12. NURSEPATIENT table
INSERT INTO `nursepatient` (`nurseID`,`patientID`) VALUES
(1,1),
(1,2);

-- 13. SCHEDULES table
INSERT INTO `schedules` (`scheduleID`,`name`,`date`,`start_at`,`working_hours`,`nurseID`,`roomID`,`color`) VALUES
(1,'sdadasd','2025-10-20','22:00:00',3,1,1,'pink'),
(2,'AI','2025-10-21','09:30:00',2,1,1,'green');

-- 14. APPOINTMENT table
INSERT INTO `appointment` (`appointmentID`,`dateTime`,`location`,`appointmentStatus`,`doctorID`,`userID`) VALUES
(1,'2025-10-22','208B11',0,1,2),
(2,'2025-10-23','208B11',0,1,3);

-- 14. NEWS table
INSERT INTO `news` (`newID`, `title`, `body`, `date`, `author`, `image`) VALUES
(1, '11th BIH Voluntary Blood Donation', NULL, '2025-08-18', NULL, './images/banner2.webp'),
(2, 'Spreading Knowledge – Celebrating Vietnamese Women''s Day 20/10', NULL, '2025-10-20', NULL, './images/banner4.webp'),
(3, 'Signing ceremony of cooperation with Ho Chi Minh City Oncology Hospital', NULL, '2025-09-11', NULL, './images/banner3.webp'),
(4, 'Health Club No. 4 – 2025: When Breath is Short – How to Live Longer?', NULL, '2025-10-28', NULL, './images/banner1.webp');

-- 15. NEWS table
INSERT INTO `testresult`
(`userID`, `title`, `datetime`, `testResultCode`, `status`, `type`,
 `bloodGlucose`, `HbA1c`, `totalCholesterol`, `hdlCholesterol`, `ldlCholesterol`)
VALUES
(2, 'Annual Health Check', '2026-02-28 08:30:00', 'TR-1001', 'Completed', 'Laboratory',
 95.50, 5.40, 180.00, 50.00, 95.00),

(2, 'Diabetes Screening', '2026-01-10 09:15:00', 'TR-1002', 'Completed', 'Laboratory',
 110.20, 6.10, 195.00, 45.00, 120.00),

(2, 'Cardiac Risk Test', '2026-02-15 14:00:00', 'TR-2001', 'Completed', 'Laboratory',
 89.00, 5.20, 210.00, 38.00, 140.00),

(3, 'Routine Blood Test', '2026-02-25 11:45:00', 'TR-2002', 'Pending', 'Laboratory',
 NULL, NULL, NULL, NULL, NULL),

(3, 'Cholesterol Follow-up', '2026-02-05 10:30:00', 'TR-3001', 'Failed', 'Laboratory',
 100.00, 5.80, 205.00, 42.00, 130.00);