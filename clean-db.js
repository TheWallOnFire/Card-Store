const fs = require('fs');
const path = require('path');

const dbDir = path.join(__dirname, 'db');

const filesToKeep = [
  '00_extensions_types.sql',
  '00_init_uuid.sql',
  '01_tables.sql',
  '01_type_item_condition.sql',
  '02_functions_triggers.sql',
  '02_type_post_category.sql',
  '03_rls_policies.sql',
  '20_table_audit_logs.sql',
  'initial_schema.sql'
];

fs.readdirSync(dbDir).forEach(file => {
  if (file.endsWith('.sql') && !filesToKeep.includes(file)) {
    fs.unlinkSync(path.join(dbDir, file));
    console.log(`Deleted redundant SQL: ${file}`);
  }
});
