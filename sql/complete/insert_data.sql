

-- USERS
INSERT INTO `user`
(`userID`,`username`,`password`,`fullName`,`dob`,`phone`,`email`,`CIC`,`address`,`gender`) VALUES
(1,'nhat.nguyen','1','Nguyen Thanh Trung Nhat','1999-02-28','0922639956','nhat.nguyen@gmail.com','079199012345','28/17 Khu 5, Binh Duong Ward, Ho Chi Minh City',1),

(2,'thao.phan','1','Phan Dinh Hieu Thao','1998-07-15','0913456789','thao.phan@gmail.com','079198076543','125 Nguyen Trai Street, District 1, Ho Chi Minh City',1),

(3,'huyen.thanh','1','Thanh Huyen','1999-11-01','0938765432','huyen.thanh@gmail.com','079199098765','89 Le Loi Street, District 3, Ho Chi Minh City',2),

(4,'tan.dang','1','Dang Phu Tan','2000-04-10','0905678123','tan.dang@gmail.com','079200045678','45 Tran Hung Dao Street, District 5, Ho Chi Minh City',1),

(5,'admin.nhat','1','Admin Nhat','1999-11-01','0938765432','admin.nhat@gmail.com','079185098765','89 Le Loi Street, District 3, Ho Chi Minh City',1);

-- ROLE table
INSERT INTO `role` (`roleID`,`nameRole`) VALUES 
(1,'Doctor'),(2,'Nurse'),(3,'Patient'),(666,'Admin');

-- USERROLE table
INSERT INTO `userrole` (`userRoleID`,`roleID`,`userID`) VALUES
(1,2,1),
(2,3,2),
(3,3,3),
(4,1,4),
(5,666,5);

-- ROOM table  
INSERT INTO `room` (`roomID`,`department`,`location`) VALUES
(1,'Internal Medicine','208B11');

-- NURSE
INSERT INTO `nurse` (`nurseID`,`department`,`userID`,`roomID`,`image`) VALUES
(1,'Internal Medicine',1,1,'https://i.pravatar.cc/300?img=8');

-- DOCTOR
INSERT INTO `doctor` (`doctorID`,`department`,`nurseID`,`userID`,`requestID`,`office`) VALUES
(1,'Internal Medicine',1,4,NULL,'301B10');

-- REQUEST
INSERT INTO `request`
(`requestID`,`dateTime`,`requestContent`,`requestStatus`,`nurseID`,`doctorID`,`requestType`) VALUES
(1,'2026-03-10 09:00:00','Patient requires blood pressure evaluation',0,1,1,1);

-- FEEDBACK
INSERT INTO `feedback`
(`feedBackID`,`feedBackForFacility`,`feedBackForDoctor`,`feedBackForNurse`) VALUES
(1,'Clean and well organized facility','Doctor explained treatment clearly','Nurse was very supportive'),
(2,'Average waiting time','Doctor consultation was satisfactory','Nurse assistance was helpful'),
(3,'Facility needs improvement','Doctor seemed rushed','Nurse response was slow');

-- PATIENT
INSERT INTO `patient`
(`patientID`,`HI`,`admissionDate`,`dischargeDate`,
`hospitalizationsDiagnosis`,`summaryCondition`,`dischargeDiagnosis`,
`relativeName`,`relativeNumber`,`userID`,`feedBackID`,`image`) VALUES

(1,'HI-2026-001','2026-03-01 09:00:00','2026-03-05 16:00:00',
'Hypertension','Patient stabilized after medication',
'Controlled blood pressure',
'Tran Van Minh','0903123456',2,2,'https://i.pravatar.cc/300?img=12'),

(2,'HI-2026-002','2026-03-02 11:00:00','2026-03-06 10:30:00',
'Type 2 Diabetes','Condition improved with insulin therapy',
'Stable glucose level',
'Le Thi Huong','0912345678',3,3,'https://i.pravatar.cc/300?img=15');

-- ROOM PATIENT
INSERT INTO `roompatient` (`roomID`,`patientID`) VALUES
(1,1),
(1,2);

-- NURSE PATIENT
INSERT INTO `nursepatient` (`nurseID`,`patientID`) VALUES
(1,1),
(1,2);

