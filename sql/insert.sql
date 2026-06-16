-- USERS
INSERT INTO `user` (
        `userID`,
        `username`,
        `password`,
        `fullName`,
        `dob`,
        `phone`,
        `email`,
        `CIC`,
        `address`,
        `gender`
    )
VALUES (
        1,
        'nhat.nguyen',
        '1',
        'Nguyen Thanh Trung Nhat',
        '1999-02-28',
        '0922639956',
        'nhat.nguyen@gmail.com',
        '079199012345',
        '28/17 Khu 5, Binh Duong Ward, Ho Chi Minh City',
        1
    ),
    (
        2,
        'thao.phan',
        '1',
        'Phan Dinh Hieu Thao',
        '1998-07-15',
        '0913456789',
        'thao.phan@gmail.com',
        '079198076543',
        '125 Nguyen Trai Street, District 1, Ho Chi Minh City',
        1
    ),
    (
        3,
        'huyen.thanh',
        '1',
        'Thanh Huyen',
        '1999-11-01',
        '0938765432',
        'huyen.thanh@gmail.com',
        '079199098765',
        '89 Le Loi Street, District 3, Ho Chi Minh City',
        2
    ),
    (
        4,
        'tan.dang',
        '1',
        'Dang Phu Tan',
        '2000-04-10',
        '0905678123',
        'tan.dang@gmail.com',
        '079200045678',
        '45 Tran Hung Dao Street, District 5, Ho Chi Minh City',
        1
    ),
    (
        5,
        'admin.nhat',
        '1',
        'Admin Nhat',
        '1999-11-01',
        '0938765432',
        'admin.nhat@gmail.com',
        '079185098765',
        '89 Le Loi Street, District 3, Ho Chi Minh City',
        1
    );
-- ROLE table
INSERT INTO `role` (`roleID`, `nameRole`)
VALUES (1, 'Doctor'),
    (2, 'Nurse'),
    (3, 'Patient'),
    (666, 'Admin');
-- DEPARTMENT table
INSERT INTO department (
        departmentID,
        departmentCode,
        departmentName,
        description,
        location
    )
VALUES (
        1,
        'IM',
        'Internal Medicine',
        'General Internal Medicine Department',
        'Building A'
    ),
    (
        2,
        'CARD',
        'Cardiology',
        'Heart and Cardiovascular Treatment',
        'Building B'
    ),
    (
        3,
        'ENDO',
        'Endocrinology',
        'Diabetes and Hormonal Disorders',
        'Building C'
    ),
    (
        4,
        'PED',
        'Pediatrics',
        'Children Healthcare Department',
        'Building D'
    ),
    (
        5,
        'EMR',
        'Emergency',
        'Emergency Treatment Department',
        'Ground Floor'
    );
-- USERROLE table
INSERT INTO `userrole` (`userRoleID`, `roleID`, `userID`)
VALUES (1, 2, 1),
    (2, 3, 2),
    (3, 3, 3),
    (4, 1, 4),
    (5, 666, 5);
-- ROOM table  
INSERT INTO room (roomID, departmentID, location)
VALUES 
    (1, 1, 'Room 101'), (2, 1, 'Room 102'), (3, 1, 'Room 103'),
    (4, 2, 'Room 201'), (5, 2, 'Room 202'), (6, 2, 'Room 203'),
    (7, 3, 'Room 301'), (8, 3, 'Room 302'), (9, 3, 'Room 303');
-- NURSE
INSERT INTO nurse (nurseID, departmentID, userID, image)
VALUES (1, 1, 1, 'https://i.pravatar.cc/300?img=8');
-- DOCTOR
INSERT INTO doctor (doctorID, departmentID, userID, office, image)
VALUES (
        1,
        1,
        4,
        '301B10',
        'https://i.pravatar.cc/300?img=9'
    );
-- PATIENT
INSERT INTO patient (
        patientID,
        HI,
        relativeName,
        relativeNumber,
        userID,
        image
    )
VALUES (
        1,
        'HI-2026-001',
        'Tran Van Minh',
        '0903123456',
        2,
        'https://i.pravatar.cc/300?img=12'
    ),
    (
        2,
        'HI-2026-002',
        'Le Thi Huong',
        '0912345678',
        3,
        'https://i.pravatar.cc/300?img=15'
    );
-- BED
INSERT INTO `bed` (`roomID`, `bedNumber`, `status`, `patientID`) VALUES
    (1, 'Bed 1', 'In Use', 1), (1, 'Bed 2', 'In Use', 2), (1, 'Bed 3', 'Empty', NULL), (1, 'Bed 4', 'Empty', NULL), (1, 'Bed 5', 'Empty', NULL), (1, 'Bed 6', 'Empty', NULL),
    (2, 'Bed 1', 'Empty', NULL), (2, 'Bed 2', 'Empty', NULL), (2, 'Bed 3', 'Empty', NULL), (2, 'Bed 4', 'Empty', NULL), (2, 'Bed 5', 'Empty', NULL), (2, 'Bed 6', 'Empty', NULL),
    (3, 'Bed 1', 'Empty', NULL), (3, 'Bed 2', 'Empty', NULL), (3, 'Bed 3', 'Empty', NULL), (3, 'Bed 4', 'Empty', NULL), (3, 'Bed 5', 'Empty', NULL), (3, 'Bed 6', 'Empty', NULL),
    (4, 'Bed 1', 'Empty', NULL), (4, 'Bed 2', 'Empty', NULL), (4, 'Bed 3', 'Empty', NULL), (4, 'Bed 4', 'Empty', NULL), (4, 'Bed 5', 'Empty', NULL), (4, 'Bed 6', 'Empty', NULL),
    (5, 'Bed 1', 'Empty', NULL), (5, 'Bed 2', 'Empty', NULL), (5, 'Bed 3', 'Empty', NULL), (5, 'Bed 4', 'Empty', NULL), (5, 'Bed 5', 'Empty', NULL), (5, 'Bed 6', 'Empty', NULL),
    (6, 'Bed 1', 'Empty', NULL), (6, 'Bed 2', 'Empty', NULL), (6, 'Bed 3', 'Empty', NULL), (6, 'Bed 4', 'Empty', NULL), (6, 'Bed 5', 'Empty', NULL), (6, 'Bed 6', 'Empty', NULL),
    (7, 'Bed 1', 'Empty', NULL), (7, 'Bed 2', 'Empty', NULL), (7, 'Bed 3', 'Empty', NULL), (7, 'Bed 4', 'Empty', NULL), (7, 'Bed 5', 'Empty', NULL), (7, 'Bed 6', 'Empty', NULL),
    (8, 'Bed 1', 'Empty', NULL), (8, 'Bed 2', 'Empty', NULL), (8, 'Bed 3', 'Empty', NULL), (8, 'Bed 4', 'Empty', NULL), (8, 'Bed 5', 'Empty', NULL), (8, 'Bed 6', 'Empty', NULL),
    (9, 'Bed 1', 'Empty', NULL), (9, 'Bed 2', 'Empty', NULL), (9, 'Bed 3', 'Empty', NULL), (9, 'Bed 4', 'Empty', NULL), (9, 'Bed 5', 'Empty', NULL), (9, 'Bed 6', 'Empty', NULL);

