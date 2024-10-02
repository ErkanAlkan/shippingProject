import express from 'express';
import {
  createVessel,
  getAllVessels,
  deleteVesselById,
  getVesselById,
  updateVessel,
} from './controllers/vesselController';

const router = express.Router();

router.post('/create-vessel', async (req, res) => {
  const vesselData = req.body;
  try {
    const newVessel = await createVessel(vesselData);
    res.status(201).json(newVessel);
  } catch (error) {
    console.error('Error on creating vessel:', error);
    res.status(500).json({ error: 'An error occurred while creating the vessel.' });
  }
});

router.put('/update-vessel/:id', async (req, res) => {
  const vesselData = req.body;
  const { id } = req.params;
  try {
    const updatedVessel = await updateVessel(id, vesselData);
    res.status(201).json(updatedVessel);
  } catch (error) {
    console.error('Error on updating vessel:', error);
    res.status(500).json({ error: 'An error occurred while updating the vessel.' });
  }
});

router.delete('/delete-vessel/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedVessel = await deleteVesselById(id);
    res.status(200).json(deletedVessel);
  } catch (error) {
    console.error('Error on deleting vessel:', error);
    res.status(500).json({ error: 'An error occurred while deleting the vessel.' });
  }
});

router.get('/get-vessel-list', async (req, res) => {
  try {
    const vessels = await getAllVessels();
    res.json(vessels);
  } catch (error) {
    console.error('Error on fetching vessels:', error);
    res.status(500).json({ error: 'An error occurred while fetching vessels.' });
  }
});

router.get('/get-vessel/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const vessel = await getVesselById(id);
    res.json(vessel);
  } catch (error) {
    console.error('Error on fetching vessel:', error);
    res.status(500).json({ error: 'An error occurred while fetching vessel.' });
  }
});

export default router;
