import fs from 'fs';
import path from 'path';

const topicsDir = 'd:\\Home\\Work\\English\\study-english\\src\\data\\topics';

const dataFile = process.argv[2];

if (!dataFile) {
    console.error('Please provide a data file path.');
    process.exit(1);
}

const rawData = fs.readFileSync(dataFile, 'utf8');
const updates = JSON.parse(rawData);

updates.forEach(update => {
    const filePath = path.join(topicsDir, `${update.id}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const json = JSON.parse(content);

            json.vocabulary = update.vocabulary;
            json.hasContent = true;

            fs.writeFileSync(filePath, JSON.stringify(json, null, 2));
            console.log(`Updated ${update.id}.json`);
        } catch (err) {
            console.error(`Error updating ${update.id}.json:`, err.message);
        }
    } else {
        console.warn(`File not found: ${filePath}`);
    }
});