-- ADMISSION
INSERT INTO `admission` (
    `admissionID`, `patientID`, `doctorID`, `departmentID`, `admissionRecordCode`, `priority`, `advanceFee`, `advanceFeeStatus`, `admissionDate`, `hospitalizationsDiagnosis`, `summaryCondition`, `dischargeID`, `status`
) VALUES 
    (1, 1, 1, 1, 'BA-2026-001', 'Normal', 5000000, 'Paid', '2026-03-01 09:00:00', 'Hypertension', 'Patient stabilized after medication', NULL, 'In-treatment'),
    (2, 2, 1, 1, 'BA-2026-002', 'Urgent', 10000000, 'Paid', '2026-03-02 11:00:00', 'Type 2 Diabetes', 'Condition improved with insulin therapy', NULL, 'In-treatment');

-- SCHEDULES
INSERT INTO `schedules` (
        `scheduleID`,
        `name`,
        `date`,
        `start_at`,
        `working_hours`,
        `nurseID`,
        `roomID`,
        `color`
    )
VALUES (
        1,
        'Morning Patient Monitoring',
        '2026-03-15',
        '08:00:00',
        4,
        1,
        1,
        'green'
    ),
    (
        2,
        'Evening Medication Round',
        '2026-03-15',
        '18:00:00',
        3,
        1,
        1,
        'blue'
    ),
    (
        3,
        'Morning Vital Check',
        '2026-03-16',
        '08:00:00',
        4,
        1,
        1,
        'green'
    ),
    (
        4,
        'Patient Medication Round',
        '2026-03-16',
        '13:00:00',
        3,
        1,
        1,
        'blue'
    ),
    (
        5,
        'Evening Patient Monitoring',
        '2026-03-16',
        '18:00:00',
        3,
        1,
        1,
        'purple'
    ),
    (
        6,
        'Morning Ward Inspection',
        '2026-03-17',
        '08:30:00',
        4,
        1,
        1,
        'green'
    ),
    (
        7,
        'Afternoon Treatment Support',
        '2026-03-17',
        '14:00:00',
        3,
        1,
        1,
        'orange'
    ),
    (
        8,
        'Night Observation',
        '2026-03-17',
        '20:00:00',
        4,
        1,
        1,
        'red'
    ),
    (
        9,
        'Patient Health Assessment',
        '2026-03-18',
        '09:00:00',
        4,
        1,
        1,
        'green'
    ),
    (
        10,
        'Medication Distribution',
        '2026-03-18',
        '13:30:00',
        3,
        1,
        1,
        'blue'
    );
-- APPOINTMENTS
INSERT INTO `appointment` (
        `appointmentID`,
        `dateTime`,
        `location`,
        `attendanceStatus`,
        `doctorID`,
        `userID`
    )
VALUES -- TODAY (2026-03-15)
    (4, '2026-03-15', 'Room 208B11', 0, 1, 2),
    (5, '2026-03-15', 'Room 208B11', 0, 1, 3),
    (6, '2026-03-15', 'Room 301B10', 0, 1, 2),
    (7, '2026-03-15', 'Room 301B10', 0, 1, 3),
    (8, '2026-03-15', 'Room 208B11', 0, 1, 2),
    -- UPCOMING
    (9, '2026-03-18', 'Room 208B11', 0, 1, 2),
    (10, '2026-03-20', 'Room 208B11', 0, 1, 2),
    (11, '2026-03-21', 'Room 208B11', 0, 1, 3),
    (12, '2026-03-22', 'Room 301B10', 0, 1, 3);
-- NEWS
INSERT INTO `news` (
        `newID`,
        `title`,
        `body`,
        `date`,
        `author`,
        `image`
    )
VALUES (
        1,
        'Voluntary Blood Donation Campaign 2026',
        'Our hospital organized a voluntary blood donation event to support emergency patients.',
        '2026-02-18',
        'Hospital Management',
        './images/banner2.webp'
    ),
    (
        2,
        'Celebrating Vietnamese Women''s Day 20/10',
        'The hospital organized health awareness seminars for women.',
        '2025-10-20',
        'Medical Department',
        './images/banner4.webp'
    ),
    (
        3,
        'Partnership with Ho Chi Minh City Oncology Hospital',
        'The cooperation focuses on cancer diagnosis and treatment research.',
        '2025-09-11',
        'Hospital Director',
        './images/banner3.webp'
    ),
    (
        4,
        'Health Club Seminar: Breathing and Longevity',
        'Doctors shared medical advice on improving respiratory health.',
        '2025-10-28',
        'Internal Medicine Department',
        './images/banner1.webp'
    );
-- ======================================================
-- TEST TYPE
-- ======================================================
INSERT INTO testtype (typeName, description)
VALUES (
        'Complete Blood Count (CBC)',
        'Blood cell analysis'
    ),
    (
        'Lipid Profile',
        'Cholesterol and triglyceride evaluation'
    ),
    (
        'Diabetes Screening',
        'Blood glucose and HbA1c evaluation'
    ),
    ('Liver Function Test', 'Liver enzyme assessment'),
    (
        'Kidney Function Test',
        'Kidney health assessment'
    ),
    ('Urinalysis', 'Urine laboratory examination'),
    (
        'Thyroid Function Test',
        'Thyroid hormone assessment'
    ),
    ('COVID-19 PCR', 'Coronavirus PCR test'),
    (
        'Comprehensive Metabolic Panel',
        'General metabolic health assessment'
    );
-- ======================================================
-- DOCTOR ORDERS
-- ======================================================
INSERT INTO doctororder (
        orderID,
        userID,
        doctorID,
        testTypeID,
        diagnosisNote,
        status,
        orderDate
    )
VALUES (
        1,
        2,
        1,
        2,
        'Patient has elevated blood pressure. Check cholesterol levels.',
        'Completed',
        '2026-03-01 08:30:00'
    ),
    (
        2,
        2,
        1,
        9,
        'Follow-up metabolic assessment after treatment.',
        'Completed',
        '2026-03-04 08:00:00'
    ),
    (
        3,
        3,
        1,
        3,
        'Suspected diabetes mellitus. Perform glucose screening.',
        'Completed',
        '2026-03-02 10:00:00'
    ),
    (
        4,
        3,
        1,
        5,
        'Monitor kidney function due to elevated glucose.',
        'Completed',
        '2026-03-05 09:30:00'
    );
