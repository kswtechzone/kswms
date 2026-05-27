"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const organization_service_1 = require("./organization.service");
const organization_controller_1 = require("./organization.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let OrganizationModule = class OrganizationModule {
};
exports.OrganizationModule = OrganizationModule;
exports.OrganizationModule = OrganizationModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [organization_controller_1.OrganizationController],
        providers: [organization_service_1.OrganizationService],
        exports: [organization_service_1.OrganizationService],
    })
], OrganizationModule);
//# sourceMappingURL=organization.module.js.map