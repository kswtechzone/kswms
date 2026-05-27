"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let OrganizationService = class OrganizationService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getAllOrganizations() {
        return this.prisma.client.organization.findMany({
            include: {
                _count: {
                    select: { users: true, hotels: true }
                }
            }
        });
    }
    async getOrganizationById(id) {
        const org = await this.prisma.client.organization.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        users: true,
                        hotels: true,
                        restaurants: true,
                        websites: true,
                        orders: true,
                        inventory: true,
                        staff: true,
                        parlorServices: true,
                        parlorBookings: true,
                        guests: true
                    }
                }
            }
        });
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        return org;
    }
    async updateModules(orgId, modules) {
        const org = await this.prisma.client.organization.findUnique({ where: { id: orgId } });
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        const updatedOrg = await this.prisma.client.organization.update({
            where: { id: orgId },
            data: { enabledModules: modules }
        });
        await this.prisma.client.activityLog.create({
            data: {
                adminId: 'SYSTEM',
                adminName: 'Super Admin',
                action: 'ASSIGN_MODULES',
                targetType: 'ORGANIZATION',
                targetId: orgId,
                details: `Updated modules for ${org.name} to [${modules.join(', ')}]`
            }
        });
        return updatedOrg;
    }
    async toggleModule(orgId, moduleName) {
        const org = await this.prisma.client.organization.findUnique({ where: { id: orgId } });
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        let newModules = [...org.enabledModules];
        const isAdding = !newModules.includes(moduleName);
        if (newModules.includes(moduleName)) {
            newModules = newModules.filter(m => m !== moduleName);
        }
        else {
            newModules.push(moduleName);
        }
        const updatedOrg = await this.prisma.client.organization.update({
            where: { id: orgId },
            data: { enabledModules: newModules }
        });
        await this.prisma.client.activityLog.create({
            data: {
                adminId: 'SYSTEM',
                adminName: 'Super Admin',
                action: isAdding ? 'ASSIGN_MODULE' : 'REMOVE_MODULE',
                targetType: 'ORGANIZATION',
                targetId: orgId,
                details: `${isAdding ? 'Assigned' : 'Removed'} ${moduleName} for ${org.name}`
            }
        });
        return updatedOrg;
    }
    async getActivityLogs() {
        return this.prisma.client.activityLog.findMany({
            orderBy: { createdAt: 'desc' },
            take: 100
        });
    }
    async getDashboardStats() {
        const [orgCount, userCount, hotelCount, recentLogs] = await Promise.all([
            this.prisma.client.organization.count(),
            this.prisma.client.user.count(),
            this.prisma.client.hotel.count(),
            this.prisma.client.activityLog.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5
            })
        ]);
        return {
            orgCount,
            userCount,
            hotelCount,
            recentLogs
        };
    }
    async getBrands(orgId) {
        return this.prisma.client.brand.findMany({
            where: { organizationId: orgId }
        });
    }
    async updateOrganizationProfile(id, data) {
        const org = await this.prisma.client.organization.findUnique({ where: { id } });
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        return this.prisma.client.organization.update({
            where: { id },
            data,
        });
    }
};
exports.OrganizationService = OrganizationService;
exports.OrganizationService = OrganizationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationService);
//# sourceMappingURL=organization.service.js.map