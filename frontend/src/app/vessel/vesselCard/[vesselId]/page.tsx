'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Button,
  Card,
  Row,
} from 'react-bootstrap';
import VesselCard from '~/app/components/Vessel/VesselCard/VesselCard';
import VesselVariableList from '~/app/components/VesselVariable/VesselVariableList/VesselVariableList';

const VesselCardPage = () => {
  const { vesselId } = useParams();

  if (!vesselId) {
    return <p>Loading...</p>;
  }

  return (
    <Card>
      <Card.Body>
        <Row className="ms-5">
          <Link href="/vessel">
            <Button className="btn btn-primary mb-4">
              Back to Vessel List
            </Button>
          </Link>
          <VesselCard
            vesselId={
              vesselId as string
            }
          />
        </Row>
        <Row className="ms-5">
          <VesselVariableList
            vesselId={
              vesselId as string
            }
          />
        </Row>
      </Card.Body>
    </Card>
  );
};

export default VesselCardPage;
