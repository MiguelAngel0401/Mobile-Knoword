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
exports.CommunitiesController = void 0;
const common_1 = require("@nestjs/common");
const guards_1 = require("../auth/guards");
const communities_service_1 = require("./communities.service");
const dto_1 = require("./dto");
const decorators_1 = require("../auth/decorators");
const tags_service_1 = require("./tags.service");
let CommunitiesController = class CommunitiesController {
    communitiesService;
    tagsService;
    constructor(communitiesService, tagsService) {
        this.communitiesService = communitiesService;
        this.tagsService = tagsService;
    }
    async createCommunity(communityDto, user) {
        if (!user || !user.sub) {
            throw new common_1.UnauthorizedException('Usuario no válido');
        }
        return this.communitiesService.createCommunity(communityDto, user.sub);
    }
    async recommendTags(query) {
        const tag = query.tag;
        if (!tag) {
            throw new common_1.UnauthorizedException('Tag no proporcionado');
        }
        return this.tagsService.findRecommendations(tag);
    }
    async exploreCommunities() {
        return this.communitiesService.getExploreCommunities();
    }
    async getCommunityById(id, user) {
        return this.communitiesService.getCommunityById(id, user.sub);
    }
    async getCommunitiesByTag(tag) {
        return this.communitiesService.getCommunitiesByTag(tag);
    }
    async getMyCommunities(user) {
        return this.communitiesService.getMyCommunities(user.sub);
    }
    async joinCommunity(id, user) {
        return this.communitiesService.joinCommunity(id, user.sub);
    }
    async leaveCommunity(id, user) {
        return this.communitiesService.leaveCommunity(id, user.sub);
    }
    async getUserCommunities(user) {
        return this.communitiesService.getUserCommunities(user.sub);
    }
    async updateCommunity(id, dto, user) {
        return this.communitiesService.updateCommunity(id, dto, user.sub);
    }
    async deleteCommunity(id) {
        return this.communitiesService.deleteCommunity(id);
    }
};
exports.CommunitiesController = CommunitiesController;
__decorate([
    (0, common_1.Post)('create'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateCommunityDto, Object]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "createCommunity", null);
__decorate([
    (0, common_1.Get)('tags/recommendations'),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.TagRecommendationDto]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "recommendTags", null);
__decorate([
    (0, common_1.Get)('explore'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "exploreCommunities", null);
__decorate([
    (0, common_1.Get)('community/:id'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "getCommunityById", null);
__decorate([
    (0, common_1.Get)('by-tag/:tag'),
    __param(0, (0, common_1.Param)('tag')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "getCommunitiesByTag", null);
__decorate([
    (0, common_1.Get)('my-communities'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "getMyCommunities", null);
__decorate([
    (0, common_1.Post)('join/:id'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "joinCommunity", null);
__decorate([
    (0, common_1.Delete)('leave/:id'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "leaveCommunity", null);
__decorate([
    (0, common_1.Get)('user-communities'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    __param(0, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "getUserCommunities", null);
__decorate([
    (0, common_1.Patch)('community/:id'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, decorators_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, dto_1.UpdateCommunityDto, Object]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "updateCommunity", null);
__decorate([
    (0, common_1.Delete)('community/:id'),
    (0, common_1.UseGuards)(guards_1.JwtGuard),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CommunitiesController.prototype, "deleteCommunity", null);
exports.CommunitiesController = CommunitiesController = __decorate([
    (0, common_1.Controller)('communities'),
    __metadata("design:paramtypes", [communities_service_1.CommunitiesService,
        tags_service_1.TagsService])
], CommunitiesController);
//# sourceMappingURL=communities.controller.js.map