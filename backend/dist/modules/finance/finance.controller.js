"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
let FinanceController = class FinanceController {
    constructor(financeService) {
        this.financeService = financeService;
    }
    getInvoices(req) {
        return this.financeService.getInvoices(req.tenantId);
    }
    createInvoice(data, req) {
        return this.financeService.createInvoice(req.tenantId, data);
    }
    generateBookingInvoice(bookingId, req) {
        return this.financeService.generateBookingInvoice(req.tenantId, bookingId);
    }
    getExpenses(req) {
        return this.financeService.getExpenses(req.tenantId);
    }
    createExpense(data, req) {
        return this.financeService.createExpense(req.tenantId, data);
    }
};
exports.FinanceController = FinanceController;
tslib_1.__decorate([
    (0, common_1.Get)('invoices'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], FinanceController.prototype, "getInvoices", null);
tslib_1.__decorate([
    (0, common_1.Post)('invoices'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], FinanceController.prototype, "createInvoice", null);
tslib_1.__decorate([
    (0, common_1.Post)('invoices/generate-booking/:bookingId'),
    tslib_1.__param(0, (0, common_1.Param)('bookingId')),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], FinanceController.prototype, "generateBookingInvoice", null);
tslib_1.__decorate([
    (0, common_1.Get)('expenses'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], FinanceController.prototype, "getExpenses", null);
tslib_1.__decorate([
    (0, common_1.Post)('expenses'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], FinanceController.prototype, "createExpense", null);
exports.FinanceController = FinanceController = tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Controller)('api/v1/finance'),
    tslib_1.__metadata("design:paramtypes", [finance_service_1.FinanceService])
], FinanceController);
//# sourceMappingURL=finance.controller.js.map