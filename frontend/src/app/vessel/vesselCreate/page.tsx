'use client';

import Link from 'next/link';
import {
  Card,
  Row,
} from 'react-bootstrap';
import VesselCreateForm from '~/app/components/Vessel/VesselCreateForm/VesselCreateForm';

const VesselCreatePage = () => {
  return (
    <Card>
      <Card.Body>
        <Row className="ms-4">
          <Link href="/vessel">
            <button className="btn btn-primary ms-3">
              Back to Vessel List
            </button>
          </Link>
          <VesselCreateForm />
        </Row>
      </Card.Body>
    </Card>
  );
};

export default VesselCreatePage;
