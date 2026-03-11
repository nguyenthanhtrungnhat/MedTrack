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

CREATE TABLE `prescriptions` (
  `prescriptionID` INT NOT NULL AUTO_INCREMENT,
  `patientID` INT NOT NULL,
  `doctorID` INT NOT NULL,
  `diagnosis` VARCHAR(1000) DEFAULT NULL,
  `notes` VARCHAR(1000) DEFAULT NULL,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`prescriptionID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

//example data
INSERT INTO prescriptions (patientID, doctorID, diagnosis, notes)
VALUES (1, 2, 'Flu', 'Drink more water and rest');
INSERT INTO prescription_items
(prescriptionID, medicineID, dosage, frequency, durationDays, quantity, instructions)
VALUES
(1, 1, '1 tablet', '3 times/day', 5, 15, 'After meals'),
(1, 5, '1 capsule', '2 times/day', 7, 14, 'After meals');

//insert 100 popular medicines
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