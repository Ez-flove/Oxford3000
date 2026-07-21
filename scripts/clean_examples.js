const fs = require('fs');
const path = require('path');
const { buildExample } = require('./example_generator');

const targets = [
  path.join(__dirname, '../seed_data.json'),
  path.join(__dirname, '../backend/prisma/seed_data.json'),
];

for (const target of targets) {
  const data = JSON.parse(fs.readFileSync(target, 'utf-8'));
  let changed = 0;

  data.vocabularies = data.vocabularies.map((vocab) => {
    const example = buildExample(vocab);
    if (
      vocab.exampleSentence !== example.exampleSentence ||
      vocab.exampleMeaning !== example.exampleMeaning ||
      vocab.exampleTense !== example.exampleTense
    ) {
      changed += 1;
    }

    return {
      ...vocab,
      exampleSentence: example.exampleSentence,
      exampleMeaning: example.exampleMeaning,
      exampleTense: example.exampleTense,
    };
  });

  fs.writeFileSync(target, `${JSON.stringify(data, null, 2)}\n`, 'utf-8');
  console.log(`${path.relative(process.cwd(), target)}: updated ${changed} examples`);
}
