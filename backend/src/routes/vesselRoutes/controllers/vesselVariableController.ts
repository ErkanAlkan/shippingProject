import { PrismaClient, vessel_variables } from '@prisma/client';

const prisma = new PrismaClient();

export const getAllVesselVariables = async (): Promise<vessel_variables[]> => {
  return prisma.vessel_variables.findMany({
    orderBy: {
      current_vessel_speed: 'asc',
    },
  });
};

export const getVesselVariableById = async (
  variableId: string,
): Promise<vessel_variables | null> => {
  return prisma.vessel_variables.findFirst({
    where: {
      id: variableId,
    },
  });
};

export const getVesselByVariablesVesselId = async (
  vesselId: string,
): Promise<vessel_variables[]> => {
  return prisma.vessel_variables.findMany({
    where: {
      vessel_id: vesselId,
    },
    orderBy: {
      current_vessel_speed: 'asc',
    },
  });
};

export const createVesselVariable = async (data: vessel_variables): Promise<vessel_variables> => {
  return prisma.vessel_variables.create({
    data,
  });
};

export const updateVesselVariable = async (
  id: string,
  data: vessel_variables,
): Promise<vessel_variables> => {
  return prisma.vessel_variables.update({
    data,
    where: {
      id,
    },
  });
};

export const deleteVesselVariableById = async (id: string): Promise<vessel_variables | null> => {
  return prisma.vessel_variables.delete({
    where: {
      id: id,
    },
  });
};
