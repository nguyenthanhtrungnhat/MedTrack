CREATE TABLE treatment_sheet (
  sheetID INT AUTO_INCREMENT PRIMARY KEY,
  patientID INT NOT NULL,
  doctorID INT NULL,
  admissionNumber VARCHAR(50),
  patientCode VARCHAR(50),
  diagnosis TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patientID) REFERENCES patient(patientID) ON DELETE CASCADE
);

CREATE TABLE treatment_logs (
  logID INT AUTO_INCREMENT PRIMARY KEY,
  sheetID INT NOT NULL,
  logTime DATETIME,
  subjective TEXT,
  objective TEXT,
  assessment TEXT,
  plan TEXT,
  instruction TEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sheetID) REFERENCES treatment_sheet(sheetID) ON DELETE CASCADE
);