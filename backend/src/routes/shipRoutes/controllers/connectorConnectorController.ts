import { PrismaClient, connector_connector } from '@prisma/client';

const prisma = new PrismaClient();

export const getConnectorConnector = async (origin: string, destination: string): Promise<connector_connector[]> => {
    return prisma.connector_connector.findMany({
        where: { origin, destination },
        orderBy: { move_time: 'asc' },
    });
};
