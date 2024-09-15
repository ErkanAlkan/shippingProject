import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createVessel() {
  const newVessel = await prisma.vessel.create({
    data: {
      name: "BELAJA",
      design_speed: null,
      max_draft_level: 13.11,
      light_ship_weight: null,
      deadweight: 61352.00,
      hotel_load: 5,
      tonnage_per_centimeter: 60.25,
    },
  });
  console.log("New vessel created:", newVessel);
}

createVessel()
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
  })
  .finally(() => {
    prisma.$disconnect();
  });
