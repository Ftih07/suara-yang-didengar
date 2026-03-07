const fs = require('fs');
let s = fs.readFileSync('data/story.ts', 'utf8');
s = s.replace('choices: Choice[];', 'choices?: Choice[];\n  nextSceneId?: string;');
fs.writeFileSync('data/story.ts', s);
