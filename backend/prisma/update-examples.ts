import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const seedDataPath = path.join(__dirname, 'seed_data.json');
  const { vocabularies } = JSON.parse(fs.readFileSync(seedDataPath, 'utf-8'));

  console.log(`Đang cập nhật ví dụ cho ${vocabularies.length} từ vựng...`);

  const batchSize = 100;
  for (let i = 0; i < vocabularies.length; i += batchSize) {
    const batch = vocabularies.slice(i, i + batchSize);
    await prisma.$transaction(
      batch.map((vocab: any) =>
        prisma.vocabulary.update({
          where: { id: vocab.id },
          data: {
            exampleSentence: vocab.exampleSentence,
            exampleMeaning: vocab.exampleMeaning,
            exampleTense: vocab.exampleTense,
          },
        }),
      ),
    );
    console.log(
      `Đã cập nhật ${Math.min(i + batchSize, vocabularies.length)} / ${vocabularies.length}`,
    );
  }

  console.log('Cập nhật ví dụ hoàn tất.');
}

main()
  .catch((error) => {
    console.error('Lỗi khi cập nhật ví dụ:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
