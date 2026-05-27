"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParlorModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const parlor_service_1 = require("./parlor.service");
const parlor_controller_1 = require("./parlor.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let ParlorModule = class ParlorModule {
};
exports.ParlorModule = ParlorModule;
exports.ParlorModule = ParlorModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [parlor_controller_1.ParlorController],
        providers: [parlor_service_1.ParlorService],
    })
], ParlorModule);
//# sourceMappingURL=parlor.module.js.map