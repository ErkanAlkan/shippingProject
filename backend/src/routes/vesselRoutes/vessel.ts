import express from "express";
import { createVessel, getAllVessels,deleteVesselById,getVesselById } from "./controllers/vesselController";

const router = express.Router();

router.post("/create-vessel", async (req, res) => {
    const vesselData = req.body;
    // console.log('vesselData:', vesselData);
    try {
        const newVessel = await createVessel(vesselData);
        res.status(201).json(newVessel);
    } catch (error) {
        console.error("Error creating vessel:", error);
        res.status(500).json({ error: "An error occurred while creating the vessel." });
    }
});

router.delete("/delete-vessel/:id", async (req, res) => {
    const { id } = req.params;
    console.log('id:', id);
    try {
        const deletedVessel = await deleteVesselById(id);
        res.status(200).json(deletedVessel);
    } catch (error) {
        console.error("Error deleting vessel:", error);
        res.status(500).json({ error: "An error occurred while deleting the vessel." });
    }
});

router.get("/get-vessel-list", async (req, res) => {
    try {
        console.log("router.get ~ vessels: here");
        const vessels = await getAllVessels();
        res.json(vessels);
        console.log("router.get ~ vessels:", vessels);
    } catch (error) {
        console.error("Error fetching vessels:", error);
        res.status(500).json({ error: "An error occurred while fetching vessels." });
    }
        
});

router.get("/get-vessel/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const vessels = await getVesselById(id);
        res.json(vessels);
    } catch (error) {
        console.error("Error fetching vessels:", error);
        res.status(500).json({ error: "An error occurred while fetching vessels." });
    }
});

export default router;