-- ======================================================
-- TEST RESULTS
-- ======================================================
INSERT INTO testresult (
        testResultID,
        orderID,
        title,
        datetime,
        testResultCode,
        remarks
    )
VALUES (
        1,
        1,
        'Admission Lipid Profile',
        '2026-03-01 10:00:00',
        'TR-20260301-001',
        'Initial cholesterol screening'
    ),
    (
        2,
        2,
        'Comprehensive Metabolic Panel',
        '2026-03-04 09:30:00',
        'TR-20260304-001',
        'Follow-up metabolic assessment'
    ),
    (
        3,
        3,
        'Diabetes Screening',
        '2026-03-02 13:00:00',
        'TR-20260302-001',
        'Initial diabetic evaluation'
    ),
    (
        4,
        4,
        'Kidney Function Test',
        '2026-03-05 11:15:00',
        'TR-20260305-001',
        'Kidney monitoring for diabetic patient'
    );
-- ======================================================
-- TEST RESULT ITEMS
-- ======================================================
INSERT INTO testtype_item (testTypeID, parameterName, unit, referenceRange)
VALUES (1, 'WBC', '10^9/L', '4.0-11.0'),
    (1, 'RBC', '10^12/L', '4.5-5.9'),
    (1, 'Hemoglobin', 'g/dL', '13-17'),
    (1, 'Hematocrit', '%', '40-52'),
    (1, 'MCV', 'fL', '80-100'),
    (1, 'MCH', 'pg', '27-33'),
    (1, 'MCHC', 'g/dL', '32-36'),
    (1, 'Platelets', '10^9/L', '150-450'),
    (1, 'Neutrophils', '%', '40-70'),
    (1, 'Lymphocytes', '%', '20-45');
INSERT INTO testtype_item (testTypeID, parameterName, unit, referenceRange)
VALUES (2, 'Total Cholesterol', 'mg/dL', '<200'),
    (2, 'HDL Cholesterol', 'mg/dL', '>40'),
    (2, 'LDL Cholesterol', 'mg/dL', '<100'),
    (2, 'Triglycerides', 'mg/dL', '<150'),
    (2, 'VLDL', 'mg/dL', '5-40');
INSERT INTO testtype_item (testTypeID, parameterName, unit, referenceRange)
VALUES (3, 'Fasting Glucose', 'mg/dL', '70-99'),
    (3, 'Postprandial Glucose', 'mg/dL', '<140'),
    (3, 'HbA1c', '%', '4.0-5.6'),
    (3, 'Insulin', 'µIU/mL', '2-25');
INSERT INTO testtype_item (testTypeID, parameterName, unit, referenceRange)
VALUES (4, 'ALT', 'U/L', '7-56'),
    (4, 'AST', 'U/L', '10-40'),
    (4, 'ALP', 'U/L', '44-147'),
    (4, 'Bilirubin Total', 'mg/dL', '0.1-1.2'),
    (4, 'Bilirubin Direct', 'mg/dL', '0.0-0.3'),
    (4, 'Albumin', 'g/dL', '3.5-5.0');
INSERT INTO testtype_item (testTypeID, parameterName, unit, referenceRange)
VALUES (5, 'Creatinine', 'mg/dL', '0.6-1.3'),
    (5, 'Urea (BUN)', 'mg/dL', '7-20'),
    (5, 'eGFR', 'mL/min/1.73m²', '>90'),
    (5, 'Uric Acid', 'mg/dL', '3.5-7.2'),
    (5, 'Sodium', 'mmol/L', '135-145'),
    (5, 'Potassium', 'mmol/L', '3.5-5.1');
INSERT INTO testtype_item (testTypeID, parameterName, unit, referenceRange)
VALUES (6, 'Protein', '', 'Negative'),
    (6, 'Glucose', '', 'Negative'),
    (6, 'Ketones', '', 'Negative'),
    (6, 'Blood', '', 'Negative'),
    (6, 'pH', '', '5.0-8.0'),
    (6, 'Specific Gravity', '', '1.005-1.030'),
    (6, 'Leukocytes', '', 'Negative');
INSERT INTO testtype_item (testTypeID, parameterName, unit, referenceRange)
VALUES (7, 'TSH', 'mIU/L', '0.4-4.0'),
    (7, 'T3', 'ng/dL', '80-200'),
    (7, 'T4', 'µg/dL', '5.0-12.0'),
    (7, 'Free T4', 'ng/dL', '0.8-1.8');
INSERT INTO testtype_item (testTypeID, parameterName, unit, referenceRange)
VALUES (8, 'SARS-CoV-2 RNA', '', 'Not Detected'),
    (8, 'Ct Value', '', '>35 (Negative)');
INSERT INTO testtype_item (testTypeID, parameterName, unit, referenceRange)
VALUES (9, 'Glucose', 'mg/dL', '70-99'),
    (9, 'Calcium', 'mg/dL', '8.5-10.5'),
    (9, 'Sodium', 'mmol/L', '135-145'),
    (9, 'Potassium', 'mmol/L', '3.5-5.1'),
    (9, 'Chloride', 'mmol/L', '98-107'),
    (9, 'CO2', 'mmol/L', '22-29'),
    (9, 'Creatinine', 'mg/dL', '0.6-1.3'),
    (9, 'BUN', 'mg/dL', '7-20'),
    (9, 'Albumin', 'g/dL', '3.5-5.0'),
    (9, 'Total Protein', 'g/dL', '6.0-8.3');
-- MEDICAL RECORDS
INSERT INTO `medicalrecords` (
        `recordID`,
        `timeCreate`,
        `heartRate`,
        `pulse`,
        `hurtScale`,
        `temperature`,
        `currentCondition`,
        `SP02`,
        `healthStatus`,
        `respiratoryRate`,
        `bloodPressure`,
        `urine`,
        `patientID`,
        `sensorium`,
        `oxygenTherapy`
    )
