"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const prisma_service_1 = require("../prisma/prisma.service");
let NotificationService = class NotificationService {
    constructor(prisma) {
        this.prisma = prisma;
        this.notificationSubject = new rxjs_1.Subject();
    }
    getNotificationStream(userId) {
        return this.notificationSubject.asObservable().pipe((0, operators_1.filter)((event) => event.userId === userId || event.userId === 'ALL'), (0, operators_1.map)((event) => event.notification));
    }
    async createNotification(userId, title, message) {
        const notification = await this.prisma.client.notification.create({
            data: {
                userId,
                title,
                message,
            },
        });
        this.notificationSubject.next({
            userId,
            notification,
        });
        return notification;
    }
    async getNotifications(userId) {
        return this.prisma.client.notification.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
    async markAsRead(id) {
        return this.prisma.client.notification.update({
            where: { id },
            data: { isRead: true },
        });
    }
    async markAllAsRead(userId) {
        return this.prisma.client.notification.updateMany({
            where: { userId, isRead: false },
            data: { isRead: true },
        });
    }
};
exports.NotificationService = NotificationService;
exports.NotificationService = NotificationService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NotificationService);
//# sourceMappingURL=notification.service.js.map