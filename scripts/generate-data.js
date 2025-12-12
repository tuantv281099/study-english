import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Root is 'study-english' (parent of 'app', which is parent of 'scripts')
const rootDir = path.resolve(__dirname, '../');
const listFile = path.join(rootDir, 'DANH SÁCH TOÀN BỘ 300 CHỦ ĐỀ.md');
const outputFile = path.join(__dirname, '../src/data.json');

console.log('Scanning directories in:', rootDir);

function parseVocabulary(content) {
    const lines = content.split('\n');
    const vocab = [];
    let insideTable = false;

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.toLowerCase().includes('| vocabulary |')) {
            insideTable = true;
            continue;
        }
        if (line.includes('---')) continue;

        if (insideTable && line.trim().startsWith('|')) {
            const parts = line.split('|').map(p => p.trim());
            const cols = parts.filter(p => p !== '');

            if (cols.length >= 3) { // Ensure at least Word, IPA, Meaning
                const word = cols[0].replace(/\*\*/g, '');
                const ipa = cols[1];
                const meaning = cols[2];
                const example = cols[3] ? cols[3].replace(/\*\*/g, '') : '';
                vocab.push({ word, ipa, meaning, example });
            }
        }
    }
    return vocab;
}

function parseConversation(content) {
    const lines = content.split('\n');
    const conversation = [];
    let capture = false;

    for (const line of lines) {
        if (line.includes('## 1. Conversation')) {
            capture = true;
            continue;
        }
        if (line.includes('## 2.') || line.includes('Translation') || line.trim() === '---') {
            capture = false;
        }

        if (capture && line.trim() !== '') {
            const match = line.match(/^\*\*(.*?):\*\* (.*)/);
            if (match) {
                conversation.push({ speaker: match[1], text: match[2] });
            }
        }
    }
    return conversation;
}

const data = [];

try {
    const listContent = fs.readFileSync(listFile, 'utf-8');
    const listLines = listContent.split('\n');

    const allFiles = fs.readdirSync(rootDir);
    const directories = allFiles.filter(f => {
        try {
            return fs.statSync(path.join(rootDir, f)).isDirectory();
        } catch (e) { return false; }
    });

    const dataDir = path.join(__dirname, '../src/data');
    const topicsDir = path.join(dataDir, 'topics');

    // Ensure directories exist
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);
    if (!fs.existsSync(topicsDir)) fs.mkdirSync(topicsDir);

    const topicsList = [];

    for (const line of listLines) {
        const match = line.trim().match(/^(\d+)\.\s+(.*)/);
        if (!match) continue;

        const id = match[1];
        const title = line.trim();

        // Find folder starting with "id. " or equal to "id."
        const folderName = directories.find(dir => dir.startsWith(`${id}. `) || dir === `${id}.`);

        const topic = {
            id: id,
            title: title,
            hasContent: false,
            vocabulary: [],
            conversation: []
        };

        if (folderName) {
            const folderPath = path.join(rootDir, folderName);

            try {
                const vocabPath = path.join(folderPath, 'vocabulary.md');
                if (fs.existsSync(vocabPath)) {
                    topic.vocabulary = parseVocabulary(fs.readFileSync(vocabPath, 'utf-8'));
                }

                const lessonPath = path.join(folderPath, 'lessons.md');
                if (fs.existsSync(lessonPath)) {
                    topic.conversation = parseConversation(fs.readFileSync(lessonPath, 'utf-8'));
                }

                if (topic.vocabulary.length > 0 || topic.conversation.length > 0) {
                    topic.hasContent = true;
                }
            } catch (err) {
                console.error(`Error parsing topic ${id}:`, err);
            }
        }

        // Save individual topic file
        const topicFilePath = path.join(topicsDir, `${id}.json`);
        fs.writeFileSync(topicFilePath, JSON.stringify(topic, null, 2));

        // Add to summary list (without heavy content)
        topicsList.push({
            id: topic.id,
            title: topic.title,
            hasContent: topic.hasContent
        });
    }

    const indexFile = path.join(dataDir, 'topics.json');
    fs.writeFileSync(indexFile, JSON.stringify(topicsList, null, 2));
    console.log(`Successfully generated src/data/topics.json and ${topicsList.length} topic files in src/data/topics/`);

} catch (e) {
    console.error("Critical error:", e);
}
