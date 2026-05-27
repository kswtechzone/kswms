"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const promotion_service_1 = require("../promotion/promotion.service");
let RestaurantService = class RestaurantService {
    constructor(prisma, promotionService) {
        this.prisma = prisma;
        this.promotionService = promotionService;
    }
    async getAllRestaurants() {
        return this.prisma.client.restaurant.findMany({
            include: { menus: true, tables: true, organization: true },
        });
    }
    async getRestaurants(orgId) {
        return this.prisma.client.restaurant.findMany({
            where: { organizationId: orgId },
            include: { menus: true, tables: true },
        });
    }
    async createRestaurant(orgId, data, role = 'ORG_ADMIN') {
        const targetOrgId = role === 'SUPER_ADMIN' && data.organizationId ? data.organizationId : orgId;
        return this.prisma.client.restaurant.create({
            data: {
                organizationId: targetOrgId,
                hotelId: data.hotelId,
                name: data.name,
                description: data.description,
            },
        });
    }
    async getMenu(restaurantId, orgId) {
        await this.verifyRestaurantOwnership(restaurantId, orgId);
        return this.prisma.client.menu.findMany({
            where: { restaurantId },
            include: {
                categories: {
                    include: {
                        items: true,
                    },
                },
            },
        });
    }
    async createMenu(restaurantId, orgId, data) {
        console.log(`[RestaurantService] Creating/Finding menu for restaurant ${restaurantId} in org ${orgId}`);
        await this.verifyRestaurantOwnership(restaurantId, orgId);
        const existingMenu = await this.prisma.client.menu.findFirst({
            where: { restaurantId, name: data.name },
            include: { categories: { include: { items: true } } }
        });
        if (existingMenu)
            return existingMenu;
        return this.prisma.client.menu.create({
            data: {
                restaurantId,
                name: data.name,
            },
            include: { categories: { include: { items: true } } }
        });
    }
    async createCategory(menuId, orgId, data) {
        console.log(`[RestaurantService] Creating category ${data.name} for menu ${menuId}`);
        const menu = await this.prisma.client.menu.findFirst({
            where: {
                id: menuId,
                restaurant: { organizationId: orgId }
            }
        });
        if (!menu)
            throw new common_1.NotFoundException('Menu not found or access denied');
        return this.prisma.client.menuCategory.create({
            data: {
                menuId,
                name: data.name,
            },
        });
    }
    async createMenuItem(categoryId, orgId, data) {
        console.log(`[RestaurantService] Creating item ${data.name} for category ${categoryId}`);
        const category = await this.prisma.client.menuCategory.findFirst({
            where: {
                id: categoryId,
                menu: {
                    restaurant: { organizationId: orgId }
                }
            }
        });
        if (!category)
            throw new common_1.NotFoundException('Category not found or access denied');
        return this.prisma.client.menuItem.create({
            data: {
                categoryId,
                name: data.name,
                price: data.price,
                description: data.description,
            },
        });
    }
    async createOrder(restaurantId, orgId, data) {
        await this.verifyRestaurantOwnership(restaurantId, orgId);
        let totalPrice = 0;
        const orderItems = [];
        for (const item of data.items) {
            const menuItem = await this.prisma.client.menuItem.findUnique({ where: { id: item.menuItemId } });
            if (!menuItem)
                throw new common_1.BadRequestException(`Item ${item.menuItemId} not found`);
            const itemTotal = menuItem.price * item.quantity;
            totalPrice += itemTotal;
            orderItems.push({
                menuItemId: item.menuItemId,
                quantity: item.quantity,
                price: menuItem.price,
                notes: item.notes,
            });
        }
        let discountAmount = 0;
        let appliedCoupon = null;
        if (data.couponCode) {
            const validation = await this.promotionService.validateCoupon({
                code: data.couponCode,
                amount: totalPrice,
                moduleType: 'POS',
                customerId: data.customerId,
                organizationId: orgId,
            });
            if (!validation.valid) {
                throw new common_1.BadRequestException(validation.reason);
            }
            discountAmount = validation.discountAmount;
            appliedCoupon = data.couponCode.toUpperCase();
            totalPrice = validation.finalAmount;
        }
        const createdOrder = await this.prisma.client.order.create({
            data: {
                organizationId: orgId,
                restaurantId,
                tableId: data.tableId,
                type: data.type || 'DINE_IN',
                totalPrice,
                items: {
                    create: orderItems,
                },
            },
            include: { items: true },
        });
        if (appliedCoupon) {
            await this.promotionService.redeemCoupon(appliedCoupon, totalPrice + discountAmount, 'POS', createdOrder.id, orgId, data.customerId);
        }
        return createdOrder;
    }
    async verifyRestaurantOwnership(restaurantId, orgId) {
        const restaurant = await this.prisma.client.restaurant.findFirst({
            where: { id: restaurantId, organizationId: orgId },
        });
        if (!restaurant)
            throw new common_1.NotFoundException('Restaurant not found');
    }
};
exports.RestaurantService = RestaurantService;
exports.RestaurantService = RestaurantService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService,
        promotion_service_1.PromotionService])
], RestaurantService);
//# sourceMappingURL=restaurant.service.js.map