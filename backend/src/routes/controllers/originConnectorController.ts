import { PrismaClient, origin_connector } from '@prisma/client';

const prisma = new PrismaClient();

export const getOriginConnector = async (origin: string, destination: string): Promise<origin_connector[]> => {
    return prisma.origin_connector.findMany({
        where: {
            origin: { equals: origin, mode: 'insensitive' },
            destination: { equals: destination, mode: 'insensitive' },
        },
        orderBy: { move_time: 'asc' },
    });
};
