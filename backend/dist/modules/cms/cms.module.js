"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const cms_service_1 = require("./cms.service");
const cms_controller_1 = require("./cms.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let CmsModule = class CmsModule {
};
exports.CmsModule = CmsModule;
exports.CmsModule = CmsModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [cms_service_1.CmsService],
        controllers: [cms_controller_1.CmsController],
        exports: [cms_service_1.CmsService],
    })
], CmsModule);
//# sourceMappingURL=cms.module.js.map