const fs = require('fs');
let content = fs.readFileSync('../sql/insert.sql', 'utf8');

// Match lines like: (3,'2026-03-10','2026-03-14','Flu','Recovering','Stable', 'Archived')
// Groups: 1=ID, 2=Date1, 3=Date2, 4=Diag1, 5=Cond, 6=Diag2, 7=Status
const regex = /\(([0-9]+),'([^']+)','([^']+)','([^']+)','([^']+)','([^']+)',\s*'([^']+)'\)/g;
content = content.replace(regex, "($1,'$2','$4','$5',NULL,'$7')");
fs.writeFileSync('../sql/insert.sql', content);
