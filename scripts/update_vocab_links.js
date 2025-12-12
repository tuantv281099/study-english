import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// scripts/ is where this file is. data is in ../src/data/topics
const topicsDir = path.resolve(__dirname, '../src/data/topics');

console.log(`Scanning directory: ${topicsDir}`);

async function updateFiles() {
    try {
        const files = await fs.promises.readdir(topicsDir);
        let updatedCount = 0;

        for (const file of files) {
            if (path.extname(file) === '.json') {
                const filePath = path.join(topicsDir, file);
                try {
                    const content = await fs.promises.readFile(filePath, 'utf8');
                    const json = JSON.parse(content);
                    let modified = false;

                    if (json.vocabulary && Array.isArray(json.vocabulary)) {
                        for (const item of json.vocabulary) {
                            if (item.word) {
                                // "Good morning" -> "Good%20morning"
                                const link = `https://youglish.com/pronounce/${encodeURIComponent(item.word)}/english`;
                                if (item.conversation !== link) {
                                    item.conversation = link;
                                    modified = true;
                                }
                            }
                        }
                    }

                    if (modified) {
                        await fs.promises.writeFile(filePath, JSON.stringify(json, null, 2), 'utf8');
                        updatedCount++;
                    }
                } catch (err) {
                    console.error(`Error processing ${file}:`, err);
                }
            }
        }
        console.log(`Done. Updated ${updatedCount} files.`);
    } catch (err) {
        console.error('Error reading directory:', err);
    }
}

updateFiles();
