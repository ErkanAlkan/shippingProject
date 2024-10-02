import { PrismaClient, connector_connector } from '@prisma/client';

const prisma = new PrismaClient();

export const getUniqueMiddlePoints = async (): Promise<string[]> => {
    const points = await prisma.connector_connector.findMany({
        where: {
            point_type: 'o',
        },
        select: {
            origin: true,
        },
    });
    const uniqueMiddlePoints = Array.from(new Set(points.map(points => points.origin)));
    uniqueMiddlePoints.sort((a, b) => a.localeCompare(b));

    return uniqueMiddlePoints;
};
