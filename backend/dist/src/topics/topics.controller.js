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
exports.TopicsController = void 0;
const common_1 = require("@nestjs/common");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const topics_service_1 = require("./topics.service");
let TopicsController = class TopicsController {
    topicsService;
    constructor(topicsService) {
        this.topicsService = topicsService;
    }
    findAll() {
        return this.topicsService.findAll();
    }
    getTopicsWithProgress(user) {
        return this.topicsService.getTopicsWithProgress(user.id);
    }
    async findBySlug(slug) {
        const topic = await this.topicsService.findBySlug(slug);
        if (!topic) {
            throw new common_1.NotFoundException('Không tìm thấy chủ đề');
        }
        return topic;
    }
    async findBySlugWithProgress(slug, user) {
        const topic = await this.topicsService.findBySlugWithProgress(slug, user.id);
        if (!topic) {
            throw new common_1.NotFoundException('Không tìm thấy chủ đề');
        }
        return topic;
    }
};
exports.TopicsController = TopicsController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TopicsController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)('progress'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], TopicsController.prototype, "getTopicsWithProgress", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TopicsController.prototype, "findBySlug", null);
__decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Get)(':slug/vocabularies'),
    __param(0, (0, common_1.Param)('slug')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TopicsController.prototype, "findBySlugWithProgress", null);
exports.TopicsController = TopicsController = __decorate([
    (0, common_1.Controller)('topics'),
    __metadata("design:paramtypes", [topics_service_1.TopicsService])
], TopicsController);
//# sourceMappingURL=topics.controller.js.map