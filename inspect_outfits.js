const fs = require('fs');
const content = fs.readFileSync('index.html', 'utf8');

// Find all collection sections or cards with their images and text
const regex = /<div class="mod-scroll__proyectos__item[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
let match;
let count = 0;
while ((match = regex.exec(content)) !== null) {
    count++;
    console.log(`--- ITEM ${count} ---`);
    const imgMatch = match[0].match(/src="([^"]+)"/);
    const titleMatch = match[0].match(/<div class="[^"]*title[^"]*">([\s\S]*?)<\/div>/);
    const descMatch = match[0].match(/<p>([\s\S]*?)<\/p>/);
    if (imgMatch) console.log('Image:', imgMatch[1]);
    if (titleMatch) console.log('Title:', titleMatch[1].replace(/<[^>]+>/g, '').trim());
    if (descMatch) console.log('Desc:', descMatch[1].trim());
}

// Also check all other images in index.html
const allImgs = content.match(/src="(\.\/assets\/[^"]+)"/g) || [];
console.log('\n--- All Images in index.html ---');
allImgs.forEach((img, i) => console.log(i + ': ' + img));