-- SCHEDULES
INSERT INTO `schedules`
(`scheduleID`,`name`,`date`,`start_at`,`working_hours`,`nurseID`,`roomID`,`color`) VALUES
(1,'Morning Patient Monitoring','2026-03-15','08:00:00',4,1,1,'green'),
(2,'Evening Medication Round','2026-03-15','18:00:00',3,1,1,'blue'),
(3,'Morning Vital Check','2026-03-16','08:00:00',4,1,1,'green'),
(4,'Patient Medication Round','2026-03-16','13:00:00',3,1,1,'blue'),
(5,'Evening Patient Monitoring','2026-03-16','18:00:00',3,1,1,'purple'),
(6,'Morning Ward Inspection','2026-03-17','08:30:00',4,1,1,'green'),
(7,'Afternoon Treatment Support','2026-03-17','14:00:00',3,1,1,'orange'),
(8,'Night Observation','2026-03-17','20:00:00',4,1,1,'red'),
(9,'Patient Health Assessment','2026-03-18','09:00:00',4,1,1,'green'),
(10,'Medication Distribution','2026-03-18','13:30:00',3,1,1,'blue');

-- APPOINTMENTS
INSERT INTO `appointment`
(`appointmentID`,`dateTime`,`location`,`appointmentStatus`,`doctorID`,`userID`) VALUES

-- overdue
(1,'2026-03-10 08:30:00','Room 208B11',1,1,2),
(2,'2026-03-11 14:00:00','Room 208B11',1,1,3),
(3,'2026-03-12 10:15:00','Room 301B10',1,1,2),

-- current
(4,'2026-03-15 08:00:00','Room 208B11',0,1,2),
(5,'2026-03-15 09:30:00','Room 208B11',0,1,3),
(6,'2026-03-15 11:00:00','Room 301B10',0,1,2),
(7,'2026-03-15 13:30:00','Room 301B10',0,1,3),
(8,'2026-03-15 15:00:00','Room 208B11',0,1,2),

-- upcoming
(9,'2026-03-18 09:00:00','Room 208B11',0,1,2),
(10,'2026-03-20 09:30:00','Room 208B11',0,1,2),
(11,'2026-03-21 10:00:00','Room 208B11',0,1,3),
(12,'2026-03-22 10:30:00','Room 301B10',0,1,3);

-- NEWS
INSERT INTO `news`
(`newID`,`title`,`body`,`date`,`author`,`image`) VALUES
(1,'Voluntary Blood Donation Campaign 2026',
'Our hospital organized a voluntary blood donation event to support emergency patients.',
'2026-02-18','Hospital Management','./images/banner2.webp'),
(2,'Celebrating Vietnamese Women''s Day 20/10',
'The hospital organized health awareness seminars for women.',
'2025-10-20','Medical Department','./images/banner4.webp'),
(3,'Partnership with Ho Chi Minh City Oncology Hospital',
'The cooperation focuses on cancer diagnosis and treatment research.',
'2025-09-11','Hospital Director','./images/banner3.webp'),
(4,'Health Club Seminar: Breathing and Longevity',
'Doctors shared medical advice on improving respiratory health.',
'2025-10-28','Internal Medicine Department','./images/banner1.webp');

-- TEST RESULTS
INSERT INTO `testresult`
(`userID`,`title`,`datetime`,`testResultCode`,`status`,`type`,
`bloodGlucose`,`HbA1c`,`totalCholesterol`,`hdlCholesterol`,`ldlCholesterol`) VALUES

(2,'Annual Health Check','2026-02-28 08:30:00','TR-1001','Completed','Laboratory',
95.50,5.40,180.00,50.00,95.00),

(2,'Diabetes Screening','2026-01-10 09:15:00','TR-1002','Completed','Laboratory',
110.20,6.10,195.00,45.00,120.00),

(2,'Cardiac Risk Test','2026-02-15 14:00:00','TR-2001','Completed','Laboratory',
89.00,5.20,210.00,38.00,140.00),

(3,'Routine Blood Test','2026-02-25 11:45:00','TR-2002','Pending','Laboratory',
NULL,NULL,NULL,NULL,NULL),

(3,'Cholesterol Follow-up','2026-02-05 10:30:00','TR-3001','Failed','Laboratory',
100.00,5.80,205.00,42.00,130.00);


