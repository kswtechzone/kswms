"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IdentityController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const identity_service_1 = require("./identity.service");
const jwt = tslib_1.__importStar(require("jsonwebtoken"));
let IdentityController = class IdentityController {
    constructor(identityService) {
        this.identityService = identityService;
    }
    register(data) {
        return this.identityService.register(data);
    }
    login(data) {
        return this.identityService.login(data);
    }
    refresh(refreshToken) {
        if (!refreshToken) {
            throw new common_1.UnauthorizedException('Refresh token is required');
        }
        return this.identityService.refresh(refreshToken);
    }
    getProfile(req) {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new common_1.UnauthorizedException('Authorization header missing');
        }
        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY || 'ksw_central_secret_key_2026');
            return this.identityService.getProfile(decoded.userId || decoded.sub);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid platform authentication token');
        }
    }
    createOrganization(data) {
        return this.identityService.createOrganization(data);
    }
    inviteUser(orgId, data) {
        return this.identityService.inviteUserToOrganization(orgId, data);
    }
    linkCustomer(req, data) {
        const tenantId = req.headers['x-tenant-id'];
        if (!tenantId) {
            throw new common_1.UnauthorizedException('x-tenant-id header is required for customer operations');
        }
        return this.identityService.linkCustomerToOrganization(tenantId, data);
    }
};
exports.IdentityController = IdentityController;
tslib_1.__decorate([
    (0, common_1.Post)('auth/register'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], IdentityController.prototype, "register", null);
tslib_1.__decorate([
    (0, common_1.Post)('auth/login'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], IdentityController.prototype, "login", null);
tslib_1.__decorate([
    (0, common_1.Post)('auth/refresh'),
    tslib_1.__param(0, (0, common_1.Body)('refresh_token')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], IdentityController.prototype, "refresh", null);
tslib_1.__decorate([
    (0, common_1.Get)('auth/me'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], IdentityController.prototype, "getProfile", null);
tslib_1.__decorate([
    (0, common_1.Post)('organizations'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], IdentityController.prototype, "createOrganization", null);
tslib_1.__decorate([
    (0, common_1.Post)('organizations/:id/invite'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], IdentityController.prototype, "inviteUser", null);
tslib_1.__decorate([
    (0, common_1.Post)('customers/link'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], IdentityController.prototype, "linkCustomer", null);
exports.IdentityController = IdentityController = tslib_1.__decorate([
    (0, common_1.Controller)('identity'),
    tslib_1.__metadata("design:paramtypes", [identity_service_1.IdentityService])
], IdentityController);
//# sourceMappingURL=identity.controller.js.map