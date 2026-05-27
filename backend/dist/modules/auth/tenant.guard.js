"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantGuard = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
let TenantGuard = class TenantGuard {
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.ForbiddenException('Authentication context not found.');
        }
        const headerTenantId = request.headers['x-tenant-id'];
        if (user.role === 'SUPER_ADMIN') {
            request.tenantId = headerTenantId || user.orgId;
        }
        else {
            request.tenantId = user.orgId;
            if (headerTenantId && headerTenantId !== user.orgId) {
                throw new common_1.ForbiddenException('Unauthorized tenant access.');
            }
        }
        return true;
    }
};
exports.TenantGuard = TenantGuard;
exports.TenantGuard = TenantGuard = tslib_1.__decorate([
    (0, common_1.Injectable)()
], TenantGuard);
//# sourceMappingURL=tenant.guard.js.map