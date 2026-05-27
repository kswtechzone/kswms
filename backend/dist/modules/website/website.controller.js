"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const website_service_1 = require("./website.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
let WebsiteController = class WebsiteController {
    constructor(websiteService) {
        this.websiteService = websiteService;
    }
    getOrgBrands(req) {
        return this.websiteService.getOrgBrands(req.tenantId);
    }
    getWebsites(req) {
        return this.websiteService.getWebsites(req.tenantId);
    }
    getWebsiteById(id, req) {
        return this.websiteService.getWebsiteById(id, req.tenantId);
    }
    createWebsite(data, req) {
        return this.websiteService.createWebsite(req.tenantId, data);
    }
    updateWebsite(id, data, req) {
        return this.websiteService.updateWebsite(id, req.tenantId, data);
    }
    deleteWebsite(id, req) {
        return this.websiteService.deleteWebsite(id, req.tenantId);
    }
    createPage(websiteId, data, req) {
        return this.websiteService.createPage(websiteId, req.tenantId, data);
    }
    updatePage(pageId, data, req) {
        return this.websiteService.updatePage(pageId, req.tenantId, data);
    }
    deletePage(pageId, req) {
        return this.websiteService.deletePage(pageId, req.tenantId);
    }
    createSection(pageId, data, req) {
        return this.websiteService.createSection(pageId, req.tenantId, data);
    }
    updateSection(sectionId, data, req) {
        return this.websiteService.updateSection(sectionId, req.tenantId, data);
    }
    deleteSection(sectionId, req) {
        return this.websiteService.deleteSection(sectionId, req.tenantId);
    }
};
exports.WebsiteController = WebsiteController;
tslib_1.__decorate([
    (0, common_1.Get)('brands'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WebsiteController.prototype, "getOrgBrands", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WebsiteController.prototype, "getWebsites", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WebsiteController.prototype, "getWebsiteById", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WebsiteController.prototype, "createWebsite", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WebsiteController.prototype, "updateWebsite", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WebsiteController.prototype, "deleteWebsite", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/pages'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WebsiteController.prototype, "createPage", null);
tslib_1.__decorate([
    (0, common_1.Put)('pages/:pageId'),
    tslib_1.__param(0, (0, common_1.Param)('pageId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WebsiteController.prototype, "updatePage", null);
tslib_1.__decorate([
    (0, common_1.Delete)('pages/:pageId'),
    tslib_1.__param(0, (0, common_1.Param)('pageId')),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WebsiteController.prototype, "deletePage", null);
tslib_1.__decorate([
    (0, common_1.Post)('pages/:pageId/sections'),
    tslib_1.__param(0, (0, common_1.Param)('pageId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WebsiteController.prototype, "createSection", null);
tslib_1.__decorate([
    (0, common_1.Put)('sections/:sectionId'),
    tslib_1.__param(0, (0, common_1.Param)('sectionId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WebsiteController.prototype, "updateSection", null);
tslib_1.__decorate([
    (0, common_1.Delete)('sections/:sectionId'),
    tslib_1.__param(0, (0, common_1.Param)('sectionId')),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], WebsiteController.prototype, "deleteSection", null);
exports.WebsiteController = WebsiteController = tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Controller)('api/v1/websites'),
    tslib_1.__metadata("design:paramtypes", [website_service_1.WebsiteService])
], WebsiteController);
//# sourceMappingURL=website.controller.js.map