import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const topicsDir = path.join(__dirname, '../src/data/topics');

fs.readdir(topicsDir, (err, files) => {
    if (err) {
        console.error('Error reading directory:', err);
        return;
    }

    files.forEach(file => {
        if (path.extname(file) === '.json' && file !== '1.json') {
            const filePath = path.join(topicsDir, file);

            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(`Error reading file ${file}:`, err);
                    return;
                }

                try {
                    let json = JSON.parse(data);
                    let modified = false;

                    if (json.vocabulary && Array.isArray(json.vocabulary)) {
                        json.vocabulary = json.vocabulary.map(item => {
                            // Handle example
                            if (item.example && typeof item.example === 'string') {
                                item.example = {
                                    en: item.example,
                                    vi: ""
                                };
                                modified = true;
                            }

                            // Handle conversation
                            if (!item.conversation) {
                                item.conversation = [];
                                modified = true;
                            } else if (Array.isArray(item.conversation)) {
                                item.conversation = item.conversation.map(conv => {
                                    if (conv.text) {
                                        modified = true;
                                        return {
                                            speaker: conv.speaker,
                                            en: conv.text,
                                            vi: ""
                                        }
                                    }
                                    return conv;
                                });
                            }

                            return item;
                        });
                    }

                    // Always write to ensure consistency or if modified
                    fs.writeFile(filePath, JSON.stringify(json, null, 2), (err) => {
                        if (err) {
                            console.error(`Error writing file ${file}:`, err);
                        } else {
                            console.log(`Updated ${file}`);
                        }
                    });

                } catch (parseErr) {
                    console.error(`Error parsing JSON in ${file}:`, parseErr);
                }
            });
        }
    });
});
