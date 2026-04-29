const fs = require('fs');

const rawTier2 = fs.readFileSync('raw_tier2.txt', 'utf8');
let c = fs.readFileSync('src/data/analogies.ts', 'utf8');

const endDestructuringTarget = `\`
        \`
      }`;
const targetIndex = c.indexOf(endDestructuringTarget);

if (targetIndex > -1) {
    const insertPosition = targetIndex + endDestructuringTarget.length;
    c = c.substring(0, insertPosition) + rawTier2 + c.substring(insertPosition);
    fs.writeFileSync('src/data/analogies.ts', c, 'utf8');
    console.log("Successfully appended Tier 2 modules to analogies.ts");
} else {
    console.log("Could not find insertion target in analogies.ts");
}
