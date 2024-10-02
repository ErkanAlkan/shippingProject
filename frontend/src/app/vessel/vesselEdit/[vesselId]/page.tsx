"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Card, Row } from "react-bootstrap";
import { useEffect } from "react";
import VesselEditForm from "~/app/components/Vessel/VesselEditForm/VesselEditForm";
import { showLoadingAlert } from "~/utils/sweetAlertUtils";
import Swal from "sweetalert2";

const VesselCardPage = () => {
  const { vesselId } = useParams();

  useEffect(() => {
    if (!vesselId) {
      showLoadingAlert("Loading vessel data...");
    } else {
      Swal.close();
    }
  }, [vesselId]);

  return (
    <Card>
      <Card.Body>
        <Row className="ms-5">
          <Link href="/vessel">
            <Button className="btn btn-primary mb-4">Back to Vessel List</Button>
          </Link>
          <VesselEditForm vesselId={vesselId as string} />
        </Row>
      </Card.Body>
    </Card>
  );
};

export default VesselCardPage;
