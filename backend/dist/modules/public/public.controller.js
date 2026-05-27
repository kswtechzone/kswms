"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicModuleController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const cache_service_1 = require("./cache.service");
let PublicModuleController = class PublicModuleController {
    constructor(prisma, cache) {
        this.prisma = prisma;
        this.cache = cache;
    }
    async getOrg(slug) {
        let org = await this.prisma.client.organization.findUnique({
            where: { slug },
            select: { id: true, enabledModules: true, name: true }
        });
        if (!org) {
            const website = await this.prisma.client.website.findUnique({
                where: { subdomain: slug },
                select: {
                    organization: {
                        select: { id: true, enabledModules: true, name: true }
                    }
                }
            });
            if (website) {
                org = website.organization;
            }
        }
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        return org;
    }
    async getPublicOrgInfo(slug) {
        const cacheKey = `org_info:${slug}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
            console.log(`⚡ Cache Hit: Org Info for slug "${slug}"`);
            return cached;
        }
        const org = await this.prisma.client.organization.findUnique({
            where: { slug },
            select: {
                name: true,
                slug: true,
                enabledModules: true,
                brands: {
                    select: { name: true, slug: true, domain: true, themeColors: true }
                }
            }
        });
        if (!org)
            throw new common_1.NotFoundException('Organization not found');
        this.cache.set(cacheKey, org, 300);
        return org;
    }
    async getPublicWebsite(slug) {
        const cacheKey = `public_website:${slug}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
            console.log(`⚡ Cache Hit: Public Website for slug "${slug}"`);
            return cached;
        }
        const website = await this.prisma.client.website.findFirst({
            where: {
                OR: [
                    { subdomain: slug },
                    { organization: { slug } }
                ],
                deletedAt: null
            },
            include: {
                brand: true,
                pages: {
                    include: {
                        sections: {
                            where: { isActive: true },
                            orderBy: { order: 'asc' },
                        },
                    },
                },
            },
        });
        if (!website)
            throw new common_1.NotFoundException('Website not found');
        this.cache.set(cacheKey, website, 60);
        return website;
    }
    checkModule(org, moduleName) {
        if (!org.enabledModules.includes(moduleName)) {
            throw new common_1.ForbiddenException(`${moduleName} is not enabled for this organization`);
        }
    }
    async getPublicRooms(slug) {
        const cacheKey = `hotel_rooms:${slug}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
            console.log(`⚡ Cache Hit: Public Rooms list for slug "${slug}"`);
            return cached;
        }
        const org = await this.getOrg(slug);
        this.checkModule(org, 'HOTEL_MANAGEMENT');
        const rooms = await this.prisma.client.room.findMany({
            where: { hotel: { organizationId: org.id }, status: 'AVAILABLE' },
            include: { hotel: true }
        });
        this.cache.set(cacheKey, rooms, 30);
        return rooms;
    }
    async getRoomInventory(slug) {
        const cacheKey = `hotel_availability:${slug}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
            console.log(`⚡ Cache Hit: Availability count for slug "${slug}"`);
            return cached;
        }
        const org = await this.getOrg(slug);
        this.checkModule(org, 'HOTEL_MANAGEMENT');
        const availableRooms = await this.prisma.client.room.count({
            where: { hotel: { organizationId: org.id }, status: 'AVAILABLE' }
        });
        const result = { availableRooms, status: availableRooms > 0 ? 'AVAILABLE' : 'SOLD_OUT' };
        this.cache.set(cacheKey, result, 15);
        return result;
    }
    async getPublicMenu(slug) {
        const cacheKey = `restaurant_menu:${slug}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
            console.log(`⚡ Cache Hit: Restaurant Menu for slug "${slug}"`);
            return cached;
        }
        const org = await this.getOrg(slug);
        this.checkModule(org, 'RESTAURANT');
        const menu = await this.prisma.client.menu.findMany({
            where: { restaurant: { organizationId: org.id }, isActive: true },
            include: {
                categories: {
                    include: { items: { where: { isAvailable: true } } }
                }
            }
        });
        this.cache.set(cacheKey, menu, 300);
        return menu;
    }
    async getPublicParlorServices(slug) {
        const cacheKey = `parlor_services:${slug}`;
        const cached = this.cache.get(cacheKey);
        if (cached) {
            console.log(`⚡ Cache Hit: Parlor Services for slug "${slug}"`);
            return cached;
        }
        const org = await this.getOrg(slug);
        this.checkModule(org, 'PARLOR');
        const services = await this.prisma.client.parlorService.findMany({
            where: { organizationId: org.id, isActive: true },
            include: { category: true }
        });
        this.cache.set(cacheKey, services, 300);
        return services;
    }
    async publicHotelBooking(slug, data) {
        const org = await this.getOrg(slug);
        this.checkModule(org, 'HOTEL_MANAGEMENT');
        const room = await this.prisma.client.room.findFirst({
            where: { id: data.roomId, status: 'AVAILABLE' }
        });
        if (!room)
            throw new common_1.NotFoundException('Room not available');
        const booking = await this.prisma.client.booking.create({
            data: {
                organizationId: org.id,
                roomId: room.id,
                guestName: data.guestName,
                guestEmail: data.guestEmail,
                guestPhone: data.guestPhone,
                startTime: new Date(data.checkIn),
                endTime: new Date(data.checkOut),
                totalPrice: data.totalPrice,
                status: 'PENDING'
            }
        });
        this.cache.clearTenantCache(slug);
        return booking;
    }
    async publicRestaurantBooking(slug, data) {
        const org = await this.getOrg(slug);
        this.checkModule(org, 'RESTAURANT');
        this.cache.clearTenantCache(slug);
        return { message: 'Table reservation received', data };
    }
    async publicParlorBooking(slug, data) {
        const org = await this.getOrg(slug);
        this.checkModule(org, 'PARLOR');
        const services = await this.prisma.client.parlorService.findMany({
            where: { id: { in: data.serviceIds }, organizationId: org.id }
        });
        if (services.length === 0)
            throw new common_1.NotFoundException('No valid services found');
        const totalPrice = services.reduce((s, x) => s + x.price, 0);
        const paymentMethod = data.paymentMethod || 'PAY_ON_VISIT';
        const paymentStatus = paymentMethod === 'PAY_NOW' ? 'PAID' : 'UNPAID';
        const bookingStatus = paymentMethod === 'PAY_NOW' ? 'CONFIRMED' : 'PENDING';
        const parlorBooking = await this.prisma.client.serviceBooking.create({
            data: {
                guestName: data.guestName,
                guestPhone: data.guestPhone,
                guestEmail: data.guestEmail,
                bookingTime: new Date(data.bookingTime),
                totalPrice,
                status: bookingStatus,
                paymentMethod,
                paymentStatus,
                organizationId: org.id,
                services: {
                    create: services.map(s => ({
                        serviceId: s.id,
                        priceAtBooking: s.price
                    }))
                }
            }
        });
        try {
            const orConditions = [];
            if (data.guestPhone)
                orConditions.push({ phone: data.guestPhone });
            if (data.guestEmail)
                orConditions.push({ email: data.guestEmail });
            const existing = orConditions.length > 0
                ? await this.prisma.client.guestProfile.findFirst({
                    where: {
                        organizationId: org.id,
                        OR: orConditions,
                    },
                })
                : null;
            if (!existing) {
                await this.prisma.client.guestProfile.create({
                    data: {
                        organizationId: org.id,
                        name: data.guestName,
                        phone: data.guestPhone || null,
                        email: data.guestEmail || null,
                        isKswProfile: true,
                        preferences: data.notes ? { note: data.notes } : {},
                    },
                });
            }
        }
        catch (err) {
            console.error('Failed to auto-create client guest profile from public site booking:', err);
        }
        this.cache.clearTenantCache(slug);
        return parlorBooking;
    }
};
exports.PublicModuleController = PublicModuleController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Param)('slug')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicModuleController.prototype, "getPublicOrgInfo", null);
tslib_1.__decorate([
    (0, common_1.Get)('website'),
    tslib_1.__param(0, (0, common_1.Param)('slug')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicModuleController.prototype, "getPublicWebsite", null);
tslib_1.__decorate([
    (0, common_1.Get)('hotel/rooms'),
    tslib_1.__param(0, (0, common_1.Param)('slug')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicModuleController.prototype, "getPublicRooms", null);
tslib_1.__decorate([
    (0, common_1.Get)('hotel/availability'),
    tslib_1.__param(0, (0, common_1.Param)('slug')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicModuleController.prototype, "getRoomInventory", null);
tslib_1.__decorate([
    (0, common_1.Get)('restaurant/menu'),
    tslib_1.__param(0, (0, common_1.Param)('slug')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicModuleController.prototype, "getPublicMenu", null);
tslib_1.__decorate([
    (0, common_1.Get)('parlor/services'),
    tslib_1.__param(0, (0, common_1.Param)('slug')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicModuleController.prototype, "getPublicParlorServices", null);
tslib_1.__decorate([
    (0, common_1.Post)('hotel/book'),
    tslib_1.__param(0, (0, common_1.Param)('slug')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicModuleController.prototype, "publicHotelBooking", null);
tslib_1.__decorate([
    (0, common_1.Post)('restaurant/book'),
    tslib_1.__param(0, (0, common_1.Param)('slug')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicModuleController.prototype, "publicRestaurantBooking", null);
tslib_1.__decorate([
    (0, common_1.Post)('parlor/book'),
    tslib_1.__param(0, (0, common_1.Param)('slug')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PublicModuleController.prototype, "publicParlorBooking", null);
exports.PublicModuleController = PublicModuleController = tslib_1.__decorate([
    (0, common_1.Controller)('api/v1/public/:slug'),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cache_service_1.CacheService])
], PublicModuleController);
//# sourceMappingURL=public.controller.js.map