-- MEDICAL RECORDS
INSERT INTO `medicalrecords`
(`recordID`,`timeCreate`,`heartRate`,`pulse`,`height`,`weight`,`hurtScale`,
`temperature`,`currentCondition`,`SP02`,`healthStatus`,
`respiratoryRate`,`bloodPressure`,`urine`,`patientID`,`sensorium`,`oxygenTherapy`)
VALUES

(201,'2026-03-02 08:20:00',90,85,168,70,4,'37.2','High blood sugar symptoms','96',1,20,'135/88','Normal',2,1,0),
(202,'2026-03-02 14:30:00',88,83,168,70,3,'37.0','Insulin administered','97',1,19,'132/86','Normal',2,1,0),
(203,'2026-03-03 09:10:00',86,82,168,70,3,'36.9','Blood glucose improving','97',1,19,'130/85','Normal',2,1,0),
(204,'2026-03-03 16:40:00',85,80,168,70,2,'36.8','Patient stable','98',1,18,'128/84','Normal',2,1,0),
(205,'2026-03-04 08:50:00',84,79,168,70,2,'36.8','Condition improving','98',1,18,'126/82','Normal',2,1,0),
(206,'2026-03-04 15:10:00',83,78,168,70,2,'36.7','Glucose under control','98',1,18,'124/80','Normal',2,1,0),
(207,'2026-03-05 09:30:00',82,77,168,70,1,'36.6','Patient stable','99',1,17,'122/79','Normal',2,1,0),
(208,'2026-03-05 13:20:00',81,76,168,70,1,'36.6','No symptoms','99',1,17,'121/78','Normal',2,1,0),
(209,'2026-03-06 08:40:00',80,75,168,70,1,'36.5','Ready for discharge','99',1,17,'120/78','Normal',2,1,0),
(210,'2026-03-06 14:10:00',79,74,168,70,0,'36.5','Final check stable','99',1,17,'118/77','Normal',2,1,0);

INSERT INTO `medicalrecords`
(`recordID`,`timeCreate`,`heartRate`,`pulse`,`height`,`weight`,`hurtScale`,
`temperature`,`currentCondition`,`SP02`,`healthStatus`,
`respiratoryRate`,`bloodPressure`,`urine`,`patientID`,`sensorium`,`oxygenTherapy`)
VALUES

(101,'2026-03-01 08:30:00',82,78,175,75,2,'36.7','Stable condition','98',1,18,'120/80','Normal',1,1,0),
(102,'2026-03-01 14:00:00',80,76,175,75,1,'36.8','Patient resting','98',1,17,'118/79','Normal',1,1,0),
(103,'2026-03-02 09:00:00',85,80,175,75,3,'37.1','Mild headache','97',1,19,'125/82','Normal',1,1,0),
(104,'2026-03-02 16:00:00',83,77,175,75,2,'36.9','Improving condition','98',1,18,'122/80','Normal',1,1,0),
(105,'2026-03-03 09:30:00',78,74,175,75,1,'36.6','Stable after medication','99',1,17,'118/78','Normal',1,1,0),
(106,'2026-03-03 15:20:00',79,75,175,75,1,'36.7','No complaints','99',1,17,'117/77','Normal',1,1,0),
(107,'2026-03-04 08:40:00',81,76,175,75,0,'36.6','Patient feeling better','99',1,18,'116/76','Normal',1,1,0),
(108,'2026-03-04 13:30:00',80,75,175,75,0,'36.7','Stable vital signs','99',1,18,'115/75','Normal',1,1,0),
(109,'2026-03-05 09:10:00',77,73,175,75,0,'36.5','Ready for discharge','99',1,17,'114/74','Normal',1,1,0),
(110,'2026-03-05 15:00:00',76,72,175,75,0,'36.5','Final evaluation normal','99',1,17,'115/75','Normal',1,1,0);

-- MEDICINES
INSERT INTO medicines (medicineName, genericName, dosageForm, strength, description, isActive) VALUES
('Paracetamol','Acetaminophen','Tablet','500mg','Pain reliever and fever reducer',1),
('Ibuprofen','Ibuprofen','Tablet','400mg','Anti inflammatory pain relief',1),
('Aspirin','Acetylsalicylic Acid','Tablet','325mg','Pain relief and blood thinner',1),
('Amoxicillin','Amoxicillin','Capsule','500mg','Antibiotic for bacterial infection',1),
('Amoxicillin Clavulanate','Co-amoxiclav','Tablet','625mg','Broad spectrum antibiotic',1),
('Azithromycin','Azithromycin','Tablet','500mg','Antibiotic',1),
('Ciprofloxacin','Ciprofloxacin','Tablet','500mg','Antibiotic',1),
('Clarithromycin','Clarithromycin','Tablet','500mg','Antibiotic',1),
('Doxycycline','Doxycycline','Capsule','100mg','Antibiotic',1),
('Metronidazole','Metronidazole','Tablet','500mg','Antibiotic and antiprotozoal',1),

