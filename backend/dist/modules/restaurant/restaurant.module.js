"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const restaurant_service_1 = require("./restaurant.service");
const restaurant_controller_1 = require("./restaurant.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let RestaurantModule = class RestaurantModule {
};
exports.RestaurantModule = RestaurantModule;
exports.RestaurantModule = RestaurantModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [restaurant_service_1.RestaurantService],
        controllers: [restaurant_controller_1.RestaurantController],
        exports: [restaurant_service_1.RestaurantService],
    })
], RestaurantModule);
//# sourceMappingURL=restaurant.module.js.map