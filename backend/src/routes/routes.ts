import express from 'express';
import { getOriginDestination } from './controllers/originDestinationController';
import { getConnectorConnector } from './controllers/connectorConnectorController';
import { getOriginConnector } from './controllers/originConnectorController';

const router = express.Router();

router.post('/get-route', async (req, res) => {
    const { origin, destination, middlePoints = [] } = req.body;

    try {
        let routeData: any[] = [];

        if (middlePoints.length === 0) {
            routeData = await getOriginDestination(origin, destination);
        } else if (middlePoints.length === 1) {
            const firstLeg = await getOriginConnector(origin, middlePoints[0]);
            let secondLeg = await getOriginConnector(destination, middlePoints[0]);
            secondLeg.reverse();
            routeData = [...firstLeg, ...secondLeg];
        } else if (middlePoints.length === 2) {
            const firstLeg = await getOriginConnector(origin, middlePoints[0]);
            let secondLeg = await getConnectorConnector(middlePoints[0], middlePoints[1]);

            if (secondLeg.length === 0) {
                secondLeg = await getConnectorConnector(middlePoints[1], middlePoints[0]);
                if (secondLeg.length > 0) {
                    secondLeg.reverse();
                }
            }
            let thirdLeg = await getOriginConnector(destination, middlePoints[1]);
            thirdLeg.reverse();
            routeData = [...firstLeg, ...secondLeg, ...thirdLeg];
        }

        res.json(routeData);
    } catch (error) {
        console.error('Error fetching route data:', error);
        res.status(500).json({ error: 'An error occurred while fetching the route data.' });
    }
});

export default router;
