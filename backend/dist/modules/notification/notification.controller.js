"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const notification_service_1 = require("./notification.service");
let NotificationController = class NotificationController {
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    streamNotifications(userId) {
        return this.notificationService.getNotificationStream(userId).pipe((0, operators_1.map)((notification) => ({
            data: notification,
        })));
    }
    getNotifications(userId) {
        return this.notificationService.getNotifications(userId);
    }
    createNotification(userId, title, message) {
        return this.notificationService.createNotification(userId, title, message);
    }
    markAllAsRead(userId) {
        return this.notificationService.markAllAsRead(userId);
    }
    markAsRead(id) {
        return this.notificationService.markAsRead(id);
    }
};
exports.NotificationController = NotificationController;
tslib_1.__decorate([
    (0, common_1.Sse)('stream'),
    tslib_1.__param(0, (0, common_1.Query)('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", rxjs_1.Observable)
], NotificationController.prototype, "streamNotifications", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Query)('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], NotificationController.prototype, "getNotifications", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)('userId')),
    tslib_1.__param(1, (0, common_1.Body)('title')),
    tslib_1.__param(2, (0, common_1.Body)('message')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], NotificationController.prototype, "createNotification", null);
tslib_1.__decorate([
    (0, common_1.Patch)('read-all'),
    tslib_1.__param(0, (0, common_1.Body)('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], NotificationController.prototype, "markAllAsRead", null);
tslib_1.__decorate([
    (0, common_1.Patch)(':id/read'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], NotificationController.prototype, "markAsRead", null);
exports.NotificationController = NotificationController = tslib_1.__decorate([
    (0, common_1.Controller)('notifications'),
    tslib_1.__metadata("design:paramtypes", [notification_service_1.NotificationService])
], NotificationController);
//# sourceMappingURL=notification.controller.js.map