('Cefixime','Cefixime','Capsule','200mg','Antibiotic',1),
('Ceftriaxone','Ceftriaxone','Injection','1g','Antibiotic',1),
('Levofloxacin','Levofloxacin','Tablet','500mg','Antibiotic',1),
('Moxifloxacin','Moxifloxacin','Tablet','400mg','Antibiotic',1),
('Vancomycin','Vancomycin','Injection','1g','Antibiotic',1),
('Linezolid','Linezolid','Tablet','600mg','Antibiotic',1),
('Clindamycin','Clindamycin','Capsule','300mg','Antibiotic',1),
('Fluconazole','Fluconazole','Tablet','150mg','Antifungal',1),
('Ketoconazole','Ketoconazole','Cream','2%','Antifungal cream',1),
('Nystatin','Nystatin','Suspension','100000U/ml','Antifungal oral suspension',1),

('Acyclovir','Acyclovir','Tablet','400mg','Antiviral',1),
('Valacyclovir','Valacyclovir','Tablet','500mg','Antiviral',1),
('Oseltamivir','Oseltamivir','Capsule','75mg','Antiviral influenza treatment',1),
('Omeprazole','Omeprazole','Capsule','20mg','Reduces stomach acid',1),
('Pantoprazole','Pantoprazole','Tablet','40mg','Acid reflux treatment',1),
('Esomeprazole','Esomeprazole','Capsule','40mg','GERD treatment',1),
('Famotidine','Famotidine','Tablet','20mg','Acid reducer',1),
('Domperidone','Domperidone','Tablet','10mg','Anti nausea',1),
('Ondansetron','Ondansetron','Tablet','8mg','Antiemetic',1),
('Loperamide','Loperamide','Capsule','2mg','Treats diarrhea',1),

('Metformin','Metformin','Tablet','500mg','Type 2 diabetes medication',1),
('Insulin Glargine','Insulin','Injection','100IU/ml','Long acting insulin',1),
('Insulin Aspart','Insulin','Injection','100IU/ml','Rapid acting insulin',1),
('Atorvastatin','Atorvastatin','Tablet','20mg','Cholesterol control',1),
('Simvastatin','Simvastatin','Tablet','20mg','Cholesterol control',1),
('Rosuvastatin','Rosuvastatin','Tablet','10mg','Cholesterol control',1),
('Amlodipine','Amlodipine','Tablet','5mg','Blood pressure control',1),
('Lisinopril','Lisinopril','Tablet','10mg','ACE inhibitor',1),
('Losartan','Losartan','Tablet','50mg','Blood pressure treatment',1),
('Hydrochlorothiazide','Hydrochlorothiazide','Tablet','25mg','Diuretic',1),

('Furosemide','Furosemide','Tablet','40mg','Diuretic',1),
('Spironolactone','Spironolactone','Tablet','25mg','Diuretic',1),
('Bisoprolol','Bisoprolol','Tablet','5mg','Beta blocker',1),
('Carvedilol','Carvedilol','Tablet','12.5mg','Heart medication',1),
('Digoxin','Digoxin','Tablet','0.25mg','Heart failure treatment',1),
('Nitroglycerin','Nitroglycerin','Tablet','0.4mg','Chest pain treatment',1),
('Warfarin','Warfarin','Tablet','5mg','Blood thinner',1),
('Clopidogrel','Clopidogrel','Tablet','75mg','Antiplatelet drug',1),
('Heparin','Heparin','Injection','5000IU','Anticoagulant',1),
('Atenolol','Atenolol','Tablet','50mg','Blood pressure control',1),

