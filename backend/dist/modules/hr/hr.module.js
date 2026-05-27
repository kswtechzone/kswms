"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const hr_service_1 = require("./hr.service");
const hr_controller_1 = require("./hr.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let HrModule = class HrModule {
};
exports.HrModule = HrModule;
exports.HrModule = HrModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [hr_service_1.HrService],
        controllers: [hr_controller_1.HrController],
        exports: [hr_service_1.HrService],
    })
], HrModule);
//# sourceMappingURL=hr.module.js.map