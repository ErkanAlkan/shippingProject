// src/app/vessel/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { Button, Card, Row, Col } from "react-bootstrap";
import VesselList from "~/app/components/Vessel/VesselList/VesselList";
import AuthGuard from "~/app/components/AuthGuard/AuthGuard";
import Sidebar from "~/app/components/LeftSidebar/LeftSidebar";

const VesselPage = () => {
  return (
    <AuthGuard>
      <Sidebar />
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
    </AuthGuard>
  );
};

export default VesselPage;
