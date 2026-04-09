const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'webstore', 'src');

// 1. Move test setup if it exists
const oldSetup = path.join(srcDir, 'test', 'setup.ts');
const newSetup = path.join(srcDir, '__tests__', 'setup.ts');

if (fs.existsSync(oldSetup)) {
    if (!fs.existsSync(path.join(srcDir, '__tests__'))) {
        fs.mkdirSync(path.join(srcDir, '__tests__'), { recursive: true });
    }
    fs.renameSync(oldSetup, newSetup);
    console.log(`Migrated test setup to: ${newSetup}`);
}

// 2. Define files and folders to delete
const itemsToDelete = [
    path.join(srcDir, 'components', 'layout'),
    path.join(srcDir, 'components', 'ui', 'ProductCard.tsx'),
    path.join(srcDir, 'test')
];

for (const item of itemsToDelete) {
    if (fs.existsSync(item)) {
        const stats = fs.statSync(item);
        if (stats.isDirectory()) {
            fs.rmSync(item, { recursive: true, force: true });
            console.log(`Deleted directory: ${item}`);
        } else {
            fs.unlinkSync(item);
            console.log(`Deleted file: ${item}`);
        }
    }
}
