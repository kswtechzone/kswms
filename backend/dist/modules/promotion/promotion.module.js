"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const promotion_service_1 = require("./promotion.service");
const promotion_controller_1 = require("./promotion.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let PromotionModule = class PromotionModule {
};
exports.PromotionModule = PromotionModule;
exports.PromotionModule = PromotionModule = tslib_1.__decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [promotion_controller_1.PromotionController],
        providers: [promotion_service_1.PromotionService],
        exports: [promotion_service_1.PromotionService],
    })
], PromotionModule);
//# sourceMappingURL=promotion.module.js.map