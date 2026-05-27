"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FinanceModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const finance_service_1 = require("./finance.service");
const finance_controller_1 = require("./finance.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let FinanceModule = class FinanceModule {
};
exports.FinanceModule = FinanceModule;
exports.FinanceModule = FinanceModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [finance_service_1.FinanceService],
        controllers: [finance_controller_1.FinanceController],
        exports: [finance_service_1.FinanceService],
    })
], FinanceModule);
//# sourceMappingURL=finance.module.js.map