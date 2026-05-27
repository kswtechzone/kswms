"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const public_controller_1 = require("./public.controller");
const prisma_module_1 = require("../prisma/prisma.module");
const cache_service_1 = require("./cache.service");
let PublicModule = class PublicModule {
};
exports.PublicModule = PublicModule;
exports.PublicModule = PublicModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [public_controller_1.PublicModuleController],
        providers: [cache_service_1.CacheService],
        exports: [cache_service_1.CacheService],
    })
], PublicModule);
//# sourceMappingURL=public.module.js.map