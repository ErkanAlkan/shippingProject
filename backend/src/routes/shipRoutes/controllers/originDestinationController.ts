import { PrismaClient, origin_destination } from '@prisma/client';

const prisma = new PrismaClient();

export const getOriginDestination = async (origin: string, destination: string): Promise<origin_destination[]> => {
    return prisma.origin_destination.findMany({
        where: { origin, destination },
        orderBy: { move_time: 'asc' },
    });
};
