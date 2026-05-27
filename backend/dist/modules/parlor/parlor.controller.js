"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParlorController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const parlor_service_1 = require("./parlor.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
let ParlorController = class ParlorController {
    constructor(parlorService) {
        this.parlorService = parlorService;
    }
    getCategories(req) {
        return this.parlorService.getCategories(req.tenantId);
    }
    createCategory(name, req) {
        return this.parlorService.createCategory(req.tenantId, name);
    }
    getServices(req) {
        return this.parlorService.getServices(req.tenantId);
    }
    createService(data, req) {
        return this.parlorService.createService(req.tenantId, data);
    }
    updateService(id, data, req) {
        return this.parlorService.updateService(req.tenantId, id, data);
    }
    getBookings(req) {
        return this.parlorService.getBookings(req.tenantId);
    }
    createBooking(data, req) {
        return this.parlorService.createBooking(req.tenantId, data);
    }
    updateBookingStatus(id, req, status, paymentStatus, bookingTime) {
        return this.parlorService.updateBookingStatus(req.tenantId, id, status, paymentStatus, bookingTime);
    }
};
exports.ParlorController = ParlorController;
tslib_1.__decorate([
    (0, common_1.Get)('categories'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ParlorController.prototype, "getCategories", null);
tslib_1.__decorate([
    (0, common_1.Post)('categories'),
    tslib_1.__param(0, (0, common_1.Body)('name')),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ParlorController.prototype, "createCategory", null);
tslib_1.__decorate([
    (0, common_1.Get)('services'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ParlorController.prototype, "getServices", null);
tslib_1.__decorate([
    (0, common_1.Post)('services'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ParlorController.prototype, "createService", null);
tslib_1.__decorate([
    (0, common_1.Patch)('services/:id'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ParlorController.prototype, "updateService", null);
tslib_1.__decorate([
    (0, common_1.Get)('bookings'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ParlorController.prototype, "getBookings", null);
tslib_1.__decorate([
    (0, common_1.Post)('bookings'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ParlorController.prototype, "createBooking", null);
tslib_1.__decorate([
    (0, common_1.Patch)('bookings/:id/status'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__param(2, (0, common_1.Body)('status')),
    tslib_1.__param(3, (0, common_1.Body)('paymentStatus')),
    tslib_1.__param(4, (0, common_1.Body)('bookingTime')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, String, String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], ParlorController.prototype, "updateBookingStatus", null);
exports.ParlorController = ParlorController = tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Controller)('api/v1/parlor'),
    tslib_1.__metadata("design:paramtypes", [parlor_service_1.ParlorService])
], ParlorController);
//# sourceMappingURL=parlor.controller.js.map