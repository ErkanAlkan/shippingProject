import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface PortWithCoordinates {
  origin: string;
  latitude: number;
  longitude: number;
}

export const getUniquePorts = async (): Promise<PortWithCoordinates[]> => {
    const ports = await prisma.origin_connector.findMany({
        where: {
            point_type: 'o',
        },
        select: {
            origin: true,
            latitude: true,
            longitude: true,
        },
    });

    const uniquePorts = Array.from(
        new Map(ports.map((port) => [port.origin, port])).values()
    ).filter(port => port.latitude !== null && port.longitude !== null)
     .map(port => ({
         origin: port.origin,
         latitude: port.latitude!.toNumber(),
         longitude: port.longitude!.toNumber(),
     }));

    uniquePorts.sort((a, b) => a.origin.localeCompare(b.origin));

    return uniquePorts;
};
