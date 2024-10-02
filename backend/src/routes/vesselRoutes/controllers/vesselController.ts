import { PrismaClient, vessel } from '@prisma/client';

const prisma = new PrismaClient();

export const createVessel = async (data: vessel): Promise<vessel> => {
  return prisma.vessel.create({
    data,
  });
};

export const updateVessel = async (id: string, data: vessel): Promise<vessel> => {
  return prisma.vessel.update({
    data,
    where: {
      id: id,
    },
  });
};

export const deleteVesselById = async (id: string): Promise<vessel | null> => {
  return prisma.vessel.delete({
    where: {
      id: id,
    },
  });
};

export const getAllVessels = async (): Promise<vessel[]> => {
  return prisma.vessel.findMany({
    orderBy: { imo: 'asc' },
  });
};

export const getVesselById = async (id: string): Promise<vessel | null> => {
  return prisma.vessel.findFirst({
    where: {
      id: id,
    },
  });
};
