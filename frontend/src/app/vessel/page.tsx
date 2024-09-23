'use client';

import Link from 'next/link';
import { Button, Card, Row, Col } from 'react-bootstrap';
import VesselList from '../components/Vessel/VesselList/VesselList';

const VesselPage = () => {
  return (
    <Card>
      <Card.Body>
        <Row className="ms-4">
          <Col>
            <Link href="/vessel/vesselCreate" passHref>
              <Button variant="primary" className="ms-4">
                Create Vessel
              </Button>
            </Link>
            <VesselList />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default VesselPage;
