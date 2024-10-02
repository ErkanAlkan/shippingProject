import express from 'express';
import {
  createVesselVariable,
  deleteVesselVariableById,
  getVesselByVariablesVesselId,
  getVesselVariableById,
  updateVesselVariable,
} from './controllers/vesselVariableController';

const router = express.Router();

router.post('/create-vessel-variable', async (req, res) => {
  const vesselVariableData = req.body;
  try {
    const newVesselVariable = await createVesselVariable(vesselVariableData);
    res.status(201).json(newVesselVariable);
  } catch (error) {
    console.error('Error on creating vessel variable:', error);
    res.status(500).json({ error: 'An error occurred while creating the vessel variable.' });
  }
});

router.put('/update-vessel-variable/:id', async (req, res) => {
  const vesselVariableData = req.body;
  const { id } = req.params;
  try {
    const updatedVesselVariable = await updateVesselVariable(id, vesselVariableData);
    res.status(201).json(updatedVesselVariable);
  } catch (error) {
    console.error('Error on updating vessel variable:', error);
    res.status(500).json({ error: 'An error occurred while updating the vessel variable.' });
  }
});

router.delete('/delete-vessel-variable/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedVessel = await deleteVesselVariableById(id);
    res.status(200).json(deletedVessel);
  } catch (error) {
    console.error('Error on deleting vessel variable:', error);
    res.status(500).json({ error: 'An error occurred while deleting the vessel variable.' });
  }
});

router.get('/get-vessel-variable/:variableId', async (req, res) => {
  const { variableId } = req.params;
  try {
    const vesselVariable = await getVesselVariableById(variableId);
    res.json(vesselVariable);
  } catch (error) {
    console.error('Error on fetching vessel variable:', error);
    res.status(500).json({ error: 'An error occurred while fetching vessel variable.' });
  }
});

router.get('/get-vessel-variable-list/:vesselId', async (req, res) => {
  const { vesselId } = req.params;
  try {
    const vesselVariables = await getVesselByVariablesVesselId(vesselId);
    res.json(vesselVariables);
  } catch (error) {
    console.error('Error on fetching vessels:', error);
    res.status(500).json({ error: 'An error occurred while fetching vessels.' });
  }
});

export default router;
