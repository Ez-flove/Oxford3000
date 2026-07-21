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
exports.TopicsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const example_utils_1 = require("../vocabularies/example-utils");
let TopicsService = class TopicsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        const topics = await this.prisma.topic.findMany({
            where: { isActive: true },
            orderBy: { orderIndex: 'asc' },
            include: {
                _count: {
                    select: { vocabularies: true },
                },
            },
        });
        return topics.map((topic) => ({
            id: topic.id,
            title: topic.title,
            slug: topic.slug,
            description: topic.description,
            imageUrl: topic.imageUrl,
            orderIndex: topic.orderIndex,
            totalWords: topic._count.vocabularies,
        }));
    }
    async findBySlug(slug) {
        const topic = await this.prisma.topic.findUnique({
            where: { slug },
            include: {
                vocabularies: {
                    orderBy: { orderNumber: 'asc' },
                },
                _count: {
                    select: { vocabularies: true },
                },
            },
        });
        if (!topic)
            return null;
        return {
            ...topic,
            vocabularies: topic.vocabularies.map((vocabulary) => ({
                ...vocabulary,
                exampleSentence: (0, example_utils_1.cleanExampleSentence)(vocabulary.exampleSentence),
                exampleMeaning: (0, example_utils_1.cleanExampleMeaning)(vocabulary.exampleMeaning),
            })),
        };
    }
    async findBySlugWithProgress(slug, userId) {
        const topic = await this.prisma.topic.findUnique({
            where: { slug },
            include: {
                vocabularies: {
                    orderBy: { orderNumber: 'asc' },
                    include: {
                        progresses: {
                            where: { userId },
                            select: { isLearned: true },
                        },
                        favorites: {
                            where: { userId },
                            select: { id: true },
                        },
                    },
                },
                _count: {
                    select: { vocabularies: true },
                },
            },
        });
        if (!topic)
            return null;
        const vocabularies = topic.vocabularies.map((vocab) => ({
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
            isLearned: vocab.progresses.length > 0 ? vocab.progresses[0].isLearned : false,
            isFavorite: vocab.favorites.length > 0,
        }));
        return {
            id: topic.id,
            title: topic.title,
            slug: topic.slug,
            description: topic.description,
            imageUrl: topic.imageUrl,
            totalWords: topic._count.vocabularies,
            learnedWords: vocabularies.filter((v) => v.isLearned).length,
            vocabularies,
        };
    }
    async getTopicsWithProgress(userId) {
        const topics = await this.prisma.topic.findMany({
            where: { isActive: true },
            orderBy: { orderIndex: 'asc' },
            include: {
                _count: {
                    select: { vocabularies: true },
                },
                vocabularies: {
                    select: {
                        progresses: {
                            where: { userId, isLearned: true },
                            select: { id: true },
                        },
                    },
                },
            },
        });
        return topics.map((topic) => ({
            id: topic.id,
            title: topic.title,
            slug: topic.slug,
            description: topic.description,
            imageUrl: topic.imageUrl,
            orderIndex: topic.orderIndex,
            totalWords: topic._count.vocabularies,
            learnedWords: topic.vocabularies.filter((v) => v.progresses.length > 0).length,
        }));
    }
};
exports.TopicsService = TopicsService;
exports.TopicsService = TopicsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TopicsService);
//# sourceMappingURL=topics.service.js.map