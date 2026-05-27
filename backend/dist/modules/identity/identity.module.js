"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityModule = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const identity_service_1 = require("./identity.service");
const identity_controller_1 = require("./identity.controller");
const prisma_module_1 = require("../prisma/prisma.module");
let IdentityModule = class IdentityModule {
};
exports.IdentityModule = IdentityModule;
exports.IdentityModule = IdentityModule = tslib_1.__decorate([
    (0, common_1.Module)({
        imports: [
            prisma_module_1.PrismaModule,
            jwt_1.JwtModule.register({
                secret: process.env.JWT_SECRET_KEY || 'ksw_central_secret_key_2026',
                signOptions: { expiresIn: '1h' },
            }),
        ],
        controllers: [identity_controller_1.IdentityController],
        providers: [identity_service_1.IdentityService],
        exports: [identity_service_1.IdentityService],
    })
], IdentityModule);
//# sourceMappingURL=identity.module.js.map