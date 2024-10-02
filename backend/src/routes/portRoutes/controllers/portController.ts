import { PrismaClient, origin_connector } from '@prisma/client';

const prisma = new PrismaClient();

export const getUniquePorts = async (): Promise<string[]> => {
    const ports = await prisma.origin_connector.findMany({
        where: {
            point_type: 'o',
        },
        select: {
            origin: true,
        },
    });
    const uniquePorts = Array.from(new Set(ports.map(port => port.origin)));
    uniquePorts.sort((a, b) => a.localeCompare(b));

    return uniquePorts;
};