('Tramadol','Tramadol','Capsule','50mg','Pain relief',1),
('Codeine','Codeine','Tablet','30mg','Pain relief',1),
('Morphine','Morphine','Injection','10mg','Severe pain treatment',1),
('Ketorolac','Ketorolac','Injection','30mg','Pain relief',1),
('Meloxicam','Meloxicam','Tablet','7.5mg','Anti inflammatory',1),
('Diclofenac','Diclofenac','Tablet','50mg','Pain and inflammation',1),
('Celecoxib','Celecoxib','Capsule','200mg','Anti inflammatory',1),
('Allopurinol','Allopurinol','Tablet','300mg','Gout treatment',1),
('Colchicine','Colchicine','Tablet','0.6mg','Gout medication',1),
('Tamsulosin','Tamsulosin','Capsule','0.4mg','Prostate treatment',1),

('Finasteride','Finasteride','Tablet','5mg','Prostate medication',1),
('Sildenafil','Sildenafil','Tablet','50mg','Erectile dysfunction',1),
('Tadalafil','Tadalafil','Tablet','10mg','Erectile dysfunction',1),
('Fluoxetine','Fluoxetine','Capsule','20mg','Antidepressant',1),
('Sertraline','Sertraline','Tablet','50mg','Antidepressant',1),
('Citalopram','Citalopram','Tablet','20mg','Antidepressant',1),
('Escitalopram','Escitalopram','Tablet','10mg','Antidepressant',1),
('Amitriptyline','Amitriptyline','Tablet','25mg','Antidepressant',1),
('Diazepam','Diazepam','Tablet','5mg','Anxiety treatment',1),
('Lorazepam','Lorazepam','Tablet','1mg','Anxiety treatment',1),

('Alprazolam','Alprazolam','Tablet','0.5mg','Anxiety medication',1),
('Zolpidem','Zolpidem','Tablet','10mg','Sleep medication',1),
('Melatonin','Melatonin','Tablet','3mg','Sleep aid',1),
('Cetirizine','Cetirizine','Tablet','10mg','Allergy medication',1),
('Loratadine','Loratadine','Tablet','10mg','Antihistamine',1),
('Diphenhydramine','Diphenhydramine','Capsule','25mg','Allergy relief',1),
('Fexofenadine','Fexofenadine','Tablet','180mg','Antihistamine',1),
('Montelukast','Montelukast','Tablet','10mg','Asthma prevention',1),
('Salbutamol','Salbutamol','Inhaler','100mcg','Bronchodilator for asthma',1),
('Budesonide','Budesonide','Inhaler','200mcg','Asthma treatment',1),

('Beclomethasone','Beclomethasone','Inhaler','100mcg','Asthma treatment',1),
('Salbutamol Syrup','Salbutamol','Syrup','2mg/5ml','Asthma syrup',1),
('Guaifenesin','Guaifenesin','Syrup','100mg/5ml','Cough expectorant',1),
('Dextromethorphan','Dextromethorphan','Syrup','15mg/5ml','Cough suppressant',1),
('Hydrocortisone','Hydrocortisone','Cream','1%','Skin inflammation treatment',1),
('Betamethasone','Betamethasone','Cream','0.05%','Skin inflammation',1),
('Mupirocin','Mupirocin','Ointment','2%','Topical antibiotic',1),
('Calcium Carbonate','Calcium','Tablet','500mg','Calcium supplement',1),
('Vitamin C','Ascorbic Acid','Tablet','500mg','Vitamin supplement',1),
('Vitamin D3','Cholecalciferol','Capsule','1000IU','Vitamin supplement',1),

('Iron','Ferrous Sulfate','Tablet','325mg','Iron supplement',1),
('Folic Acid','Folic Acid','Tablet','5mg','Vitamin B9 supplement',1),
('Zinc','Zinc','Tablet','50mg','Mineral supplement',1),
('Magnesium','Magnesium','Tablet','250mg','Mineral supplement',1),
('Potassium Chloride','Potassium','Tablet','20mEq','Electrolyte supplement',1);

-- PRESCRIPTIONS
INSERT INTO prescriptions (patientID, doctorID, diagnosis, notes)
VALUES (1, 1, 'Flu', 'Drink more water and rest');
INSERT INTO prescription_items
(prescriptionID, medicineID, dosage, frequency, durationDays, quantity, instructions)
VALUES
(1, 1, '1 tablet', '3 times/day', 5, 15, 'After meals'),
(1, 5, '1 capsule', '2 times/day', 7, 14, 'After meals');