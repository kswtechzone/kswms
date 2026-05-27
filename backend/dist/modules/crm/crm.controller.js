"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crm_service_1 = require("./crm.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
let CrmController = class CrmController {
    constructor(crmService) {
        this.crmService = crmService;
    }
    getGuests(req) {
        return this.crmService.getGuests(req.tenantId);
    }
    searchGuests(req, query) {
        return this.crmService.searchGuests(req.tenantId, query);
    }
    createGuest(req, data) {
        return this.crmService.createGuest(req.tenantId, data);
    }
    getGuestById(req, id) {
        return this.crmService.getGuestById(req.tenantId, id);
    }
    updateGuest(req, id, data) {
        return this.crmService.updateGuest(req.tenantId, id, data);
    }
    deleteGuest(req, id) {
        return this.crmService.deleteGuest(req.tenantId, id);
    }
};
exports.CrmController = CrmController;
tslib_1.__decorate([
    (0, common_1.Get)('guests'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], CrmController.prototype, "getGuests", null);
tslib_1.__decorate([
    (0, common_1.Get)('guests/search'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Query)('q')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], CrmController.prototype, "searchGuests", null);
tslib_1.__decorate([
    (0, common_1.Post)('guests'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], CrmController.prototype, "createGuest", null);
tslib_1.__decorate([
    (0, common_1.Get)('guests/:id'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], CrmController.prototype, "getGuestById", null);
tslib_1.__decorate([
    (0, common_1.Patch)('guests/:id'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], CrmController.prototype, "updateGuest", null);
tslib_1.__decorate([
    (0, common_1.Delete)('guests/:id'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", void 0)
], CrmController.prototype, "deleteGuest", null);
exports.CrmController = CrmController = tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Controller)('api/v1/crm'),
    tslib_1.__metadata("design:paramtypes", [crm_service_1.CrmService])
], CrmController);
//# sourceMappingURL=crm.controller.js.map