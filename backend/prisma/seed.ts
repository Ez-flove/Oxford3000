import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';
import {
  cleanExampleMeaning,
  cleanExampleSentence,
} from '../src/vocabularies/example-utils';

const connectionString =
  process.env.MONGODB_URI || process.env.DATABASE_URL || '';

if (!connectionString) {
  throw new Error('MONGODB_URI or DATABASE_URL is not set in .env');
}

const prisma = new PrismaClient();

async function main() {
  console.log('Bắt đầu gieo mầm (seeding) cơ sở dữ liệu...');

  // Đọc tệp seed_data.json
  const seedDataPath = path.join(__dirname, 'seed_data.json');
  if (!fs.existsSync(seedDataPath)) {
    throw new Error(`Không tìm thấy file dữ liệu seed tại: ${seedDataPath}`);
  }

  const rawData = fs.readFileSync(seedDataPath, 'utf-8');
  const { topics, vocabularies } = JSON.parse(rawData);

  console.log(
    `Đã đọc được ${topics.length} chủ đề và ${vocabularies.length} từ vựng.`,
  );

  // Xóa dữ liệu cũ
  console.log('Đang làm sạch dữ liệu cũ...');
  await prisma.vocabulary.deleteMany();
  await prisma.topic.deleteMany();
  console.log('Làm sạch dữ liệu thành công.');

  // Tạo các chủ đề
  console.log('Đang tạo các chủ đề...');
  for (const topic of topics) {
    await prisma.topic.create({
      data: {
        id: topic.id,
        title: topic.title,
        slug: topic.slug,
        description: topic.description,
        orderIndex: topic.orderIndex,
        isActive: topic.isActive,
      },
    });
  }
  console.log(`Đã tạo xong ${topics.length} chủ đề.`);

  // Tạo các từ vựng theo lô (batch)
  console.log('Đang tạo từ vựng...');
  const batchSize = 100;
  for (let i = 0; i < vocabularies.length; i += batchSize) {
    const batch = vocabularies.slice(i, i + batchSize);

    await prisma.vocabulary.createMany({
      data: batch.map((vocab: any) => ({
        id: vocab.id,
        word: vocab.word,
        partOfSpeech: vocab.partOfSpeech,
        ipa: vocab.ipa,
        meaningVi: vocab.meaningVi,
        imageUrl: vocab.imageUrl,
        audioUrl: vocab.audioUrl,
        exampleSentence: cleanExampleSentence(vocab.exampleSentence),
        exampleMeaning: cleanExampleMeaning(vocab.exampleMeaning),
        exampleTense: vocab.exampleTense,
        orderNumber: vocab.orderNumber,
        topicId: vocab.topicId,
      })),
    });
    console.log(
      `Đã nạp ${Math.min(i + batchSize, vocabularies.length)} / ${vocabularies.length} từ vựng...`,
    );
  }

  console.log('Gieo mầm dữ liệu thành công 100%!');
}

main()
  .catch((e) => {
    console.error('Lỗi khi seeding cơ sở dữ liệu:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
