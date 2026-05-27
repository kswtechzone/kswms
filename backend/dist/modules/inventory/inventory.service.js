"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let InventoryService = class InventoryService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getInventoryItems(orgId) {
        return this.prisma.client.inventoryItem.findMany({
            where: { organizationId: orgId },
            include: {
                transactions: {
                    orderBy: { createdAt: 'desc' },
                    take: 5,
                },
            },
        });
    }
    async createInventoryItem(orgId, data) {
        return this.prisma.client.inventoryItem.create({
            data: {
                organizationId: orgId,
                name: data.name,
                sku: data.sku,
                unit: data.unit,
                quantity: data.quantity || 0,
                minQuantity: data.minQuantity || 0,
            },
        });
    }
    async addStockTransaction(itemId, orgId, data) {
        const item = await this.prisma.client.inventoryItem.findFirst({
            where: { id: itemId, organizationId: orgId },
        });
        if (!item) {
            throw new common_1.NotFoundException('Inventory item not found');
        }
        const newQuantity = data.type === 'IN'
            ? item.quantity + data.quantity
            : item.quantity - data.quantity;
        await this.prisma.client.inventoryItem.update({
            where: { id: itemId },
            data: { quantity: newQuantity },
        });
        return this.prisma.client.inventoryTransaction.create({
            data: {
                itemId,
                type: data.type,
                quantity: data.quantity,
                reference: data.reference,
            },
        });
    }
};
exports.InventoryService = InventoryService;
exports.InventoryService = InventoryService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService])
], InventoryService);
//# sourceMappingURL=inventory.service.js.map