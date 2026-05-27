"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CmsService = void 0;
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CmsService = class CmsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getPages(websiteId, orgId) {
        await this.verifyWebsiteOwnership(websiteId, orgId);
        return this.prisma.client.cMSPage.findMany({
            where: { websiteId },
            include: { sections: { orderBy: { order: 'asc' } } }
        });
    }
    async createPage(websiteId, orgId, data) {
        await this.verifyWebsiteOwnership(websiteId, orgId);
        return this.prisma.client.cMSPage.create({
            data: {
                websiteId,
                title: data.title,
                slug: data.slug,
                isHome: data.isHome || false,
                seoTitle: data.seoTitle,
                seoDescription: data.seoDescription,
            },
        });
    }
    async createSection(pageId, orgId, data) {
        await this.verifyPageOwnership(pageId, orgId);
        return this.prisma.client.cMSSection.create({
            data: {
                pageId,
                type: data.type,
                content: data.content,
                order: data.order || 0,
            },
        });
    }
    async updateSection(id, orgId, data) {
        const section = await this.prisma.client.cMSSection.findUnique({
            where: { id },
            include: { page: { include: { website: true } } },
        });
        if (!section || section.page.website.organizationId !== orgId) {
            throw new common_1.NotFoundException('Section not found');
        }
        return this.prisma.client.cMSSection.update({
            where: { id },
            data,
        });
    }
    async verifyWebsiteOwnership(websiteId, orgId) {
        const website = await this.prisma.client.website.findFirst({
            where: { id: websiteId, organizationId: orgId },
        });
        if (!website)
            throw new common_1.NotFoundException('Website not found');
    }
    async verifyPageOwnership(pageId, orgId) {
        const page = await this.prisma.client.cMSPage.findUnique({
            where: { id: pageId },
            include: { website: true },
        });
        if (!page || page.website.organizationId !== orgId) {
            throw new common_1.NotFoundException('Page not found');
        }
    }
};
exports.CmsService = CmsService;
exports.CmsService = CmsService = tslib_1.__decorate([
    (0, common_1.Injectable)(),
    tslib_1.__metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CmsService);
//# sourceMappingURL=cms.service.js.map