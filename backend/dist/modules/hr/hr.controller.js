"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const hr_service_1 = require("./hr.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
let HrController = class HrController {
    constructor(hrService) {
        this.hrService = hrService;
    }
    getStaff(req) {
        return this.hrService.getStaff(req.tenantId);
    }
    createStaff(data, req) {
        return this.hrService.createStaff(req.tenantId, data);
    }
    addAttendance(id, data, req) {
        return this.hrService.addAttendance(id, req.tenantId, data);
    }
};
exports.HrController = HrController;
tslib_1.__decorate([
    (0, common_1.Get)('staff'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], HrController.prototype, "getStaff", null);
tslib_1.__decorate([
    (0, common_1.Post)('staff'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], HrController.prototype, "createStaff", null);
tslib_1.__decorate([
    (0, common_1.Post)('staff/:id/attendance'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], HrController.prototype, "addAttendance", null);
exports.HrController = HrController = tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Controller)('api/v1/hr'),
    tslib_1.__metadata("design:paramtypes", [hr_service_1.HrService])
], HrController);
//# sourceMappingURL=hr.controller.js.map