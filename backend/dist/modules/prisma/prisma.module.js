"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("./prisma.service");
const seed_service_1 = require("./seed.service");
let PrismaModule = class PrismaModule {
};
exports.PrismaModule = PrismaModule;
exports.PrismaModule = PrismaModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [prisma_service_1.PrismaService, seed_service_1.SeedService],
        exports: [prisma_service_1.PrismaService],
    })
], PrismaModule);
//# sourceMappingURL=prisma.module.js.map