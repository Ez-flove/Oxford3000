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
exports.ReviewsService = void 0;
exports.calculateSm2 = calculateSm2;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
function calculateSm2({ interval, easeFactor, repetitions, quality }) {
    let nextInterval = 1;
    let nextRepetitions = repetitions;
    if (quality < 3) {
        nextRepetitions = 0;
    }
    else {
        if (repetitions === 0) {
            nextInterval = 1;
        }
        else if (repetitions === 1) {
            nextInterval = 6;
        }
        else {
            nextInterval = Math.round(interval * easeFactor);
        }
        nextRepetitions += 1;
    }
    const difficulty = 5 - quality;
    const nextEaseFactor = Math.max(1.3, easeFactor + (0.1 - difficulty * (0.08 + difficulty * 0.02)));
    return {
        interval: nextInterval,
        easeFactor: Number(nextEaseFactor.toFixed(2)),
        repetitions: nextRepetitions,
    };
}
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDue(userId) {
        const schedules = await this.prisma.reviewSchedule.findMany({
            where: { userId, dueDate: { lte: new Date() } },
            orderBy: { dueDate: 'asc' },
            include: {
                vocabulary: {
                    include: { topic: { select: { title: true, slug: true } } },
                },
            },
        });
        return schedules.map((schedule) => ({
            id: schedule.id,
            dueDate: schedule.dueDate,
            interval: schedule.interval,
            repetitions: schedule.repetitions,
            vocabulary: {
                id: schedule.vocabulary.id,
                word: schedule.vocabulary.word,
                partOfSpeech: schedule.vocabulary.partOfSpeech,
                ipa: schedule.vocabulary.ipa,
                meaningVi: schedule.vocabulary.meaningVi,
                exampleSentence: schedule.vocabulary.exampleSentence,
                exampleMeaning: schedule.vocabulary.exampleMeaning,
                topic: schedule.vocabulary.topic,
            },
        }));
    }
    async grade(userId, scheduleId, quality) {
        const schedule = await this.prisma.reviewSchedule.findFirst({
            where: { id: scheduleId, userId },
        });
        if (!schedule) {
            throw new common_1.NotFoundException('Không tìm thấy lịch ôn tập');
        }
        const next = calculateSm2({
            interval: schedule.interval,
            easeFactor: schedule.easeFactor,
            repetitions: schedule.repetitions,
            quality,
        });
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + next.interval);
        return this.prisma.reviewSchedule.update({
            where: { id: schedule.id },
            data: {
                interval: next.interval,
                easeFactor: next.easeFactor,
                repetitions: next.repetitions,
                dueDate,
                lastReviewed: new Date(),
            },
        });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map