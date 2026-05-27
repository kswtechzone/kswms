"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const hotel_service_1 = require("./hotel.service");
const hotel_controller_1 = require("./hotel.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let HotelModule = class HotelModule {
};
exports.HotelModule = HotelModule;
exports.HotelModule = HotelModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        controllers: [hotel_controller_1.HotelController],
        providers: [hotel_service_1.HotelService],
        exports: [hotel_service_1.HotelService],
    })
], HotelModule);
//# sourceMappingURL=hotel.module.js.map