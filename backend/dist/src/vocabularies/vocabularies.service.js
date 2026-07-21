"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VocabulariesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const example_utils_1 = require("./example-utils");
let VocabulariesService = class VocabulariesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async markLearned(userId, vocabularyId) {
        await this.ensureVocabulary(vocabularyId);
        const progress = await this.prisma.userProgress.upsert({
            where: { userId_vocabularyId: { userId, vocabularyId } },
            update: { isLearned: true, learnedAt: new Date() },
            create: { userId, vocabularyId, isLearned: true, learnedAt: new Date() },
        });
        await this.prisma.reviewSchedule.upsert({
            where: { userId_vocabularyId: { userId, vocabularyId } },
            update: {},
            create: { userId, vocabularyId },
        });
        return { vocabularyId: progress.vocabularyId, isLearned: progress.isLearned };
    }
    async toggleFavorite(userId, vocabularyId) {
        await this.ensureVocabulary(vocabularyId);
        const existing = await this.prisma.userFavorite.findUnique({
            where: { userId_vocabularyId: { userId, vocabularyId } },
        });
        if (existing) {
            await this.prisma.userFavorite.delete({ where: { id: existing.id } });
            return { vocabularyId, isFavorite: false };
        }
        await this.prisma.userFavorite.create({ data: { userId, vocabularyId } });
        return { vocabularyId, isFavorite: true };
    }
    async getFavorites(userId) {
        const favorites = await this.prisma.userFavorite.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                vocabulary: {
                    include: {
                        topic: { select: { title: true, slug: true } },
                        progresses: {
                            where: { userId },
                            select: { isLearned: true },
                        },
                    },
                },
            },
        });
        return favorites.map((favorite) => ({
            id: favorite.vocabulary.id,
            word: favorite.vocabulary.word,
            partOfSpeech: favorite.vocabulary.partOfSpeech,
            ipa: favorite.vocabulary.ipa,
            meaningVi: favorite.vocabulary.meaningVi,
            exampleSentence: (0, example_utils_1.cleanExampleSentence)(favorite.vocabulary.exampleSentence),
            exampleMeaning: (0, example_utils_1.cleanExampleMeaning)(favorite.vocabulary.exampleMeaning),
            orderNumber: favorite.vocabulary.orderNumber,
            isFavorite: true,
            isLearned: favorite.vocabulary.progresses.length > 0
                ? favorite.vocabulary.progresses[0].isLearned
                : false,
            topic: favorite.vocabulary.topic,
            favoritedAt: favorite.createdAt,
        }));
    }
    async getLearned(userId) {
        const learned = await this.prisma.userProgress.findMany({
            where: { userId, isLearned: true },
            orderBy: { learnedAt: 'desc' },
            include: {
                vocabulary: {
                    include: {
                        topic: { select: { title: true, slug: true } },
                        favorites: {
                            where: { userId },
                            select: { id: true },
                        },
                    },
                },
            },
        });
        return learned.map((progress) => ({
            id: progress.vocabulary.id,
            word: progress.vocabulary.word,
            partOfSpeech: progress.vocabulary.partOfSpeech,
            ipa: progress.vocabulary.ipa,
            meaningVi: progress.vocabulary.meaningVi,
            imageUrl: progress.vocabulary.imageUrl,
            audioUrl: progress.vocabulary.audioUrl,
            exampleSentence: (0, example_utils_1.cleanExampleSentence)(progress.vocabulary.exampleSentence),
            exampleMeaning: (0, example_utils_1.cleanExampleMeaning)(progress.vocabulary.exampleMeaning),
            exampleTense: progress.vocabulary.exampleTense,
            orderNumber: progress.vocabulary.orderNumber,
            isLearned: true,
            isFavorite: progress.vocabulary.favorites.length > 0,
            topic: progress.vocabulary.topic,
            learnedAt: progress.learnedAt,
        }));
    }
    async ensureVocabulary(vocabularyId) {
        const vocabulary = await this.prisma.vocabulary.findUnique({ where: { id: vocabularyId } });
        if (!vocabulary) {
            throw new common_1.NotFoundException('Không tìm thấy từ vựng');
        }
        return vocabulary;
    }
};
exports.VocabulariesService = VocabulariesService;
exports.VocabulariesService = VocabulariesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VocabulariesService);
//# sourceMappingURL=vocabularies.service.js.map