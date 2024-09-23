import express from 'express';
import { getVesselByVariablesVesselId, createVesselVariable, deleteVesselVariableById } from './controllers/vesselVariableController';

const router = express.Router();

router.post('/create-vessel-variable', async (req, res) => {
  const vesselVariableData = req.body;
//   console.log('vesselVariableData:', vesselVariableData);
  try {
    const newVesselVariable = await createVesselVariable(vesselVariableData);
    res.status(201).json(newVesselVariable);
  } catch (error) {
    console.error('Error creating vessel variable:', error);
    res.status(500).json({ error: 'An error occurred while creating the vessel variable.' });
  }
});

router.delete('/delete-vessel-variable/:id', async (req, res) => {
  const { id } = req.params;
//   console.log('id:', id);
  try {
    const deletedVessel = await deleteVesselVariableById(id);
    res.status(200).json(deletedVessel);
  } catch (error) {
    console.error('Error deleting vessel variable:', error);
    res.status(500).json({ error: 'An error occurred while deleting the vessel variable.' });
  }
});

router.get('/get-vessel-variable-list/:vesselId', async (req, res) => {
  const { vesselId } = req.params;
  // console.log('vesselId:', vesselId);
  try {
    const vesselVariables = await getVesselByVariablesVesselId(vesselId);
    res.json(vesselVariables);
  } catch (error) {
    console.error('Error fetching vessels:', error);
    res.status(500).json({ error: 'An error occurred while fetching vessels.' });
  }
});

export default router;
