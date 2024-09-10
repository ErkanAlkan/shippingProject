import express from 'express';
import { PrismaClient, connector_connector } from '@prisma/client';
const router = express.Router();
const prisma = new PrismaClient();

const app = express();
app.use(express.json());



function powerRequired(v: number, k: number): number {
    return k * Math.pow(v, 3);
}

function powerRequiredModified(v: number, w: number, A: number, m: number, n: number): number {
    return m * Math.pow((A + w), 2 / 3) * Math.pow(v, n);
}

async function calculateVesselStats(shipName: string, page: number, pageSize: number) {
    try {
      const vessel = await prisma.vessel.findFirst({
        where: { name: shipName },
        include: {
          vesselVariables: {
            skip: (page - 1) * pageSize,
            take: pageSize, 
          },
        },
      });
  
      if (!vessel) {
        throw new Error('Vessel not found');
      }
  
      if (vessel.vesselVariables.length === 0) {
        return {
          vesselName: vessel.name,
          totalFuelUsage: "0.00",
          averageSpeed: "0.00",
          averageDraftLevel: "0.00",
          message: "No vessel variables found for the current page."
        };
      }
  
      // Perform calculations: total fuel usage, average speed, average draft level
      const totalFuelUsage = vessel.vesselVariables.reduce((acc, curr) => acc + parseFloat(curr.total_fuel_usage.toString()), 0);
      const averageSpeed = vessel.vesselVariables.reduce((acc, curr) => acc + parseFloat(curr.current_vessel_speed.toString()), 0) / vessel.vesselVariables.length;
      const averageDraftLevel = vessel.vesselVariables.reduce((acc, curr) => acc + parseFloat(curr.current_draft_level.toString()), 0) / vessel.vesselVariables.length;
  
      return {
        vesselName: vessel.name,
        totalFuelUsage: totalFuelUsage.toFixed(2),
        averageSpeed: averageSpeed.toFixed(2),
        averageDraftLevel: averageDraftLevel.toFixed(2),
        page: page,
        pageSize: pageSize,
        totalVariables: vessel.vesselVariables.length
      };
  
    } catch (error) {
      console.error(error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }


router.post('/get-route', async (req, res) => {

})