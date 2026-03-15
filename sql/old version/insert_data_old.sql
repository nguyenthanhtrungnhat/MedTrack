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
(4,1,4),
(5,666,5);

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