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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizController = void 0;
const common_1 = require("@nestjs/common");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const submit_quiz_dto_1 = require("./dto/submit-quiz.dto");
const quiz_service_1 = require("./quiz.service");
let QuizController = class QuizController {
    quizService;
    constructor(quizService) {
        this.quizService = quizService;
    }
    generate(topicId) {
        return this.quizService.generate(topicId);
    }
    submit(submitQuizDto, user) {
        return this.quizService.submit(user.id, submitQuizDto);
    }
};
exports.QuizController = QuizController;
__decorate([
    (0, common_1.Get)('topics/:id/quiz/generate'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "generate", null);
__decorate([
    (0, common_1.Post)('quiz/submit'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [submit_quiz_dto_1.SubmitQuizDto, Object]),
    __metadata("design:returntype", void 0)
], QuizController.prototype, "submit", null);
exports.QuizController = QuizController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)(),
    __metadata("design:paramtypes", [quiz_service_1.QuizService])
], QuizController);
//# sourceMappingURL=quiz.controller.js.map