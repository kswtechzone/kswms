"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HrService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HrService = class HrService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getStaff(orgId) {
        return this.prisma.client.staff.findMany({
            where: { organizationId: orgId },
            include: {
                user: { select: { name: true, email: true, role: true } },
            },
        });
    }
    async createStaff(orgId, data) {
        return this.prisma.client.staff.create({
            data: {
                organizationId: orgId,
                userId: data.userId,
                designation: data.designation,
                salary: data.salary,
                joiningDate: new Date(data.joiningDate),
                status: data.status || 'ACTIVE',
            },
        });
    }
    async addAttendance(staffId, orgId, data) {
        const staff = await this.prisma.client.staff.findFirst({
            where: { id: staffId, organizationId: orgId },
        });
        if (!staff) {
            throw new common_1.NotFoundException('Staff not found');
        }
        return this.prisma.client.attendance.create({
            data: {
                staffId,
                date: new Date(data.date),
                clockIn: data.clockIn ? new Date(data.clockIn) : null,
                clockOut: data.clockOut ? new Date(data.clockOut) : null,
                status: data.status || 'PRESENT',
            },
        });
    }
};
exports.HrService = HrService;
exports.HrService = HrService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HrService);
//# sourceMappingURL=hr.service.js.map