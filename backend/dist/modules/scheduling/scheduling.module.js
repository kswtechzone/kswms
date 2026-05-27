"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchedulingModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const scheduling_controller_1 = require("./scheduling.controller");
const scheduling_service_1 = require("./scheduling.service");
const prisma_module_1 = require("../prisma/prisma.module");
let SchedulingModule = class SchedulingModule {
};
exports.SchedulingModule = SchedulingModule;
exports.SchedulingModule = SchedulingModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
        ],
        controllers: [scheduling_controller_1.SchedulingController],
        providers: [scheduling_service_1.SchedulingService, scheduling_service_1.SchedulingEventsService],
        exports: [scheduling_service_1.SchedulingService, scheduling_service_1.SchedulingEventsService],
    })
], SchedulingModule);
//# sourceMappingURL=scheduling.module.js.map