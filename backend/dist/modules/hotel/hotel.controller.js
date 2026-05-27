"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotelController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const hotel_service_1 = require("./hotel.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
let HotelController = class HotelController {
    constructor(hotelService) {
        this.hotelService = hotelService;
    }
    async createHotel(data, req) {
        return this.hotelService.createHotel({ ...data, organizationId: req.tenantId });
    }
    async getHotels(req) {
        return this.hotelService.getHotelsByOrganization(req.tenantId);
    }
    async addRoom(data, req) {
        return this.hotelService.addRoom(data);
    }
    async getRooms(hotelId) {
        return this.hotelService.getHotelRooms(hotelId);
    }
    async createBooking(data, req) {
        return this.hotelService.createBooking(req.tenantId, data);
    }
    async getRoomBookings(roomId) {
        return this.hotelService.getBookingsByRoom(roomId);
    }
    async getRecentBookings(req) {
        return this.hotelService.getRecentBookings(req.tenantId);
    }
};
exports.HotelController = HotelController;
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HotelController.prototype, "createHotel", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HotelController.prototype, "getHotels", null);
tslib_1.__decorate([
    (0, common_1.Post)('room'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HotelController.prototype, "addRoom", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id/rooms'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HotelController.prototype, "getRooms", null);
tslib_1.__decorate([
    (0, common_1.Post)('booking'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HotelController.prototype, "createBooking", null);
tslib_1.__decorate([
    (0, common_1.Get)('room/:roomId/bookings'),
    tslib_1.__param(0, (0, common_1.Param)('roomId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], HotelController.prototype, "getRoomBookings", null);
tslib_1.__decorate([
    (0, common_1.Get)('recent'),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], HotelController.prototype, "getRecentBookings", null);
exports.HotelController = HotelController = tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Controller)('api/v1/hotel'),
    tslib_1.__metadata("design:paramtypes", [hotel_service_1.HotelService])
], HotelController);
//# sourceMappingURL=hotel.controller.js.map