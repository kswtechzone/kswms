"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantResolverMiddleware = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../modules/prisma/prisma.service");
let TenantResolverMiddleware = class TenantResolverMiddleware {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async use(req, res, next) {
        const hostHeader = req.headers['x-tenant-host'] || req.headers.host || '';
        const host = Array.isArray(hostHeader) ? hostHeader[0] : hostHeader;
        let website = null;
        if (host.includes('localhost') || host.includes('127.0.0.1')) {
            const subdomain = host.split('.')[0];
            if (subdomain !== 'localhost' && subdomain !== '127') {
                website = await this.prisma.client.website.findUnique({
                    where: { subdomain }
                });
            }
        }
        else {
            const rootDomain = process.env.ROOT_DOMAIN || 'kswms.cloude';
            const isCustomDomain = !host.includes(rootDomain) &&
                !host.includes('kswms.cloude') &&
                !host.includes('kswtechzone.com.np') &&
                !host.includes('kswtechzone.com');
            if (isCustomDomain) {
                website = await this.prisma.client.website.findUnique({
                    where: { customDomain: host }
                });
            }
            else {
                const subdomain = host.split('.')[0];
                if (['kswms', 'ms', 'api', 'www', 'admin'].includes(subdomain)) {
                    return next();
                }
                website = await this.prisma.client.website.findUnique({
                    where: { subdomain }
                });
            }
        }
        if (website) {
            req.resolvedTenantId = website.organizationId;
            req.resolvedWebsiteId = website.id;
        }
        next();
    }
};
exports.TenantResolverMiddleware = TenantResolverMiddleware;
exports.TenantResolverMiddleware = TenantResolverMiddleware = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TenantResolverMiddleware);
//# sourceMappingURL=tenant-resolver.middleware.js.map