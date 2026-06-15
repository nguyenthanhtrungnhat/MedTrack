USE hospitaldb;

-- ======================================================
-- ROLE
-- ======================================================
INSERT INTO role (nameRole) VALUES
('Doctor'),
('Nurse'),
('Patient'),
('Admin');

-- ======================================================
-- USER
-- ======================================================
INSERT INTO user (username, password, fullName, dob, phone, email, CIC, address, gender)
VALUES
('admin', '123', 'System Admin', '1990-01-01', '0900000000', 'admin@hospital.com', 'CIC001', 'HCM', 1),
('dr.alice', '123', 'Dr Alice Nguyen', '1985-06-12', '0911111111', 'alice@hospital.com', 'CIC002', 'HCM', 0),
('dr.bob', '123', 'Dr Bob Tran', '1980-02-20', '0922222222', 'bob@hospital.com', 'CIC003', 'HCM', 1),
('nurse.lan', '123', 'Nurse Lan Pham', '1995-09-10', '0933333333', 'lan@hospital.com', 'CIC004', 'HCM', 0),
('patient.charlie', '123', 'Charlie Le', '2000-09-15', '0944444444', 'charlie@hospital.com', 'CIC005', 'HCM', 1),
('patient.david', '123', 'David Nguyen', '1998-03-10', '0955555555', 'david@hospital.com', 'CIC006', 'HCM', 1);

-- ======================================================
-- USER ROLE
-- ======================================================
INSERT INTO userrole (roleID, userID) VALUES
(4, 1),
(1, 2),
(1, 3),
(2, 4),
(3, 5),
(3, 6);

-- ======================================================
-- DEPARTMENT
-- ======================================================
INSERT INTO department (departmentCode, departmentName, description, location)
VALUES
('CARD', 'Cardiology', 'Heart department', 'Block A'),
('NEUR', 'Neurology', 'Brain department', 'Block B'),
('ORTH', 'Orthopedics', 'Bone department', 'Block C');

-- ======================================================
-- ROOM
-- ======================================================
INSERT INTO room (departmentID, location)
VALUES
(1, 'A101'),
(1, 'A102'),
(2, 'B201'),
(3, 'C301');

-- ======================================================
-- DOCTOR (AVATAR LINKS)
-- ======================================================
INSERT INTO doctor (departmentID, userID, office, image)
VALUES
(1, 2, 'Office 101', 'https://i.pravatar.cc/300?img=12'),
(2, 3, 'Office 202', 'https://i.pravatar.cc/300?img=15');

-- ======================================================
-- NURSE
-- ======================================================
INSERT INTO nurse (departmentID, userID, image)
VALUES
(1, 4, 'https://i.pravatar.cc/300?img=22');

-- ======================================================
-- PATIENT
-- ======================================================
INSERT INTO patient (HI, relativeName, relativeNumber, userID, image)
VALUES
('HI001', 'Mrs A', '0909999999', 5, 'https://i.pravatar.cc/300?img=5'),
('HI002', 'Mr B', '0918888888', 6, 'https://i.pravatar.cc/300?img=6');

-- ======================================================
-- ADMISSION
-- ======================================================
INSERT INTO admission (patientID, hospitalizationsDiagnosis, summaryCondition, status)
VALUES
(1, 'Flu and fever', 'Stable condition', 'Admitted'),
(2, 'Headache and dizziness', 'Under observation', 'Admitted');

-- ======================================================
-- CLINICAL EXAMINATION
-- ======================================================
INSERT INTO clinical_examinations
(admissionID, doctorID, height, weight, bloodPressure, heartRate, temperature, generalCondition, symptoms, diagnosis)
VALUES
(1, 1, 170, 65, '120/80', 78, 37.2, 'Good', 'Fever', 'Viral infection'),
(2, 2, 165, 60, '118/75', 82, 36.9, 'Stable', 'Headache', 'Migraine');

-- ======================================================
-- MEDICAL RECORDS
-- ======================================================
INSERT INTO medicalrecords
(admissionID, heartRate, pulse, painScale, temperature, SPo2, respiratoryRate, bloodPressure, urine, sensorium, oxygenTherapy, currentCondition)
VALUES
(1, 78, 80, 2, '37.2', '98%', 18, '120/80', 'Normal', 1, 0, 'Stable'),
(2, 82, 85, 4, '36.9', '97%', 20, '118/75', 'Normal', 1, 0, 'Observation');