VALUES (
        201,
        '2026-03-02 08:20:00',
        90,
        85,
        4,
        '37.2',
        'High blood sugar symptoms',
        '96',
        1,
        20,
        '135/88',
        'Normal',
        2,
        1,
        0
    ),
    (
        202,
        '2026-03-02 14:30:00',
        88,
        83,
        3,
        '37.0',
        'Insulin administered',
        '97',
        1,
        19,
        '132/86',
        'Normal',
        2,
        1,
        0
    ),
    (
        203,
        '2026-03-03 09:10:00',
        86,
        82,
        3,
        '36.9',
        'Blood glucose improving',
        '97',
        1,
        19,
        '130/85',
        'Normal',
        2,
        1,
        0
    ),
    (
        204,
        '2026-03-03 16:40:00',
        85,
        80,
        2,
        '36.8',
        'Patient stable',
        '98',
        1,
        18,
        '128/84',
        'Normal',
        2,
        1,
        0
    ),
    (
        205,
        '2026-03-04 08:50:00',
        84,
        79,
        2,
        '36.8',
        'Condition improving',
        '98',
        1,
        18,
        '126/82',
        'Normal',
        2,
        1,
        0
    ),
    (
        206,
        '2026-03-04 15:10:00',
        83,
        78,
        2,
        '36.7',
        'Glucose under control',
        '98',
        1,
        18,
        '124/80',
        'Normal',
        2,
        1,
        0
    ),
    (
        207,
        '2026-03-05 09:30:00',
        82,
        77,
        1,
        '36.6',
        'Patient stable',
        '99',
        1,
        17,
        '122/79',
        'Normal',
        2,
        1,
        0
    ),
    (
        208,
        '2026-03-05 13:20:00',
        81,
        76,
        1,
        '36.6',
        'No symptoms',
        '99',
        1,
        17,
        '121/78',
        'Normal',
        2,
        1,
        0
    ),
    (
        209,
        '2026-03-06 08:40:00',
        80,
        75,
        1,
        '36.5',
        'Ready for discharge',
        '99',
        1,
        17,
        '120/78',
        'Normal',
        2,
        1,
        0
    ),
    (
        210,
        '2026-03-06 14:10:00',
        79,
        74,
        0,
        '36.5',
        'Final check stable',
        '99',
        1,
        17,
        '118/77',
        'Normal',
        2,
        1,
        0
    );
INSERT INTO testresult_item (
        testResultID,
        testTypeItemID,
        resultValue,
        unit,
        referenceRange,
        abnormalFlag
    )
VALUES (1, 1, '6.2', '10^9/L', '4.0-11.0', 'Normal'),
    (1, 2, '4.8', '10^12/L', '4.5-5.9', 'Normal'),
    (1, 3, '13.5', 'g/dL', '13-17', 'Normal'),
    (1, 4, '42', '%', '40-52', 'Normal'),
    (1, 5, '88', 'fL', '80-100', 'Normal');
INSERT INTO testresult_item (
        testResultID,
        testTypeItemID,
        resultValue,
        unit,
        referenceRange,
        abnormalFlag
    )
VALUES (2, 11, '210', 'mg/dL', '<200', 'High'),
    (2, 12, '55', 'mg/dL', '>40', 'Normal'),
    (2, 13, '130', 'mg/dL', '<100', 'High'),
    (2, 14, '180', 'mg/dL', '<150', 'High'),
    (2, 15, '35', 'mg/dL', '5-40', 'Normal');
INSERT INTO testresult_item (
        testResultID,
        testTypeItemID,
        resultValue,
        unit,
        referenceRange,
        abnormalFlag
    )
VALUES (3, 16, '140', 'mg/dL', '70-99', 'High'),
    (3, 17, '160', 'mg/dL', '<140', 'High'),
    (3, 18, '7.2', '%', '4.0-5.6', 'High'),
    (3, 19, '18', 'µIU/mL', '2-25', 'Normal');
INSERT INTO testresult_item (
        testResultID,
        testTypeItemID,
        resultValue,
        unit,
        referenceRange,
        abnormalFlag
    )
VALUES (4, 21, '1.4', 'mg/dL', '0.6-1.3', 'High'),
    (4, 22, '25', 'mg/dL', '7-20', 'High'),
    (4, 23, '85', 'mL/min/1.73m²', '>90', 'Low'),
    (4, 24, '7.5', 'mg/dL', '3.5-7.2', 'High'),
    (4, 25, '140', 'mmol/L', '135-145', 'Normal');
INSERT INTO `medicalrecords` (
        `recordID`,
        `timeCreate`,
        `heartRate`,
        `pulse`,
        `hurtScale`,
        `temperature`,
        `currentCondition`,
        `SP02`,
        `healthStatus`,
        `respiratoryRate`,
        `bloodPressure`,
        `urine`,
        `patientID`,
        `sensorium`,
        `oxygenTherapy`
    )
VALUES (
        101,
        '2026-03-01 08:30:00',
        82,
        78,
        2,
        '36.7',
        'Stable condition',
        '98',
        1,
        18,
        '120/80',
        'Normal',
        1,
        1,
        0
    ),
    (
        102,
        '2026-03-01 14:00:00',
        80,
        76,
        1,
        '36.8',
        'Patient resting',
        '98',
        1,
        17,
        '118/79',
        'Normal',
        1,
        1,
        0
    ),
    (
        103,
        '2026-03-02 09:00:00',
        85,
        80,
        3,
        '37.1',
        'Mild headache',
        '97',
        1,
        19,
        '125/82',
        'Normal',
        1,
        1,
        0
    ),
    (
        104,
        '2026-03-02 16:00:00',
        83,
        77,
        2,
        '36.9',
        'Improving condition',
        '98',
        1,
        18,
        '122/80',
        'Normal',
        1,
        1,
        0
    ),
    (
        105,
        '2026-03-03 09:30:00',
        78,
        74,
        1,
        '36.6',
        'Stable after medication',
        '99',
        1,
        17,
        '118/78',
        'Normal',
        1,
        1,
        0
    ),
    (
        106,
        '2026-03-03 15:20:00',
        79,
        75,
        1,
        '36.7',
        'No complaints',
        '99',
        1,
        17,
        '117/77',
        'Normal',
        1,
        1,
        0
    ),
    (
        107,
        '2026-03-04 08:40:00',
        81,
        76,
        0,
        '36.6',
        'Patient feeling better',
        '99',
        1,
        18,
        '116/76',
        'Normal',
        1,
        1,
        0
    ),
    (
        108,
        '2026-03-04 13:30:00',
        80,
        75,
        0,
        '36.7',
        'Stable vital signs',
        '99',
        1,
        18,
        '115/75',
        'Normal',
        1,
        1,
        0
    ),
    (
        109,
        '2026-03-05 09:10:00',
        77,
        73,
        0,
        '36.5',
        'Ready for discharge',
        '99',
        1,
        17,
        '114/74',
        'Normal',
        1,
        1,
        0
    ),
    (
        110,
        '2026-03-05 15:00:00',
        76,
        72,
        0,
        '36.5',
        'Final evaluation normal',
        '99',
        1,
        17,
        '115/75',
        'Normal',
        1,
        1,
        0
    );
-- MEDICINES
INSERT INTO medicines (
        medicineName,
        genericName,
        dosageForm,
        strength,
        description,
        isActive
    )
