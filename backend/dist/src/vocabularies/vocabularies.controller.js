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
exports.VocabulariesController = void 0;
const common_1 = require("@nestjs/common");
const get_user_decorator_1 = require("../auth/decorators/get-user.decorator");
const jwt_guard_1 = require("../auth/guards/jwt.guard");
const vocabularies_service_1 = require("./vocabularies.service");
let VocabulariesController = class VocabulariesController {
    vocabulariesService;
    constructor(vocabulariesService) {
        this.vocabulariesService = vocabulariesService;
    }
    getFavorites(user) {
        return this.vocabulariesService.getFavorites(user.id);
    }
    getLearned(user) {
        return this.vocabulariesService.getLearned(user.id);
    }
    markLearned(vocabularyId, user) {
        return this.vocabulariesService.markLearned(user.id, vocabularyId);
    }
    toggleFavorite(vocabularyId, user) {
        return this.vocabulariesService.toggleFavorite(user.id, vocabularyId);
    }
};
exports.VocabulariesController = VocabulariesController;
__decorate([
    (0, common_1.Get)('favorites'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VocabulariesController.prototype, "getFavorites", null);
__decorate([
    (0, common_1.Get)('learned'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], VocabulariesController.prototype, "getLearned", null);
__decorate([
    (0, common_1.Post)(':id/learn'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VocabulariesController.prototype, "markLearned", null);
__decorate([
    (0, common_1.Post)(':id/favorite'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], VocabulariesController.prototype, "toggleFavorite", null);
exports.VocabulariesController = VocabulariesController = __decorate([
    (0, common_1.UseGuards)(jwt_guard_1.JwtGuard),
    (0, common_1.Controller)('vocabularies'),
    __metadata("design:paramtypes", [vocabularies_service_1.VocabulariesService])
], VocabulariesController);
//# sourceMappingURL=vocabularies.controller.js.map