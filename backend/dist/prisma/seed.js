"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
require("dotenv/config");
const example_utils_1 = require("../src/vocabularies/example-utils");
const connectionString = process.env.MONGODB_URI || process.env.DATABASE_URL || '';
if (!connectionString) {
    throw new Error('MONGODB_URI or DATABASE_URL is not set in .env');
}
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Bắt đầu gieo mầm (seeding) cơ sở dữ liệu...');
    const seedDataPath = path.join(__dirname, 'seed_data.json');
    if (!fs.existsSync(seedDataPath)) {
        throw new Error(`Không tìm thấy file dữ liệu seed tại: ${seedDataPath}`);
    }
    const rawData = fs.readFileSync(seedDataPath, 'utf-8');
    const { topics, vocabularies } = JSON.parse(rawData);
    console.log(`Đã đọc được ${topics.length} chủ đề và ${vocabularies.length} từ vựng.`);
    console.log('Đang làm sạch dữ liệu cũ...');
    await prisma.vocabulary.deleteMany();
    await prisma.topic.deleteMany();
    console.log('Làm sạch dữ liệu thành công.');
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
    console.log('Đang tạo từ vựng...');
    const batchSize = 100;
    for (let i = 0; i < vocabularies.length; i += batchSize) {
        const batch = vocabularies.slice(i, i + batchSize);
        await prisma.vocabulary.createMany({
            data: batch.map((vocab) => ({
                id: vocab.id,
                word: vocab.word,
                partOfSpeech: vocab.partOfSpeech,
                ipa: vocab.ipa,
                meaningVi: vocab.meaningVi,
                imageUrl: vocab.imageUrl,
                audioUrl: vocab.audioUrl,
                exampleSentence: (0, example_utils_1.cleanExampleSentence)(vocab.exampleSentence),
                exampleMeaning: (0, example_utils_1.cleanExampleMeaning)(vocab.exampleMeaning),
                exampleTense: vocab.exampleTense,
                orderNumber: vocab.orderNumber,
                topicId: vocab.topicId,
            })),
        });
        console.log(`Đã nạp ${Math.min(i + batchSize, vocabularies.length)} / ${vocabularies.length} từ vựng...`);
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
//# sourceMappingURL=seed.js.map