VALUES (
        'Paracetamol',
        'Acetaminophen',
        'Tablet',
        '500mg',
        'Pain reliever and fever reducer',
        1
    ),
    (
        'Ibuprofen',
        'Ibuprofen',
        'Tablet',
        '400mg',
        'Anti inflammatory pain relief',
        1
    ),
    (
        'Aspirin',
        'Acetylsalicylic Acid',
        'Tablet',
        '325mg',
        'Pain relief and blood thinner',
        1
    ),
    (
        'Amoxicillin',
        'Amoxicillin',
        'Capsule',
        '500mg',
        'Antibiotic for bacterial infection',
        1
    ),
    (
        'Amoxicillin Clavulanate',
        'Co-amoxiclav',
        'Tablet',
        '625mg',
        'Broad spectrum antibiotic',
        1
    ),
    (
        'Azithromycin',
        'Azithromycin',
        'Tablet',
        '500mg',
        'Antibiotic',
        1
    ),
    (
        'Ciprofloxacin',
        'Ciprofloxacin',
        'Tablet',
        '500mg',
        'Antibiotic',
        1
    ),
    (
        'Clarithromycin',
        'Clarithromycin',
        'Tablet',
        '500mg',
        'Antibiotic',
        1
    ),
    (
        'Doxycycline',
        'Doxycycline',
        'Capsule',
        '100mg',
        'Antibiotic',
        1
    ),
    (
        'Metronidazole',
        'Metronidazole',
        'Tablet',
        '500mg',
        'Antibiotic and antiprotozoal',
        1
    ),
    (
        'Cefixime',
        'Cefixime',
        'Capsule',
        '200mg',
        'Antibiotic',
        1
    ),
    (
        'Ceftriaxone',
        'Ceftriaxone',
        'Injection',
        '1g',
        'Antibiotic',
        1
    ),
    (
        'Levofloxacin',
        'Levofloxacin',
        'Tablet',
        '500mg',
        'Antibiotic',
        1
    ),
    (
        'Moxifloxacin',
        'Moxifloxacin',
        'Tablet',
        '400mg',
        'Antibiotic',
        1
    ),
    (
        'Vancomycin',
        'Vancomycin',
        'Injection',
        '1g',
        'Antibiotic',
        1
    ),
    (
        'Linezolid',
        'Linezolid',
        'Tablet',
        '600mg',
        'Antibiotic',
        1
    ),
    (
        'Clindamycin',
        'Clindamycin',
        'Capsule',
        '300mg',
        'Antibiotic',
        1
    ),
    (
        'Fluconazole',
        'Fluconazole',
        'Tablet',
        '150mg',
        'Antifungal',
        1
    ),
    (
        'Ketoconazole',
        'Ketoconazole',
        'Cream',
        '2%',
        'Antifungal cream',
        1
    ),
    (
        'Nystatin',
        'Nystatin',
        'Suspension',
        '100000U/ml',
        'Antifungal oral suspension',
        1
    ),
    (
        'Acyclovir',
        'Acyclovir',
        'Tablet',
        '400mg',
        'Antiviral',
        1
    ),
    (
        'Valacyclovir',
        'Valacyclovir',
        'Tablet',
        '500mg',
        'Antiviral',
        1
    ),
    (
        'Oseltamivir',
        'Oseltamivir',
        'Capsule',
        '75mg',
        'Antiviral influenza treatment',
        1
    ),
    (
        'Omeprazole',
        'Omeprazole',
        'Capsule',
        '20mg',
        'Reduces stomach acid',
        1
    ),
    (
        'Pantoprazole',
        'Pantoprazole',
        'Tablet',
        '40mg',
        'Acid reflux treatment',
        1
    ),
    (
        'Esomeprazole',
        'Esomeprazole',
        'Capsule',
        '40mg',
        'GERD treatment',
        1
    ),
    (
        'Famotidine',
        'Famotidine',
        'Tablet',
        '20mg',
        'Acid reducer',
        1
    ),
    (
        'Domperidone',
        'Domperidone',
        'Tablet',
        '10mg',
        'Anti nausea',
        1
    ),
    (
        'Ondansetron',
        'Ondansetron',
        'Tablet',
        '8mg',
        'Antiemetic',
        1
    ),
    (
        'Loperamide',
        'Loperamide',
        'Capsule',
        '2mg',
        'Treats diarrhea',
        1
    ),
    (
        'Metformin',
        'Metformin',
        'Tablet',
        '500mg',
        'Type 2 diabetes medication',
        1
    ),
    (
        'Insulin Glargine',
        'Insulin',
        'Injection',
        '100IU/ml',
        'Long acting insulin',
        1
    ),
    (
        'Insulin Aspart',
        'Insulin',
        'Injection',
        '100IU/ml',
        'Rapid acting insulin',
        1
    ),
    (
        'Atorvastatin',
        'Atorvastatin',
        'Tablet',
        '20mg',
        'Cholesterol control',
        1
    ),
    (
        'Simvastatin',
        'Simvastatin',
        'Tablet',
        '20mg',
        'Cholesterol control',
        1
    ),
    (
        'Rosuvastatin',
        'Rosuvastatin',
        'Tablet',
        '10mg',
        'Cholesterol control',
        1
    ),
    (
        'Amlodipine',
        'Amlodipine',
        'Tablet',
        '5mg',
        'Blood pressure control',
        1
    ),
    (
        'Lisinopril',
        'Lisinopril',
        'Tablet',
        '10mg',
        'ACE inhibitor',
        1
    ),
    (
        'Losartan',
        'Losartan',
        'Tablet',
        '50mg',
        'Blood pressure treatment',
        1
    ),
    (
        'Hydrochlorothiazide',
        'Hydrochlorothiazide',
        'Tablet',
        '25mg',
        'Diuretic',
        1
    ),
    (
        'Furosemide',
        'Furosemide',
        'Tablet',
        '40mg',
        'Diuretic',
        1
    ),
    (
        'Spironolactone',
        'Spironolactone',
        'Tablet',
        '25mg',
        'Diuretic',
        1
    ),
    (
        'Bisoprolol',
        'Bisoprolol',
        'Tablet',
        '5mg',
        'Beta blocker',
        1
    ),
    (
        'Carvedilol',
        'Carvedilol',
        'Tablet',
        '12.5mg',
        'Heart medication',
        1
    ),
    (
        'Digoxin',
        'Digoxin',
        'Tablet',
        '0.25mg',
        'Heart failure treatment',
        1
    ),
    (
        'Nitroglycerin',
        'Nitroglycerin',
        'Tablet',
        '0.4mg',
        'Chest pain treatment',
        1
    ),
    (
        'Warfarin',
        'Warfarin',
        'Tablet',
        '5mg',
        'Blood thinner',
        1
    ),
    (
        'Clopidogrel',
        'Clopidogrel',
        'Tablet',
        '75mg',
        'Antiplatelet drug',
        1
    ),
    (
        'Heparin',
        'Heparin',
        'Injection',
        '5000IU',
        'Anticoagulant',
        1
    ),
    (
        'Atenolol',
        'Atenolol',
        'Tablet',
        '50mg',
        'Blood pressure control',
        1
    ),
    (
        'Tramadol',
        'Tramadol',
        'Capsule',
        '50mg',
        'Pain relief',
        1
    ),
    (
        'Codeine',
        'Codeine',
        'Tablet',
        '30mg',
        'Pain relief',
        1
    ),
    (
        'Morphine',
        'Morphine',
        'Injection',
        '10mg',
        'Severe pain treatment',
        1
    ),
    (
        'Ketorolac',
        'Ketorolac',
        'Injection',
        '30mg',
        'Pain relief',
        1
    ),
    (
        'Meloxicam',
        'Meloxicam',
        'Tablet',
        '7.5mg',
        'Anti inflammatory',
        1
    ),
    (
        'Diclofenac',
        'Diclofenac',
        'Tablet',
        '50mg',
        'Pain and inflammation',
        1
    ),
    (
        'Celecoxib',
        'Celecoxib',
        'Capsule',
        '200mg',
        'Anti inflammatory',
        1
    ),
    (
        'Allopurinol',
        'Allopurinol',
        'Tablet',
        '300mg',
        'Gout treatment',
        1
    ),
    (
        'Colchicine',
        'Colchicine',
        'Tablet',
        '0.6mg',
        'Gout medication',
        1
    ),
    (
        'Tamsulosin',
        'Tamsulosin',
        'Capsule',
        '0.4mg',
        'Prostate treatment',
        1
    ),
    (
        'Finasteride',
        'Finasteride',
        'Tablet',
        '5mg',
        'Prostate medication',
        1
    ),
    (
        'Sildenafil',
        'Sildenafil',
        'Tablet',
        '50mg',
        'Erectile dysfunction',
        1
    ),
    (
        'Tadalafil',
        'Tadalafil',
        'Tablet',
        '10mg',
        'Erectile dysfunction',
        1
    ),
    (
        'Fluoxetine',
        'Fluoxetine',
        'Capsule',
        '20mg',
        'Antidepressant',
        1
    ),
    (
        'Sertraline',
        'Sertraline',
        'Tablet',
        '50mg',
        'Antidepressant',
        1
    ),
    (
        'Citalopram',
        'Citalopram',
        'Tablet',
        '20mg',
        'Antidepressant',
        1
    ),
    (
        'Escitalopram',
        'Escitalopram',
        'Tablet',
        '10mg',
        'Antidepressant',
        1
    ),
    (
        'Amitriptyline',
        'Amitriptyline',
        'Tablet',
        '25mg',
        'Antidepressant',
        1
    ),
    (
        'Diazepam',
        'Diazepam',
        'Tablet',
        '5mg',
        'Anxiety treatment',
        1
    ),
    (
        'Lorazepam',
        'Lorazepam',
        'Tablet',
        '1mg',
        'Anxiety treatment',
        1
    ),
    (
        'Alprazolam',
        'Alprazolam',
        'Tablet',
        '0.5mg',
        'Anxiety medication',
        1
    ),
    (
        'Zolpidem',
        'Zolpidem',
        'Tablet',
        '10mg',
        'Sleep medication',
        1
    ),
    (
        'Melatonin',
        'Melatonin',
        'Tablet',
        '3mg',
        'Sleep aid',
        1
    ),
    (
        'Cetirizine',
        'Cetirizine',
        'Tablet',
        '10mg',
        'Allergy medication',
        1
    ),
    (
        'Loratadine',
        'Loratadine',
        'Tablet',
        '10mg',
        'Antihistamine',
        1
    ),
    (
        'Diphenhydramine',
        'Diphenhydramine',
        'Capsule',
        '25mg',
        'Allergy relief',
        1
    ),
    (
        'Fexofenadine',
        'Fexofenadine',
        'Tablet',
        '180mg',
        'Antihistamine',
        1
    ),
    (
        'Montelukast',
        'Montelukast',
        'Tablet',
        '10mg',
        'Asthma prevention',
        1
    ),
    (
        'Salbutamol',
        'Salbutamol',
        'Inhaler',
        '100mcg',
        'Bronchodilator for asthma',
        1
    ),
    (
        'Budesonide',
        'Budesonide',
        'Inhaler',
        '200mcg',
        'Asthma treatment',
        1
    ),
    (
        'Beclomethasone',
        'Beclomethasone',
        'Inhaler',
        '100mcg',
        'Asthma treatment',
        1
    ),
    (
        'Salbutamol Syrup',
        'Salbutamol',
        'Syrup',
        '2mg/5ml',
        'Asthma syrup',
        1
    ),
    (
        'Guaifenesin',
        'Guaifenesin',
        'Syrup',
        '100mg/5ml',
        'Cough expectorant',
        1
    ),
    (
        'Dextromethorphan',
        'Dextromethorphan',
        'Syrup',
        '15mg/5ml',
        'Cough suppressant',
        1
    ),
    (
        'Hydrocortisone',
        'Hydrocortisone',
        'Cream',
        '1%',
        'Skin inflammation treatment',
        1
    ),
    (
        'Betamethasone',
        'Betamethasone',
        'Cream',
        '0.05%',
        'Skin inflammation',
        1
    ),
    (
        'Mupirocin',
        'Mupirocin',
        'Ointment',
        '2%',
        'Topical antibiotic',
        1
    ),
    (
        'Calcium Carbonate',
        'Calcium',
        'Tablet',
        '500mg',
        'Calcium supplement',
        1
    ),
    (
        'Vitamin C',
        'Ascorbic Acid',
        'Tablet',
        '500mg',
        'Vitamin supplement',
        1
    ),
    (
        'Vitamin D3',
        'Cholecalciferol',
        'Capsule',
        '1000IU',
        'Vitamin supplement',
        1
    ),
    (
        'Iron',
        'Ferrous Sulfate',
        'Tablet',
        '325mg',
        'Iron supplement',
        1
    ),
    (
        'Folic Acid',
        'Folic Acid',
        'Tablet',
        '5mg',
        'Vitamin B9 supplement',
        1
    ),
    (
        'Zinc',
        'Zinc',
        'Tablet',
        '50mg',
        'Mineral supplement',
        1
    ),
    (
        'Magnesium',
        'Magnesium',
        'Tablet',
        '250mg',
        'Mineral supplement',
        1
    ),
    (
        'Potassium Chloride',
        'Potassium',
        'Tablet',
        '20mEq',
        'Electrolyte supplement',
        1
    );
