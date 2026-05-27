"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const organization_service_1 = require("./organization.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
let OrganizationController = class OrganizationController {
    constructor(orgService) {
        this.orgService = orgService;
    }
    async getAll() {
        return this.orgService.getAllOrganizations();
    }
    async getLogs() {
        return this.orgService.getActivityLogs();
    }
    async getStats() {
        return this.orgService.getDashboardStats();
    }
    async getOne(id) {
        return this.orgService.getOrganizationById(id);
    }
    async getBrands(id) {
        return this.orgService.getBrands(id);
    }
    async updateModules(id, modules) {
        return this.orgService.updateModules(id, modules);
    }
    async updateProfile(id, data) {
        return this.orgService.updateOrganizationProfile(id, data);
    }
    async toggleModule(id, moduleName) {
        return this.orgService.toggleModule(id, moduleName);
    }
};
exports.OrganizationController = OrganizationController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "getAll", null);
tslib_1.__decorate([
    (0, common_1.Get)('logs'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "getLogs", null);
tslib_1.__decorate([
    (0, common_1.Get)('stats'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "getStats", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "getOne", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id/brands'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "getBrands", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id/modules'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)('modules')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Array]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "updateModules", null);
tslib_1.__decorate([
    (0, common_1.Put)(':id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "updateProfile", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/toggle-module'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)('moduleName')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrganizationController.prototype, "toggleModule", null);
exports.OrganizationController = OrganizationController = tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Controller)('organizations'),
    tslib_1.__metadata("design:paramtypes", [organization_service_1.OrganizationService])
], OrganizationController);
//# sourceMappingURL=organization.controller.js.map