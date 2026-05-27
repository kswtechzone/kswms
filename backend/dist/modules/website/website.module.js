"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const website_service_1 = require("./website.service");
const website_controller_1 = require("./website.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let WebsiteModule = class WebsiteModule {
};
exports.WebsiteModule = WebsiteModule;
exports.WebsiteModule = WebsiteModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [prisma_module_1.PrismaModule],
        providers: [website_service_1.WebsiteService],
        controllers: [website_controller_1.WebsiteController],
        exports: [website_service_1.WebsiteService],
    })
], WebsiteModule);
//# sourceMappingURL=website.module.js.map