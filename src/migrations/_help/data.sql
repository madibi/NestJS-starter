-- Language
INSERT INTO 
"COMMON"."Language" 
("id", "name", "languageCode", "languageLocale", "phonePrefix", "flagUrl", "direction", "dateType")
VALUES  
('1', 'english', 'en', 'US', '+1', 'flags\us.gif', 'LTR', 'gregorian'),
('2', 'فارسی', 'fa', 'IR', '+98', 'flags\ir.gif', 'RTL', 'jalali'),
('3', 'հայերեն', 'hy', 'AM', '+374', 'flags\am.gif', 'LTR', 'gregorian')
-- ('4', 'türk', 'tr', 'TR', '+90', 'flags\tr.gif', 'LTR', 'gregorian')
;

-- Role
INSERT INTO 
"USER"."Role" 
("id", "key", "name")
VALUES  
('1', 'PROGRAMMER', 'programmer'),
('10', 'ADMIN', 'admin'),
('20', 'SUPER_VISOR', 'super visor'),
('30', 'POWER_USER', 'power user'),
('40', 'USER', 'user'),
('50', 'GUEST', 'guest')
;

-- EnumOptionSample
INSERT INTO 
"ENUM"."EnumOptionSample" 
("id", "nameKW")
VALUES  
('1', 'GOOD'),
('2', 'BAD'),
('3','UGLY')
;

-- EnumOptionSampleLocalize
INSERT INTO 
"ENUM"."EnumOptionSampleLocalize" 
("id", "enumOptionSampleId", "languageId", "name")
VALUES  
('1', 1, 1, 'good'),
('2', 1, 2, 'خوب'),
('3', 1, 3, 'լավ'),
('4', 2, 1, 'bad'),
('5', 2, 2, 'بد'),
('6', 2, 3, 'վատ'),
('7', 3, 1, 'ugly'),
('8', 3, 2, 'زشت'),
('9', 3, 3, 'տգեղ')
;