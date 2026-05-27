"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getAll() {
        return this.userService.getAllUsers();
    }
    async getByOrg(orgId) {
        return this.userService.getOrganizationUsers(orgId);
    }
    async createInOrg(orgId, data) {
        return this.userService.createOrganizationUser(orgId, data);
    }
    async delete(id, orgId) {
        return this.userService.deleteUser(orgId, id);
    }
};
exports.UserController = UserController;
tslib_1.__decorate([
    (0, common_1.Get)(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getAll", null);
tslib_1.__decorate([
    (0, common_1.Get)('organization/:orgId'),
    tslib_1.__param(0, (0, common_1.Param)('orgId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getByOrg", null);
tslib_1.__decorate([
    (0, common_1.Post)('organization/:orgId'),
    tslib_1.__param(0, (0, common_1.Param)('orgId')),
    tslib_1.__param(1, (0, common_1.Body)()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "createInOrg", null);
tslib_1.__decorate([
    (0, common_1.Delete)(':id/organization/:orgId'),
    tslib_1.__param(0, (0, common_1.Param)('id')),
    tslib_1.__param(1, (0, common_1.Param)('orgId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "delete", null);
exports.UserController = UserController = tslib_1.__decorate([
    (0, common_1.Controller)('users'),
    tslib_1.__metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map