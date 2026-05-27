"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const scheduling_service_1 = require("./scheduling.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
let SchedulingController = class SchedulingController {
    constructor(schedulingService) {
        this.schedulingService = schedulingService;
    }
    async getPublicAvailability(resourceId, date, duration) {
        if (!resourceId || !date) {
            throw new common_1.BadRequestException('Query parameters resourceId and date are required');
        }
        const slotDuration = duration ? parseInt(duration, 10) : 60;
        const slots = await this.schedulingService.calculateAvailableSlots('013f3939-0543-4c7d-b218-696037d30106', resourceId, date, slotDuration);
        return { slots };
    }
    async getResources(req, type) {
        return this.schedulingService.getResources(req.tenantId, type);
    }
    async createResource(req, data) {
        return this.schedulingService.createResource(req.tenantId, data);
    }
    async getBookings(req, type) {
        return this.schedulingService.getBookings(req.tenantId, type);
    }
    async bookResource(req, data) {
        return this.schedulingService.createCentralBooking(req.tenantId, data);
    }
    async cancelBooking(req, id) {
        return this.schedulingService.cancelBooking(req.tenantId, id);
    }
};
exports.SchedulingController = SchedulingController;
tslib_1.__decorate([
    (0, common_1.Get)('public/:slug/availability'),
    tslib_1.__param(0, (0, common_1.Query)('resourceId')),
    tslib_1.__param(1, (0, common_1.Query)('date')),
    tslib_1.__param(2, (0, common_1.Query)('duration')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SchedulingController.prototype, "getPublicAvailability", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Get)('resources'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Query)('type')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SchedulingController.prototype, "getResources", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Post)('resources'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SchedulingController.prototype, "createResource", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Get)('bookings'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Query)('type')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SchedulingController.prototype, "getBookings", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Post)('book'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SchedulingController.prototype, "bookResource", null);
tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Post)('bookings/:id/cancel'),
    tslib_1.__param(0, (0, common_1.Req)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], SchedulingController.prototype, "cancelBooking", null);
exports.SchedulingController = SchedulingController = tslib_1.__decorate([
    (0, common_1.Controller)('scheduling'),
    tslib_1.__metadata("design:paramtypes", [scheduling_service_1.SchedulingService])
], SchedulingController);
//# sourceMappingURL=scheduling.controller.js.map