-- ======================================================
-- APPOINTMENT
-- ======================================================
INSERT INTO appointment (dateTime, location, attendanceStatus, doctorID, userID)
VALUES
('2026-06-16', 'Room A101', 0, 1, 5),
('2026-06-17', 'Room B201', 1, 2, 6);

-- ======================================================
-- NEWS (AVATAR STYLE IMAGES)
-- ======================================================
INSERT INTO news (title, body, date, author, image)
VALUES
('Hospital Update', 'New equipment installed', '2026-06-01', 'Admin', 'https://i.pravatar.cc/300?img=30'),
('Health Tips', 'Drink water daily', '2026-06-10', 'Dr Alice', 'https://i.pravatar.cc/300?img=31');

-- ======================================================
-- SCHEDULES
-- ======================================================
INSERT INTO schedules (name, date, start_at, working_hours, nurseID, roomID, color)
VALUES
('Morning Shift', '2026-06-15', '08:00:00', 8, 1, 1, 'blue'),
('Night Shift', '2026-06-15', '20:00:00', 8, 1, 2, 'red');

-- ======================================================
-- TEST TYPE
-- ======================================================
INSERT INTO testtype (typeName, description)
VALUES
('Blood Test', 'Basic blood analysis'),
('Urine Test', 'Urine analysis');

-- ======================================================
-- DOCTOR ORDER
-- ======================================================
INSERT INTO doctororder (userID, doctorID, testTypeID, diagnosisNote)
VALUES
(5, 1, 1, 'Check infection'),
(6, 2, 2, 'Routine check');

-- ======================================================
-- TEST RESULT
-- ======================================================
INSERT INTO testresult (orderID, title, datetime, testResultCode, remarks)
VALUES
(1, 'Blood Result', NOW(), 'TR001', 'Normal'),
(2, 'Urine Result', NOW(), 'TR002', 'Slight abnormal');

-- ======================================================
-- TEST TYPE ITEM
-- ======================================================
INSERT INTO testtype_item (testTypeID, parameterName, unit, referenceRange)
VALUES
(1, 'WBC', '10^9/L', '4-11'),
(2, 'pH', '', '5-7');

-- ======================================================
-- TEST RESULT ITEM
-- ======================================================
INSERT INTO testresult_item (testResultID, testTypeItemID, resultValue, unit, referenceRange, abnormalFlag)
VALUES
(1, 1, '7.2', '10^9/L', '4-11', 'Normal'),
(2, 2, '6.5', '', '5-7', 'Normal');

-- ======================================================
-- MEDICINES
-- ======================================================
INSERT INTO medicines (medicineName, genericName, dosageForm, strength, description)
VALUES
('Paracetamol', 'Acetaminophen', 'Tablet', '500mg', 'Pain relief'),
('Amoxicillin', 'Amoxicillin', 'Capsule', '250mg', 'Antibiotic');

-- ======================================================
-- PRESCRIPTIONS
-- ======================================================
INSERT INTO prescriptions (patientID, doctorID, diagnosis, notes)
VALUES
(1, 1, 'Flu', 'Rest and drink water'),
(2, 2, 'Migraine', 'Avoid stress');

-- ======================================================
-- PRESCRIPTION ITEMS
-- ======================================================
INSERT INTO prescription_items (prescriptionID, medicineID, dosage, frequency, durationDays, quantity, instructions)
VALUES
(1, 1, '500mg', '2 times/day', 5, 10, 'After meal'),
(2, 2, '250mg', '3 times/day', 7, 21, 'Before meal');

-- ======================================================
-- TREATMENT SHEET
-- ======================================================
INSERT INTO treatment_sheet (patientID, doctorID, admissionNumber, patientCode, diagnosis)
VALUES
(1, 1, 'ADM001', 'P001', 'Flu treatment'),
(2, 2, 'ADM002', 'P002', 'Migraine treatment');

-- ======================================================
-- TREATMENT LOGS
-- ======================================================
INSERT INTO treatment_logs (sheetID, logTime, subjective, objective, assessment, plan, instruction)
VALUES
(1, '08:00:00', 'Weak', 'Temp 37.2', 'Stable', 'Rest', 'Drink water'),
(2, '09:00:00', 'Headache', 'BP normal', 'Improving', 'Medication', 'Avoid screen');