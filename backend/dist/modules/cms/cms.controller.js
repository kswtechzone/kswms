"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cms_service_1 = require("./cms.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
let CmsController = class CmsController {
    constructor(cmsService) {
        this.cmsService = cmsService;
    }
    getPages(websiteId, req) {
        return this.cmsService.getPages(websiteId, req.tenantId);
    }
    createPage(websiteId, data, req) {
        return this.cmsService.createPage(websiteId, req.tenantId, data);
    }
    createSection(pageId, data, req) {
        return this.cmsService.createSection(pageId, req.tenantId, data);
    }
    updateSection(sectionId, data, req) {
        return this.cmsService.updateSection(sectionId, req.tenantId, data);
    }
};
exports.CmsController = CmsController;
tslib_1.__decorate([
    (0, common_1.Get)('website/:websiteId/pages'),
    tslib_1.__param(0, (0, common_1.Param)('websiteId')),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], CmsController.prototype, "getPages", null);
tslib_1.__decorate([
    (0, common_1.Post)('website/:websiteId/pages'),
    tslib_1.__param(0, (0, common_1.Param)('websiteId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], CmsController.prototype, "createPage", null);
tslib_1.__decorate([
    (0, common_1.Post)('pages/:pageId/sections'),
    tslib_1.__param(0, (0, common_1.Param)('pageId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], CmsController.prototype, "createSection", null);
tslib_1.__decorate([
    (0, common_1.Put)('sections/:sectionId'),
    tslib_1.__param(0, (0, common_1.Param)('sectionId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], CmsController.prototype, "updateSection", null);
exports.CmsController = CmsController = tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Controller)('api/v1/cms'),
    tslib_1.__metadata("design:paramtypes", [cms_service_1.CmsService])
], CmsController);
//# sourceMappingURL=cms.controller.js.map