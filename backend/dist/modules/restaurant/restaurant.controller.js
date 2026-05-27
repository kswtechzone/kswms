"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RestaurantController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const restaurant_service_1 = require("./restaurant.service");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const tenant_guard_1 = require("../auth/tenant.guard");
let RestaurantController = class RestaurantController {
    constructor(restaurantService) {
        this.restaurantService = restaurantService;
    }
    getAllRestaurants() {
        return this.restaurantService.getAllRestaurants();
    }
    getRestaurants(req) {
        return this.restaurantService.getRestaurants(req.tenantId);
    }
    createRestaurant(data, req) {
        return this.restaurantService.createRestaurant(req.tenantId, data, req.user.role);
    }
    getMenu(id, req) {
        console.log(`[RestaurantController] GET menus for restaurant: ${id}, tenant: ${req.tenantId}`);
        return this.restaurantService.getMenu(id, req.tenantId);
    }
    createMenu(id, data, req) {
        return this.restaurantService.createMenu(id, req.tenantId, data);
    }
    createCategory(restaurantId, menuId, data, req) {
        return this.restaurantService.createCategory(menuId, req.tenantId, data);
    }
    createMenuItem(restaurantId, categoryId, data, req) {
        return this.restaurantService.createMenuItem(categoryId, req.tenantId, data);
    }
    createOrder(id, data, req) {
        return this.restaurantService.createOrder(id, req.tenantId, data);
    }
};
exports.RestaurantController = RestaurantController;
tslib_1.__decorate([
    (0, common_1.Get)('all'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", void 0)
], RestaurantController.prototype, "getAllRestaurants", null);
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__param(0, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RestaurantController.prototype, "getRestaurants", null);
tslib_1.__decorate([
    (0, common_1.Post)(),
    tslib_1.__param(0, (0, common_1.Body)()),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RestaurantController.prototype, "createRestaurant", null);
tslib_1.__decorate([
    (0, common_1.Get)(':id/menus'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RestaurantController.prototype, "getMenu", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/menus'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RestaurantController.prototype, "createMenu", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/menus/:menuId/categories'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Param)('menuId')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__param(3, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RestaurantController.prototype, "createCategory", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/categories/:categoryId/items'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Param)('categoryId')),
    tslib_1.__param(2, (0, common_1.Body)()),
    tslib_1.__param(3, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RestaurantController.prototype, "createMenuItem", null);
tslib_1.__decorate([
    (0, common_1.Post)(':id/orders'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__param(2, (0, common_1.Request)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], RestaurantController.prototype, "createOrder", null);
exports.RestaurantController = RestaurantController = tslib_1.__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, tenant_guard_1.TenantGuard),
    (0, common_1.Controller)('api/v1/restaurants'),
    tslib_1.__metadata("design:paramtypes", [restaurant_service_1.RestaurantService])
], RestaurantController);
//# sourceMappingURL=restaurant.controller.js.map