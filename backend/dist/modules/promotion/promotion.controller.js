"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const promotion_service_1 = require("./promotion.service");
const validate_coupon_dto_1 = require("./dto/validate-coupon.dto");
let PromotionController = class PromotionController {
    constructor(promotionService) {
        this.promotionService = promotionService;
    }
    async validateCoupon(dto) {
        return this.promotionService.validateCoupon(dto);
    }
    async createCoupon(dto) {
        return this.promotionService.createCoupon(dto);
    }
    async listCoupons(organizationId) {
        return this.promotionService.listCoupons(organizationId);
    }
};
exports.PromotionController = PromotionController;
tslib_1.__decorate([
    (0, common_1.Post)('validate'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [validate_coupon_dto_1.ValidateCouponDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PromotionController.prototype, "validateCoupon", null);
tslib_1.__decorate([
    (0, common_1.Post)('coupon/create'),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [validate_coupon_dto_1.CreateCouponDto]),
    tslib_1.__metadata("design:returntype", Promise)
], PromotionController.prototype, "createCoupon", null);
tslib_1.__decorate([
    (0, common_1.Get)('coupon/list'),
    tslib_1.__param(0, (0, common_1.Query)('organizationId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PromotionController.prototype, "listCoupons", null);
exports.PromotionController = PromotionController = tslib_1.__decorate([
    (0, common_1.Controller)('promotion'),
    tslib_1.__metadata("design:paramtypes", [promotion_service_1.PromotionService])
], PromotionController);
//# sourceMappingURL=promotion.controller.js.map