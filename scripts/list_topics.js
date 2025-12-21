import fs from 'fs';
import path from 'path';

const topicsDir = 'd:\\Home\\Work\\English\\study-english\\src\\data\\topics';
const outputFile = 'C:\\Users\\tuant\\.gemini\\antigravity\\brain\\1264638b-6ce0-44e7-b323-184e35d68a8b\\topics_list.json';

const topics = [];

// Ensure output directory exists
const outputDir = path.dirname(outputFile);
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

for (let i = 17; i <= 300; i++) {
    const filePath = path.join(topicsDir, `${i}.json`);
    if (fs.existsSync(filePath)) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const json = JSON.parse(content);
            topics.push({ id: json.id, title: json.title });
        } catch (err) {
            console.error(`Error reading ${i}.json:`, err.message);
        }
    }
}

fs.writeFileSync(outputFile, JSON.stringify(topics, null, 2));
console.log(`Extracted ${topics.length} topics to ${outputFile}`);
