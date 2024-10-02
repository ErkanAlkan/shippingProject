import express from "express";
import { getUniquePorts } from "./controllers/portController";
import { getUniqueMiddlePoints } from "./controllers/middlePointController";

const router = express.Router();

router.get("/get-ports", async (req, res) => {
  try {
    const uniquePorts = await getUniquePorts();
    res.json(uniquePorts);
  } catch (error) {
    console.error("Error fetching unique ports:", error);
    res.status(500).json({ error: "Failed to fetch unique ports." });
  }
});

router.get("/get-middle-points", async (req, res) => {
  try {
    const uniqueMiddlePoints = await getUniqueMiddlePoints();
    res.json(uniqueMiddlePoints);
  } catch (error) {
    console.error("Error fetching unique ports:", error);
    res.status(500).json({ error: "Failed to fetch unique ports." });
  }
});

export default router;
