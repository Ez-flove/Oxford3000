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
exports.QuizService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const example_utils_1 = require("../vocabularies/example-utils");
const questionTypes = [
    'EN_TO_VI_TEXT',
    'VI_TO_EN_TEXT',
    'MULTIPLE_CHOICE_4',
    'PART_OF_SPEECH',
    'FILL_IN_BLANK',
    'CHOOSE_CORRECT_WORD',
    'MATCH_WORD_MEANING',
    'MATCH_WORD_IMAGE',
    'WORD_REORDER',
    'TRUE_FALSE_MEANING',
    'IDENTIFY_TENSE',
    'WRITE_NEW_SENTENCE',
];
let QuizService = class QuizService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generate(topicId) {
        const topic = await this.getTopicWithVocabularies(topicId);
        if (!topic) {
            throw new common_1.NotFoundException('Không tìm thấy chủ đề');
        }
        const vocabularies = topic.vocabularies.slice(0, 12);
        const questions = vocabularies.map((vocabulary, index) => this.buildQuestion(vocabulary, questionTypes[index % questionTypes.length], topic.vocabularies));
        return {
            topic: { id: topic.id, title: topic.title, slug: topic.slug },
            questions,
        };
    }
    async submit(userId, submitQuizDto) {
        const generated = await this.generate(submitQuizDto.topicId);
        const answersById = new Map(submitQuizDto.answers.map((answer) => [answer.questionId, answer.answer]));
        const graded = generated.questions.map((question) => {
            const answer = answersById.get(question.id);
            return {
                questionId: question.id,
                vocabularyId: question.vocabularyId,
                isCorrect: this.isCorrect(answer, question.correctAnswer, question.type),
                correctAnswer: question.correctAnswer,
            };
        });
        const correctAnswers = graded.filter((question) => question.isCorrect).length;
        const wrongVocabularyIds = graded
            .filter((question) => !question.isCorrect && question.vocabularyId)
            .map((question) => question.vocabularyId);
        const attempt = await this.prisma.quizAttempt.create({
            data: {
                userId,
                topicId: submitQuizDto.topicId,
                score: generated.questions.length ? (correctAnswers / generated.questions.length) * 100 : 0,
                totalQuestions: generated.questions.length,
                correctAnswers,
                wrongAnswers: generated.questions.length - correctAnswers,
                duration: submitQuizDto.duration,
                wrongWords: {
                    create: Array.from(new Set(wrongVocabularyIds)).map((vocabularyId) => ({ vocabularyId })),
                },
            },
            include: { wrongWords: true },
        });
        return {
            attemptId: attempt.id,
            score: attempt.score,
            totalQuestions: attempt.totalQuestions,
            correctAnswers: attempt.correctAnswers,
            wrongAnswers: attempt.wrongAnswers,
            duration: attempt.duration,
            graded,
        };
    }
    getTopicWithVocabularies(topicId) {
        return this.prisma.topic.findUnique({
            where: { id: topicId },
            include: { vocabularies: { orderBy: { orderNumber: 'asc' } } },
        });
    }
    async getTopicVocabularies(topicId) {
        const topic = await this.getTopicWithVocabularies(topicId);
        return topic?.vocabularies ?? [];
    }
    buildQuestion(vocabulary, type, pool) {
        const exampleSentence = (0, example_utils_1.cleanExampleSentence)(vocabulary.exampleSentence);
        const exampleMeaning = (0, example_utils_1.cleanExampleMeaning)(vocabulary.exampleMeaning);
        const hasRealExample = exampleSentence.length > 0 &&
            !(0, example_utils_1.isPlaceholderExample)(vocabulary.exampleSentence);
        const safeType = hasRealExample ||
            ![
                'FILL_IN_BLANK',
                'CHOOSE_CORRECT_WORD',
                'WORD_REORDER',
                'IDENTIFY_TENSE',
                'WRITE_NEW_SENTENCE',
            ].includes(type)
            ? type
            : 'EN_TO_VI_TEXT';
        const distractors = pool
            .filter((item) => item.id !== vocabulary.id)
            .slice(0, 3);
        const options = this.shuffle([vocabulary, ...distractors]);
        const base = {
            id: `${safeType}:${vocabulary.id}`,
            type: safeType,
            vocabularyId: vocabulary.id,
            prompt: vocabulary.word,
            correctAnswer: vocabulary.meaningVi,
        };
        switch (safeType) {
            case 'EN_TO_VI_TEXT':
                return { ...base, prompt: vocabulary.word, correctAnswer: vocabulary.meaningVi };
            case 'VI_TO_EN_TEXT':
                return { ...base, prompt: vocabulary.meaningVi, correctAnswer: vocabulary.word };
            case 'MULTIPLE_CHOICE_4':
                return { ...base, options: options.map((item) => item.meaningVi) };
            case 'PART_OF_SPEECH':
                return { ...base, options: ['n', 'v', 'adj', 'adv'], correctAnswer: vocabulary.partOfSpeech };
            case 'FILL_IN_BLANK':
                return {
                    ...base,
                    prompt: exampleSentence.replace(new RegExp(vocabulary.word, 'i'), '_____'),
                    correctAnswer: vocabulary.word,
                };
            case 'CHOOSE_CORRECT_WORD':
                return { ...base, prompt: exampleSentence, options: options.map((item) => item.word), correctAnswer: vocabulary.word };
            case 'MATCH_WORD_MEANING':
                return {
                    ...base,
                    pairs: options.map((item) => ({ word: item.word, meaningVi: item.meaningVi })),
                    correctAnswer: vocabulary.id,
                };
            case 'MATCH_WORD_IMAGE':
                return {
                    ...base,
                    options: options.map((item) => ({ id: item.id, word: item.word, imageUrl: item.imageUrl })),
                    correctAnswer: vocabulary.id,
                };
            case 'WORD_REORDER':
                return {
                    ...base,
                    prompt: exampleMeaning,
                    tiles: this.shuffle(exampleSentence.replace(/[.,!?]/g, '').split(' ')),
                    correctAnswer: exampleSentence.replace(/[.,!?]/g, ''),
                };
            case 'TRUE_FALSE_MEANING': {
                const candidate = distractors[0] ?? vocabulary;
                const isTrue = vocabulary.id === candidate.id;
                return {
                    ...base,
                    prompt: `${vocabulary.word} = ${isTrue ? vocabulary.meaningVi : candidate.meaningVi}`,
                    correctAnswer: isTrue,
                };
            }
            case 'IDENTIFY_TENSE':
                return {
                    ...base,
                    prompt: exampleSentence,
                    options: ['Present Simple', 'Past Simple', 'Present Continuous', 'Future Simple'],
                    correctAnswer: vocabulary.exampleTense ?? 'Present Simple',
                };
            case 'WRITE_NEW_SENTENCE':
                return {
                    ...base,
                    prompt: vocabulary.word,
                    sampleAnswer: exampleSentence,
                    correctAnswer: vocabulary.word,
                };
        }
    }
    isCorrect(answer, correctAnswer, type) {
        if (type === 'WRITE_NEW_SENTENCE') {
            return typeof answer === 'string' && answer.toLowerCase().includes(String(correctAnswer).toLowerCase());
        }
        if (Array.isArray(answer)) {
            return answer.join(' ').trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
        }
        return String(answer).trim().toLowerCase() === String(correctAnswer).trim().toLowerCase();
    }
    shuffle(items) {
        return [...items].sort(() => Math.random() - 0.5);
    }
};
exports.QuizService = QuizService;
exports.QuizService = QuizService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuizService);
//# sourceMappingURL=quiz.service.js.map