-- PRESCRIPTIONS
INSERT INTO prescriptions (patientID, doctorID, diagnosis, notes)
VALUES (1, 1, 'Flu', 'Drink more water and rest');
INSERT INTO prescription_items (
        prescriptionID,
        medicineID,
        dosage,
        frequency,
        durationDays,
        quantity,
        instructions
    )
VALUES (
        1,
        1,
        '1 tablet',
        '3 times/day',
        5,
        15,
        'After meals'
    ),
    (
        1,
        5,
        '1 capsule',
        '2 times/day',
        7,
        14,
        'After meals'
    );

-- addmore
-- =========================
-- NEW USERS (PATIENTS)
-- =========================
INSERT INTO `user`
(`userID`,`username`,`password`,`fullName`,`dob`,`phone`,`email`,`CIC`,`address`,`gender`) VALUES
(6,'patient.6','1','Le Minh Hoang','2000-01-10','0901111111','p6@gmail.com','079200000006','Binh Duong',1),
(7,'patient.7','1','Tran Thi Mai','1999-03-11','0901111112','p7@gmail.com','079200000007','Binh Duong',2),
(8,'patient.8','1','Nguyen Van Tuan','2001-05-21','0901111113','p8@gmail.com','079200000008','HCMC',1),
(9,'patient.9','1','Pham Thi Linh','1998-09-15','0901111114','p9@gmail.com','079200000009','HCMC',2),
(10,'patient.10','1','Do Anh Kiet','2002-12-01','0901111115','p10@gmail.com','079200000010','Dong Nai',1),
(11,'patient.11','1','Hoang Gia Bao','2000-07-07','0901111116','p11@gmail.com','079200000011','Binh Duong',1),
(12,'patient.12','1','Bui Thi Hoa','1997-06-18','0901111117','p12@gmail.com','079200000012','HCMC',2),
(13,'patient.13','1','Vo Thanh Nam','1999-10-20','0901111118','p13@gmail.com','079200000013','Long An',1),
(14,'patient.14','1','Luu Thi Ngoc','2003-02-25','0901111119','p14@gmail.com','079200000014','Tay Ninh',2),
(15,'patient.15','1','Tran Quoc Dat','1996-11-30','0901111120','p15@gmail.com','079200000015','HCMC',1),
(16,'patient.16','1','Dang Thi Hanh','2001-08-08','0901111121','p16@gmail.com','079200000016','Binh Duong',2),
(17,'patient.17','1','Nguyen Hoai Nam','1998-04-04','0901111122','p17@gmail.com','079200000017','HCMC',1),
(18,'patient.18','1','Pham Gia Han','2002-09-09','0901111123','p18@gmail.com','079200000018','Dong Nai',2),
(19,'patient.19','1','Le Quang Huy','1997-01-01','0901111124','p19@gmail.com','079200000019','HCMC',1),
(20,'patient.20','1','Tran Minh Chau','2000-06-06','0901111125','p20@gmail.com','079200000020','Binh Duong',2);

