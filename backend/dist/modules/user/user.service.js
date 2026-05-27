"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = tslib_1.__importStar(require("bcryptjs"));
let UserService = class UserService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createOrganizationUser(orgId, data) {
        const existingUser = await this.prisma.client.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('User already exists');
        }
        const passwordHash = await bcrypt.hash(data.password, 10);
        return this.prisma.client.user.create({
            data: {
                email: data.email,
                passwordHash,
                name: data.name,
                role: data.role,
                organizationId: orgId,
            },
        });
    }
    async getOrganizationUsers(orgId) {
        return this.prisma.client.user.findMany({
            where: { organizationId: orgId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true,
            },
        });
    }
    async getAllUsers() {
        return this.prisma.client.user.findMany({
            include: { organization: true },
            orderBy: { createdAt: 'desc' }
        });
    }
    async deleteUser(orgId, userId) {
        const user = await this.prisma.client.user.findUnique({ where: { id: userId } });
        if (!user || user.organizationId !== orgId) {
            throw new common_1.ForbiddenException('Unauthorized to delete this user');
        }
        return this.prisma.client.user.delete({ where: { id: userId } });
    }
};
exports.UserService = UserService;
exports.UserService = UserService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UserService);
//# sourceMappingURL=user.service.js.map