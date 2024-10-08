import { PrismaClient, connector_connector } from '@prisma/client';

const prisma = new PrismaClient();

export const getUniqueMiddlePoints = async (): Promise<string[]> => {
    const points = await prisma.connector_connector.findMany({
        where: {
            point_type: 'o',
        },
        select: {
            origin: true,
            destination: true
        },
    });
    const allPoints = points.flatMap(point => [point.origin, point.destination]);
    const uniqueMiddlePoints = Array.from(new Set(allPoints));
    uniqueMiddlePoints.sort((a, b) => a.localeCompare(b));

    return uniqueMiddlePoints;
};