INSERT INTO userrole (userRoleID, roleID, userID) VALUES
(6,3,6),(7,3,7),(8,3,8),(9,3,9),(10,3,10),
(11,3,11),(12,3,12),(13,3,13),(14,3,14),(15,3,15),
(16,3,16),(17,3,17),(18,3,18),(19,3,19),(20,3,20);

INSERT INTO patient
(patientID,HI,relativeName,relativeNumber,userID,image)
VALUES
(3,'HI-2026-003','Relative A','0900000001',6,'https://i.pravatar.cc/300?img=21'),
(4,'HI-2026-004','Relative B','0900000002',7,'https://i.pravatar.cc/300?img=22'),
(5,'HI-2026-005','Relative C','0900000003',8,'https://i.pravatar.cc/300?img=23'),
(6,'HI-2026-006','Relative D','0900000004',9,'https://i.pravatar.cc/300?img=24'),
(7,'HI-2026-007','Relative E','0900000005',10,'https://i.pravatar.cc/300?img=25'),
(8,'HI-2026-008','Relative F','0900000006',11,'https://i.pravatar.cc/300?img=26'),
(9,'HI-2026-009','Relative G','0900000007',12,'https://i.pravatar.cc/300?img=27'),
(10,'HI-2026-010','Relative H','0900000008',13,'https://i.pravatar.cc/300?img=28'),
(11,'HI-2026-011','Relative I','0900000009',14,'https://i.pravatar.cc/300?img=29'),
(12,'HI-2026-012','Relative J','0900000010',15,'https://i.pravatar.cc/300?img=30'),
(13,'HI-2026-013','Relative K','0900000011',16,'https://i.pravatar.cc/300?img=31'),
(14,'HI-2026-014','Relative L','0900000012',17,'https://i.pravatar.cc/300?img=32'),
(15,'HI-2026-015','Relative M','0900000013',18,'https://i.pravatar.cc/300?img=33'),
(16,'HI-2026-016','Relative N','0900000014',19,'https://i.pravatar.cc/300?img=34'),
(17,'HI-2026-017','Relative O','0900000015',20,'https://i.pravatar.cc/300?img=35');

INSERT INTO admission (patientID, admissionDate, hospitalizationsDiagnosis, summaryCondition, dischargeID, status)
VALUES
(3,'2026-03-10','Flu','Recovering',NULL,'Archived'),
(4,'2026-03-11','Asthma','Under control',NULL,'Archived'),
(5,'2026-03-12','Hypertension','Improving',NULL,'Archived'),
(6,'2026-03-13','Diabetes','Stable',NULL,'Archived'),
(7,'2026-03-14','Infection','Recovering',NULL,'Archived'),
(8,'2026-03-15','Fracture','Healing',NULL,'Archived'),
(9,'2026-03-16','Migraine','Improving',NULL,'Archived'),
(10,'2026-03-17','Allergy','Stable',NULL,'Archived'),
(11,'2026-03-18','Gastritis','Recovering',NULL,'Archived'),
(12,'2026-03-19','Pneumonia','Improving',NULL,'Archived'),
(13,'2026-03-20','Kidney issue','Stable',NULL,'Archived'),
(14,'2026-03-21','Back pain','Improving',NULL,'Archived'),
(15,'2026-03-22','Heart check','Stable',NULL,'Archived'),
(16,'2026-03-23','Diabetes','Stable',NULL,'Archived'),
(17,'2026-03-24','Flu','Recovering',NULL,'Archived');

