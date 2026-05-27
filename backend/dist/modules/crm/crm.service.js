"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrmService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CrmService = class CrmService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getGuests(orgId) {
        const guests = await this.prisma.client.guestProfile.findMany({
            where: { organizationId: orgId },
            orderBy: { createdAt: 'desc' },
        });
        return guests.map(g => ({
            ...g,
            preferences: g.preferences && typeof g.preferences === 'object' && 'note' in g.preferences
                ? g.preferences.note
                : (g.preferences || '')
        }));
    }
    async getGuestById(orgId, id) {
        const guest = await this.prisma.client.guestProfile.findFirst({
            where: { id, organizationId: orgId },
        });
        if (!guest)
            throw new common_1.NotFoundException('Customer profile not found');
        return {
            ...guest,
            preferences: guest.preferences && typeof guest.preferences === 'object' && 'note' in guest.preferences
                ? guest.preferences.note
                : (guest.preferences || '')
        };
    }
    async searchGuests(orgId, query) {
        if (!query)
            return [];
        const guests = await this.prisma.client.guestProfile.findMany({
            where: {
                organizationId: orgId,
                OR: [
                    { phone: { contains: query, mode: 'insensitive' } },
                    { email: { contains: query, mode: 'insensitive' } },
                    { name: { contains: query, mode: 'insensitive' } },
                ],
            },
            take: 10,
        });
        return guests.map(g => ({
            ...g,
            preferences: g.preferences && typeof g.preferences === 'object' && 'note' in g.preferences
                ? g.preferences.note
                : (g.preferences || '')
        }));
    }
    async createGuest(orgId, data) {
        const guest = await this.prisma.client.guestProfile.create({
            data: {
                name: data.name,
                email: data.email || null,
                phone: data.phone || null,
                preferences: data.preferences ? { note: data.preferences } : {},
                organizationId: orgId,
            },
        });
        return {
            ...guest,
            preferences: data.preferences || ''
        };
    }
    async updateGuest(orgId, id, data) {
        await this.getGuestById(orgId, id);
        const guest = await this.prisma.client.guestProfile.update({
            where: { id },
            data: {
                name: data.name,
                email: data.email || null,
                phone: data.phone || null,
                preferences: data.preferences ? { note: data.preferences } : {},
            },
        });
        return {
            ...guest,
            preferences: data.preferences || ''
        };
    }
    async deleteGuest(orgId, id) {
        await this.getGuestById(orgId, id);
        return this.prisma.client.guestProfile.delete({
            where: { id },
        });
    }
};
exports.CrmService = CrmService;
exports.CrmService = CrmService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CrmService);
//# sourceMappingURL=crm.service.js.map