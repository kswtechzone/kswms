"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const crm_service_1 = require("./crm.service");
const crm_controller_1 = require("./crm.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let CrmModule = class CrmModule {
};
exports.CrmModule = CrmModule;
exports.CrmModule = CrmModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [crm_controller_1.CrmController],
        providers: [crm_service_1.CrmService],
        exports: [crm_service_1.CrmService],
    })
], CrmModule);
//# sourceMappingURL=crm.module.js.map