INSERT INTO `user`
(`userID`,`username`,`password`,`fullName`,`dob`,`phone`,`email`,`CIC`,`address`,`gender`) VALUES
(21,'nurse.1','1','Nguyen Thi Lan','1995-01-01','0910000001','n1@gmail.com','079300000001','Binh Duong',2),
(22,'nurse.2','1','Tran Van Binh','1994-02-02','0910000002','n2@gmail.com','079300000002','HCMC',1),
(23,'nurse.3','1','Le Thi Hoa','1993-03-03','0910000003','n3@gmail.com','079300000003','Dong Nai',2),
(24,'nurse.4','1','Pham Van Duc','1992-04-04','0910000004','n4@gmail.com','079300000004','HCMC',1),
(25,'nurse.5','1','Hoang Thi Mai','1991-05-05','0910000005','n5@gmail.com','079300000005','Binh Duong',2),
(26,'nurse.6','1','Bui Van Long','1990-06-06','0910000006','n6@gmail.com','079300000006','Tay Ninh',1),
(27,'nurse.7','1','Vo Thi Thu','1995-07-07','0910000007','n7@gmail.com','079300000007','HCMC',2),
(28,'nurse.8','1','Dang Van Khoa','1994-08-08','0910000008','n8@gmail.com','079300000008','Long An',1),
(29,'nurse.9','1','Nguyen Thi Ngoc','1993-09-09','0910000009','n9@gmail.com','079300000009','HCMC',2),
(30,'nurse.10','1','Tran Van Hieu','1992-10-10','0910000010','n10@gmail.com','079300000010','Binh Duong',1),
(31,'nurse.11','1','Le Van Tuan','1991-11-11','0910000011','n11@gmail.com','079300000011','HCMC',1),
(32,'nurse.12','1','Pham Thi Huong','1990-12-12','0910000012','n12@gmail.com','079300000012','Dong Nai',2),
(33,'nurse.13','1','Ho Van Minh','1995-01-15','0910000013','n13@gmail.com','079300000013','HCMC',1),
(34,'nurse.14','1','Nguyen Thi Thanh','1994-02-16','0910000014','n14@gmail.com','079300000014','Binh Duong',2),
(35,'nurse.15','1','Tran Van Nam','1993-03-17','0910000015','n15@gmail.com','079300000015','HCMC',1);

INSERT INTO userrole (userRoleID, roleID, userID) VALUES
(21,2,21),(22,2,22),(23,2,23),(24,2,24),(25,2,25),
(26,2,26),(27,2,27),(28,2,28),(29,2,29),(30,2,30),
(31,2,31),(32,2,32),(33,2,33),(34,2,34),(35,2,35);

INSERT INTO nurse (nurseID, departmentID, userID, image) VALUES
(2,1,21,'https://i.pravatar.cc/300?img=36'),
(3,2,22,'https://i.pravatar.cc/300?img=37'),
(4,3,23,'https://i.pravatar.cc/300?img=38'),
(5,4,24,'https://i.pravatar.cc/300?img=39'),
(6,5,25,'https://i.pravatar.cc/300?img=40'),
(7,1,26,'https://i.pravatar.cc/300?img=41'),
(8,2,27,'https://i.pravatar.cc/300?img=42'),
(9,3,28,'https://i.pravatar.cc/300?img=43'),
(10,4,29,'https://i.pravatar.cc/300?img=44'),
(11,5,30,'https://i.pravatar.cc/300?img=45'),
(12,1,31,'https://i.pravatar.cc/300?img=46'),
(13,2,32,'https://i.pravatar.cc/300?img=47'),
(14,3,33,'https://i.pravatar.cc/300?img=48'),
(15,4,34,'https://i.pravatar.cc/300?img=49'),
(16,5,35,'https://i.pravatar.cc/300?img=50');

INSERT INTO `user`
(`userID`,`username`,`password`,`fullName`,`dob`,`phone`,`email`,`CIC`,`address`,`gender`) VALUES
(36,'doctor.1','1','Dr. Nguyen Quang Huy','1985-01-01','0921000001','d1@gmail.com','079400000001','HCMC',1),
(37,'doctor.2','1','Dr. Tran Thi Anh','1984-02-02','0921000002','d2@gmail.com','079400000002','Binh Duong',2),
(38,'doctor.3','1','Dr. Le Van Phuc','1983-03-03','0921000003','d3@gmail.com','079400000003','HCMC',1),
(39,'doctor.4','1','Dr. Pham Thi Lan','1982-04-04','0921000004','d4@gmail.com','079400000004','Dong Nai',2),
(40,'doctor.5','1','Dr. Hoang Minh Tri','1981-05-05','0921000005','d5@gmail.com','079400000005','HCMC',1),
(41,'doctor.6','1','Dr. Bui Quoc Dat','1980-06-06','0921000006','d6@gmail.com','079400000006','Long An',1),
(42,'doctor.7','1','Dr. Vo Thi Mai','1986-07-07','0921000007','d7@gmail.com','079400000007','HCMC',2),
(43,'doctor.8','1','Dr. Dang Van Nam','1987-08-08','0921000008','d8@gmail.com','079400000008','Tay Ninh',1),
(44,'doctor.9','1','Dr. Nguyen Thi Hanh','1988-09-09','0921000009','d9@gmail.com','079400000009','HCMC',2),
(45,'doctor.10','1','Dr. Tran Van Khoa','1989-10-10','0921000010','d10@gmail.com','079400000010','Binh Duong',1);

INSERT INTO userrole (userRoleID, roleID, userID) VALUES
(36,1,36),(37,1,37),(38,1,38),(39,1,39),(40,1,40),
(41,1,41),(42,1,42),(43,1,43),(44,1,44),(45,1,45);

INSERT INTO doctor (doctorID, departmentID, userID, office, image) VALUES
(2,1,36,'101A','https://i.pravatar.cc/300?img=51'),
(3,2,37,'102B','https://i.pravatar.cc/300?img=52'),
(4,3,38,'103C','https://i.pravatar.cc/300?img=53'),
(5,4,39,'104D','https://i.pravatar.cc/300?img=54'),
(6,5,40,'105E','https://i.pravatar.cc/300?img=55'),
(7,1,41,'106F','https://i.pravatar.cc/300?img=56'),
(8,2,42,'107G','https://i.pravatar.cc/300?img=57'),
(9,3,43,'108H','https://i.pravatar.cc/300?img=58'),
(10,4,44,'109I','https://i.pravatar.cc/300?img=59'),
(11,5,45,'110J','https://i.pravatar.cc/300?img=60');


-- CLINICAL EXAMINATIONS
INSERT INTO `clinical_examinations` (
  `patientID`, `admissionID`, `doctorID`, `examDate`, `height`, `weight`, `bloodPressure`, `heartRate`, `temperature`, `generalCondition`, `symptoms`, `diagnosis`
) VALUES
(1, 1, 1, '2026-03-01 08:30:00', 168.00, 70.00, '120/80', 80, 37.0, 'Patient looks exhausted', 'Headache, fatigue', 'Hypertension'),
(2, 2, 1, '2026-03-02 10:30:00', 170.00, 85.00, '130/85', 85, 37.2, 'Patient is sweating and dizzy', 'Dizziness, high blood sugar', 'Type 2 Diabetes'),
(3, NULL, 1, '2026-06-16 09:00:00', 165.00, 60.00, '110/70', 75, 36.8, 'Normal', 'Cough, mild fever', 'Common Cold');
