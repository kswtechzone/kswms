"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const inventory_service_1 = require("./inventory.service");
const inventory_controller_1 = require("./inventory.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [inventory_service_1.InventoryService],
        controllers: [inventory_controller_1.InventoryController],
        exports: [inventory_service_1.InventoryService],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map