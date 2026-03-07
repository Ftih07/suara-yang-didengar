const fs = require('fs');

let content = fs.readFileSync('data/chapter-5.ts', 'utf8');

// Change import
content = content.replace('import type { Scene } from "./story";', 'import type { ChapterData } from "../types/chapter-data";');

// Change type
content = content.replace('export const chapter5Data: Record<string, Scene> = {', 'export const chapter5Data: Record<string, ChapterData> = {');

const regex = /(\s+id:\s*"[^"]+",\s+backgroundImage:[\s\S]+?text:\s*".+?",)\s+choices:\s*\[([\s\S]*?)\](,)?\s+}/g;

content = content.replace(regex, (match, prefix, choicesStr, comma) => {
    if (choicesStr.trim() === '') {
        return prefix + '\n        nextSceneId: "",\n        choices: []\n    }';
    }

    const nextIds = [...choicesStr.matchAll(/nextId:\s*"([^"]+)"/g)].map(m => m[1]);
    
    if (nextIds.length === 1 && !choicesStr.includes('effect:')) {
        return prefix + '\n        nextSceneId: "' + nextIds[0] + '"\n    }';
    } else {
        return prefix + '\n        nextSceneId: "",\n        choices: [' + choicesStr + ']\n    }';
    }
});

fs.writeFileSync('data/chapter-5.ts', content);
console.log('Done patch_ch5.js');
