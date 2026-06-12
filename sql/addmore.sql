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
(patientID,HI,admissionDate,dischargeDate,
hospitalizationsDiagnosis,summaryCondition,dischargeDiagnosis,
relativeName,relativeNumber,userID,image)
VALUES
(3,'HI-2026-003','2026-03-10','2026-03-14','Flu','Recovering','Stable','Relative A','0900000001',6,'https://i.pravatar.cc/300?img=21'),
(4,'HI-2026-004','2026-03-11','2026-03-15','Asthma','Under control','Stable','Relative B','0900000002',7,'https://i.pravatar.cc/300?img=22'),
(5,'HI-2026-005','2026-03-12','2026-03-16','Hypertension','Improving','Stable','Relative C','0900000003',8,'https://i.pravatar.cc/300?img=23'),
(6,'HI-2026-006','2026-03-13','2026-03-17','Diabetes','Stable','Controlled','Relative D','0900000004',9,'https://i.pravatar.cc/300?img=24'),
(7,'HI-2026-007','2026-03-14','2026-03-18','Infection','Recovering','Stable','Relative E','0900000005',10,'https://i.pravatar.cc/300?img=25'),
(8,'HI-2026-008','2026-03-15','2026-03-19','Fracture','Healing','Stable','Relative F','0900000006',11,'https://i.pravatar.cc/300?img=26'),
(9,'HI-2026-009','2026-03-16','2026-03-20','Migraine','Improving','Stable','Relative G','0900000007',12,'https://i.pravatar.cc/300?img=27'),
(10,'HI-2026-010','2026-03-17','2026-03-21','Allergy','Stable','Controlled','Relative H','0900000008',13,'https://i.pravatar.cc/300?img=28'),
(11,'HI-2026-011','2026-03-18','2026-03-22','Gastritis','Recovering','Stable','Relative I','0900000009',14,'https://i.pravatar.cc/300?img=29'),
(12,'HI-2026-012','2026-03-19','2026-03-23','Pneumonia','Improving','Stable','Relative J','0900000010',15,'https://i.pravatar.cc/300?img=30'),
(13,'HI-2026-013','2026-03-20','2026-03-24','Kidney issue','Stable','Controlled','Relative K','0900000011',16,'https://i.pravatar.cc/300?img=31'),
(14,'HI-2026-014','2026-03-21','2026-03-25','Back pain','Improving','Stable','Relative L','0900000012',17,'https://i.pravatar.cc/300?img=32'),
(15,'HI-2026-015','2026-03-22','2026-03-26','Heart check','Stable','Normal','Relative M','0900000013',18,'https://i.pravatar.cc/300?img=33'),
(16,'HI-2026-016','2026-03-23','2026-03-27','Diabetes','Stable','Controlled','Relative N','0900000014',19,'https://i.pravatar.cc/300?img=34'),
(17,'HI-2026-017','2026-03-24','2026-03-28','Flu','Recovering','Stable','Relative O','0900000015',20,'https://i.pravatar.cc/300?img=35');

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

INSERT INTO appointment
(appointmentID, dateTime, location, appointmentStatus, doctorID, userID)
VALUES
(13,'2026-03-10 08:00:00','Room 208B11',0,2,1),
(14,'2026-03-10 09:00:00','Room 301B10',0,3,2),
(15,'2026-03-10 10:00:00','Room 302A05',0,4,3),
(16,'2026-03-10 11:00:00','Room 208B11',0,5,4),
(17,'2026-03-10 13:00:00','Room 301B10',0,6,5),

(18,'2026-03-11 08:00:00','Room 302A05',0,7,6),
(19,'2026-03-11 09:00:00','Room 208B11',0,8,7),
(20,'2026-03-11 10:00:00','Room 301B10',0,9,8),
(21,'2026-03-11 11:00:00','Room 302A05',0,10,9),
(22,'2026-03-11 13:00:00','Room 208B11',0,11,10),

(23,'2026-03-12 08:00:00','Room 301B10',0,2,11),
(24,'2026-03-12 09:00:00','Room 302A05',0,3,12),
(25,'2026-03-12 10:00:00','Room 208B11',0,4,13),
(26,'2026-03-12 11:00:00','Room 301B10',0,5,14),
(27,'2026-03-12 13:00:00','Room 302A05',0,6,15),

(28,'2026-03-13 08:00:00','Room 208B11',0,7,1),
(29,'2026-03-13 09:00:00','Room 301B10',0,8,2),
(30,'2026-03-13 10:00:00','Room 302A05',0,9,3),
(31,'2026-03-13 11:00:00','Room 208B11',0,10,4),
(32,'2026-03-13 13:00:00','Room 301B10',0,11,5),

(33,'2026-03-14 08:00:00','Room 302A05',0,2,6),
(34,'2026-03-14 09:00:00','Room 208B11',0,3,7),
(35,'2026-03-14 10:00:00','Room 301B10',0,4,8),
(36,'2026-03-14 11:00:00','Room 302A05',0,5,9),
(37,'2026-03-14 13:00:00','Room 208B11',0,6,10),

(38,'2026-03-15 08:00:00','Room 301B10',0,7,11),
(39,'2026-03-15 09:00:00','Room 302A05',0,8,12),
(40,'2026-03-15 10:00:00','Room 208B11',0,9,13),
(41,'2026-03-15 11:00:00','Room 301B10',0,10,14),
(42,'2026-03-15 13:00:00','Room 302A05',0,11,15),

(43,'2026-03-16 08:00:00','Room 208B11',0,2,16),
(44,'2026-03-16 09:00:00','Room 301B10',0,3,17),
(45,'2026-03-16 10:00:00','Room 302A05',0,4,1),
(46,'2026-03-16 11:00:00','Room 208B11',0,5,2),
(47,'2026-03-16 13:00:00','Room 301B10',0,6,3),

(48,'2026-03-17 08:00:00','Room 302A05',0,7,4),
(49,'2026-03-17 09:00:00','Room 208B11',0,8,5),
(50,'2026-03-17 10:00:00','Room 301B10',0,9,6),
(51,'2026-03-17 11:00:00','Room 302A05',0,10,7),
(52,'2026-03-17 13:00:00','Room 208B11',0,11,8);

INSERT INTO roompatient (roomID, patientID) VALUES
(2,1),
(1,2),
(3,3),
(2,4),
(1,5),
(3,6),
(2,7),
(3,8),
(1,9),
(2,10),
(3,11),
(1,12),
(2,13),
(3,14),
(1,15),
(2,16),
(3,17);