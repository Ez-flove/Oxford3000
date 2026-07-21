const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { buildExample } = require('./example_generator');

const vocabList = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../vocabularies_clean.json'), 'utf-8')
);

const chunkSize = 50;
const topics = [];
const vocabulariesWithTopic = [];

const totalWords = vocabList.length;
const totalTopics = Math.ceil(totalWords / chunkSize);

for (let i = 0; i < totalTopics; i++) {
  const startIdx = i * chunkSize;
  const endIdx = Math.min(startIdx + chunkSize, totalWords);
  const chunk = vocabList.slice(startIdx, endIdx);

  const firstWord = chunk[0].word;
  const lastWord = chunk[chunk.length - 1].word;

  const topicId = crypto.randomUUID();
  const topicTitle = `Topic ${i + 1}: ${firstWord} - ${lastWord}`;
  const topicSlug = `topic-${i + 1}`;

  topics.push({
    id: topicId,
    title: topicTitle,
    slug: topicSlug,
    description: `Học các từ vựng tiếng Anh Oxford thông dụng từ "${firstWord}" đến "${lastWord}"`,
    orderIndex: i + 1,
    imageUrl: null,
    isActive: true
  });

  chunk.forEach(vocab => {
    const example = buildExample(vocab);
    // Thêm các trường dữ liệu còn lại theo thiết kế (ảnh, audio phát âm mẫu, câu ví dụ, dịch câu ví dụ)
    vocabulariesWithTopic.push({
      id: crypto.randomUUID(),
      no: vocab.no,
      word: vocab.word,
      partOfSpeech: vocab.type,
      ipa: vocab.pronounce,
      meaningVi: vocab.meaning,
      imageUrl: null,
      audioUrl: null, // Sẽ được sinh tự động bằng Text-to-Speech hoặc link CDN
      exampleSentence: example.exampleSentence,
      exampleMeaning: example.exampleMeaning,
      exampleTense: example.exampleTense,
      orderNumber: vocab.no,
      topicId: topicId
    });
  });
}

// Ghi dữ liệu đã sẵn sàng gieo mầm (seeded data)
const seedData = {
  topics,
  vocabularies: vocabulariesWithTopic
};

fs.writeFileSync(
  path.join(__dirname, '../seed_data.json'),
  JSON.stringify(seedData, null, 2),
  'utf-8'
);

console.log(`Đã gộp thành công ${topics.length} chủ đề và ${vocabulariesWithTopic.length} từ vựng.`);
console.log('Ví dụ chủ đề 1:', topics[0]);
console.log('Ví dụ từ vựng 1:', vocabulariesWithTopic[0]);
